import Barrel from '../models/barrels.js'
import localDate from '../utils/localDate.js';
import { barrelDamagedEmail } from '../utils/sendEmail.js';
import { v2 as cloudinary } from "cloudinary";

const getBarrel = async(req, res) => {
  const { id, number, history } = req.query;
  if (!id && !number) return res.status(401).json({ error: "Need identifier" });
  try {
    if (id) {
      const barrel = await Barrel.findById(id, history ? "" : "-history");
      if (!barrel) return res.status(404).json({ error: `No barrel with ID: ${id}` });
      res.status(200).json(barrel);
    } else {
      const barrel = await Barrel.findOne({ number: number }, history ? "" : "-history");
      if (!barrel) return res.status(404).json({ error: `No barrel with Number: ${number}` });
      res.status(200).json(barrel);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const sendBarrel = async(req, res) => {
  const { id, sendTo } = req.body;
  if (!id || !sendTo) return res.status(401).json({ error: "Missing fields" })
  try {
    const barrel = await Barrel.findByIdAndUpdate(id, {
      home: false,
      open: sendTo
    }, { new: true, select: "_id" });
    if (!barrel) return res.status(404).json({ error: `No barrel with ID: ${id}` });
    res.status(200).json({ message: `Barrel successfully sent to ${sendTo.customer}` });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const returnBarrel = async(req, res) => {
  const { id, open } = req.body;
  if (!id || !open) return res.status(401).json({ error: "Missing fields" });
  try {
    const barrel = await Barrel.findByIdAndUpdate(id, {
      $push: { history: { $each: [{ ...open, returned: localDate(new Date()) }], $position: 0 } },
      home: true,
      open: null
    }, { new: true, select: "_id" });
    if (!barrel) return res.status(404).json({ error: `No barrel with ID: ${id}` });
    res.status(200).json({ message: "Barrel marked as returned." });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const reviewDamageRequest = async(req, res) => {
  const { id, open, response, damaged } = req.body;
  if (!id || !open || typeof damaged !== "boolean") return res.status(401).json({ error: "Missing fields" });
  try {
    const trackDamage = {
      ...open.damage_review,
      closed: localDate(new Date())
    }
    if (response) trackDamage.response = response;
    const barrel = await Barrel.findByIdAndUpdate(id, {
      $push: { history: { $each: [{ ...open, damage_review: trackDamage }], $position: 0 }},
      damaged,
      open: null
    }, { new: true, select: "_id number" });
    res.status(200).json({ 
      message: `Barrel ${barrel.number} successfully marked as ${damaged ? "" : "not"} damaged` 
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const requestDamageReview = async(req, res) => {
  const { id, comments } = req.body;
  if (!id) return res.status(401).json({ error: "Need ID" });
  const damage_review = {}
  if (comments) damage_review.comments = comments;
  try {
    let relevantFields;
    if (req.files) {
      const promises = req.files.map((file) => cloudinary.uploader.upload(file.path, { folder: "bb_tracker" }))
      const images = await Promise.all(promises);
      console.log("images", images);
      relevantFields = images.map((image) => { return { public_id: image.public_id, url: image.secure_url }})
      damage_review.images = relevantFields;
    }
    const barrel = await Barrel.findByIdAndUpdate(id, {
      'open.damage_review': damage_review,
      'open.returned': localDate(new Date())
    }, { new: true, select: "-history" });
    const emailSent = await barrelDamagedEmail(barrel, comments, relevantFields);
    res.status(200).json({ message: `Barrel submitted for damage review. ${emailSent ? "An email has been sent to Pablo." : "Email couldn't send - please inform Pablo."}` })
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const addBarrels = async(req, res) => {
  const number = Number(req.body.number);
  if (!number) {
    return res.status(400).json({ error: "Need to know how many..." });
  }
  let offset = 1;
  try {
    const existingBarrels = await Barrel.find({}, "-history").sort({ number: "desc" });
    if (existingBarrels.length) {
      offset = existingBarrels.map((b) => b.number).sort((a, b) => b - a)[0] + 1;
    }
    const barrelsToAdd = [];
    for (let i = offset; i < offset + number; i++) {
      barrelsToAdd.push(new Barrel({
        number: i,
        home: true,
        damaged: false,
        open: null
      }).save())
    }
    await Promise.all(barrelsToAdd);
    res.status(201).json({ message: `${number} new barrel${number === 1 ? "" : "s"} successfully added` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const manageAll = async(_, res) => {
  try {
    const barrels = await Barrel.find({}, "-history").sort({ number: "desc" });
    res.status(200).json(barrels);
  } catch (error) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const getAllBarrelIDS = async(_, res) => {
  try {
    const ids = await Barrel.find({}, "_id number").sort({ number: "asc" });
    res.status(200).json(ids);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const getSingleID = async(req, res) => {
  const number = Number(req.params.number);
  if (!number) return res.status(400).json({ error: "Need Barrel Number" });
  try {
    const barrel = await Barrel.findOne({ number: number }, "_id number");
    if (!barrel) return res.status(404).json({ error: `No barrel with Number: ${number}` });
    res.status(200).json([barrel]);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const updateBarrel = async(req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "testing" });
}

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
  updateBarrel
 }