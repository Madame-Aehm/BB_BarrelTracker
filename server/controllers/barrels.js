import Barrel from '../models/barrels.js'
import localDate from '../utils/localDate.js';
import { barrelDamagedEmail } from '../utils/sendEmail.js';
import { v2 as cloudinary } from "cloudinary";
import { badRequest, notFound } from '../errors/AppError.js';

const parseEdits = (raw) => {
  if (!raw) throw badRequest("Missing edits");
  try {
    return JSON.parse(raw);
  } catch {
    throw badRequest("Invalid edits JSON");
  }
};

const getBarrel = async (req, res) => {
  const { id, number, history } = req.query;
  if (!id && !number) throw badRequest("Need identifier");
  if (id) {
    const barrel = await Barrel.findById(id, history ? "" : "-history");
    if (!barrel) throw notFound(`No barrel with ID: ${id}`);
    return res.status(200).json(barrel);
  }
  const barrel = await Barrel.findOne({ number: number }, history ? "" : "-history");
  if (!barrel) throw notFound(`No barrel with Number: ${number}`);
  res.status(200).json(barrel);
};

const sendBarrel = async (req, res) => {
  const { id, sendTo } = req.body;
  if (!id || !sendTo) throw badRequest("Missing fields");
  const barrel = await Barrel.findByIdAndUpdate(
    id,
    { open: sendTo },
    { new: true, select: "_id" }
  );
  if (!barrel) throw notFound(`No barrel with ID: ${id}`);
  res.status(200).json({ message: `Barrel successfully sent to ${sendTo.customer}` });
};

const returnBarrel = async (req, res) => {
  const { id, open } = req.body;
  if (!id || !open) throw badRequest("Missing fields");
  const barrel = await Barrel.findByIdAndUpdate(
    id,
    {
      $push: { history: { $each: [{ ...open, returned: localDate(new Date()) }], $position: 0 } },
      open: null,
    },
    { new: true, select: "_id" }
  );
  if (!barrel) throw notFound(`No barrel with ID: ${id}`);
  res.status(200).json({ message: "Barrel marked as returned." });
};

const reviewDamageRequest = async (req, res) => {
  const { id, open, response, damaged } = req.body;
  if (!id || !open || typeof damaged !== "boolean") throw badRequest("Missing fields");
  const trackDamage = {
    ...open.damage_review,
    closed: localDate(new Date()),
  };
  if (response) trackDamage.response = response;
  const barrel = await Barrel.findByIdAndUpdate(
    id,
    {
      $push: { history: { $each: [{ ...open, damage_review: trackDamage }], $position: 0 } },
      damaged,
      open: null,
    },
    { new: true, select: "_id number" }
  );
  if (!barrel) throw notFound(`No barrel with ID: ${id}`);
  res.status(200).json({
    message: `Barrel ${barrel.number} successfully marked as ${damaged ? "" : "not"} damaged`,
  });
};

const requestDamageReview = async (req, res) => {
  const { id, comments } = req.body;
  if (!id) throw badRequest("Need ID");
  const damage_review = {};
  if (comments) damage_review.comments = comments;

  let relevantFields;
  if (req.files?.length) {
    const promises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "bb_tracker" })
    );
    const images = await Promise.all(promises);
    relevantFields = images.map((image) => ({
      public_id: image.public_id,
      url: image.secure_url,
    }));
    damage_review.images = relevantFields;
  }

  const barrel = await Barrel.findByIdAndUpdate(
    id,
    {
      "open.damage_review": damage_review,
      "open.returned": localDate(new Date()),
    },
    { new: true, select: "-history" }
  );
  if (!barrel) throw notFound(`No barrel with ID: ${id}`);

  const emailSent = await barrelDamagedEmail(barrel, comments, relevantFields);
  res.status(200).json({
    message: `Barrel submitted for damage review. ${emailSent ? "An email has been sent to Pablo." : "Email couldn't send - please inform Pablo."}`,
  });
};

const addBarrels = async (req, res) => {
  const number = Number(req.body.number);
  if (!number) throw badRequest("Need to know how many...");

  let offset = 1;
  const existingBarrels = await Barrel.find({}, "-history").sort({ number: "desc" });
  if (existingBarrels.length) {
    offset = existingBarrels.map((b) => b.number).sort((a, b) => b - a)[0] + 1;
  }
  const barrelsToAdd = [];
  for (let i = offset; i < offset + number; i++) {
    barrelsToAdd.push(
      new Barrel({
        number: i,
        damaged: false,
        open: null,
      }).save()
    );
  }
  await Promise.all(barrelsToAdd);
  res.status(201).json({
    message: `${number} new barrel${number === 1 ? "" : "s"} successfully added`,
  });
};

const manageAll = async (_, res) => {
  const barrels = await Barrel.find({}, "-history").sort({ number: "desc" });
  res.status(200).json(barrels);
};

const getAllBarrelIDS = async (_, res) => {
  const ids = await Barrel.find({}, "_id number").sort({ number: "asc" });
  res.status(200).json(ids);
};

const getSingleID = async (req, res) => {
  const number = Number(req.params.number);
  if (!number) throw badRequest("Need Barrel Number");
  const barrel = await Barrel.findOne({ number: number }, "_id number");
  if (!barrel) throw notFound(`No barrel with Number: ${number}`);
  res.status(200).json([barrel]);
};

const updateBarrel = async (req, res) => {
  const edits = parseEdits(req.body.edits);
  const files = req.files;

  if (edits.open && edits.open.damage_review) {
    const control = await Barrel.findById(edits._id);
    if (edits.damaged && control && !control.damaged) {
      edits.open.damage_review.closed = localDate(new Date());
    }
    if (!edits.open.returned) {
      edits.open.damage_review = undefined;
    }
    if (control?.open?.damage_review?.images) {
      const editedImages = edits.open.damage_review?.images;
      const imagesToDelete = !editedImages
        ? control.open.damage_review.images
        : control.open.damage_review.images.filter((img) => {
            return !editedImages.some((e) => e.public_id === img.public_id);
          });
      await Promise.all(
        imagesToDelete.map((img) => cloudinary.uploader.destroy(img.public_id))
      );
    }
    if (files?.length) {
      const promises = files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "bb_tracker" })
      );
      const images = await Promise.all(promises);
      const relevantFields = images.map((image) => ({
        public_id: image.public_id,
        url: image.secure_url,
      }));
      edits.open.damage_review.images = [
        ...(edits.open.damage_review.images ?? []),
        ...relevantFields,
      ];
    }
  }

  const barrel = await Barrel.findByIdAndUpdate(edits._id, { ...edits }, { new: true }).select(
    "-history"
  );
  if (!barrel) throw notFound("No barrel");

  if (
    (barrel.open && barrel.open.returned && !barrel.open.damage_review) ||
    (barrel.open && barrel.open.returned && barrel.damaged)
  ) {
    const closeInvoice = await Barrel.findByIdAndUpdate(
      barrel._id,
      {
        $push: { history: { $each: [{ ...barrel.open }], $position: 0 } },
        open: null,
      },
      { new: true, select: "-history" }
    );
    if (closeInvoice) return res.status(200).json(closeInvoice);
  }
  res.status(200).json(barrel);
};

const updateHistory = async (req, res) => {
  const edits = parseEdits(req.body.edits);
  const files = req.files;

  const barrel = await Barrel.findById(req.body.barrel_id);
  if (!barrel) throw notFound("No barrel");

  const reopenInvoice =
    !barrel.open &&
    (!edits.returned || (edits.returned && edits.damage_review && !edits.damage_review.closed));

  if (!edits.damage_review) {
    edits.damage_review = undefined;
  }

  const historyIndex = barrel.history.map((his) => his._id.toString()).indexOf(edits._id);
  if (historyIndex === -1) throw notFound("History entry not found");

  const historyToUpdate = barrel.history[historyIndex];
  if (historyToUpdate.damage_review?.images) {
    const editedImages = edits.damage_review?.images;
    const imagesToDelete = !editedImages
      ? historyToUpdate.damage_review.images
      : historyToUpdate.damage_review.images.filter((img) => {
          return !editedImages.some((e) => e.public_id === img.public_id);
        });
    await Promise.all(
      imagesToDelete.map((img) => cloudinary.uploader.destroy(img.public_id))
    );
  }

  if (files?.length) {
    const promises = files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "bb_tracker" })
    );
    const images = await Promise.all(promises);
    const relevantFields = images.map((image) => ({
      public_id: image.public_id,
      url: image.secure_url,
    }));
    edits.damage_review.images = [
      ...(edits.damage_review?.images ?? []),
      ...relevantFields,
    ];
  }

  if (reopenInvoice) {
    barrel.open = { ...edits };
    barrel.history = barrel.history.filter(
      (history) => history._id.toString() !== edits._id
    );
  } else {
    barrel.history = barrel.history.map((history) => {
      if (history._id.toString() === edits._id) {
        return { ...history, ...edits };
      }
      return history;
    });
  }

  await barrel.save();
  res.status(200).json(barrel.history[historyIndex]);
};

export {
  getBarrel,
  sendBarrel,
  returnBarrel,
  reviewDamageRequest,
  requestDamageReview,
  addBarrels,
  manageAll,
  getAllBarrelIDS,
  getSingleID,
  updateBarrel,
  updateHistory,
};
