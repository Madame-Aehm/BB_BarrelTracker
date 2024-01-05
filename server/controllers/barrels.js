import Barrel from '../models/barrels.js'
import sendEmail from '../utils/sendEmail.js';

const getBarrelById = async(req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Barrel ID required" });
  try {
    const barrel = await Barrel.findById(id, "-history");
    if (!barrel) return res.status(404).json({ error: `No barrel with ID: ${id}` });
    // if (barrel.damaged) return res.status(401).json({ error: "Barrel marked as damaged - don't use." });
    res.status(200).json(barrel);
  } catch (e) {
    res.status(500).json({ error: "Server Error" });
  }
}

const getBarrelByNumber = async(req, res) => {
  const number = Number(req.params.number);
  if (!number) return res.status(400).json({ error: "Barrel Number required" });
  try {
    const barrel = await Barrel.findOne({ number: number }, "-history");
    if (!barrel) return res.status(404).json({ error: `No barrel with Number: ${number}` });
    // if (barrel.damaged) return res.status(401).json({ error: "Barrel marked as damaged - don't use." });
    res.status(200).json(barrel);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const getAllBarrelIDS = async(_, res) => {
  try {
    const ids = (await Barrel.find().sort({ number: "asc" })).map(b => { return { _id: b._id, number: b.number } });
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
    const barrel = await Barrel.findOne({ number: number });
    if (!barrel) return res.status(404).json({ error: `No barrel with Number: ${number}` });
    res.status(200).json({ _id: barrel._id, number: barrel.number });
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
    const existingBarrels = await Barrel.find().sort({ number: "desc" });
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
    res.status(201).json({ message: `${number} new barrels successfully added` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const sendBarrel = async(req, res) => {
  const { id, sendTo } = req.body;
  if (!id || !sendTo) return res.status(401).json({ error: "Missing fields" })
  try {
    await Barrel.findByIdAndUpdate(id, {
      home: false,
      open: sendTo
    });
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
    await Barrel.findByIdAndUpdate(id, {
      $push: { history: { ...open, returned: new Date() } },
      home: true,
      open: null
    }, { new: true });
    res.status(200).json({ message: "Barrel marked as returned." });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const reviewDamageRequest = async(req, res) => {
  const { id, open, reviewResponse, damaged } = req.body;
  if (!id || !open || typeof damaged !== "boolean") return res.status(401).json({ error: "Missing fields" });
  try {
    const trackDamage = {
      ...open.damage_review,
      closed: new Date(),
      opened: new Date(open.opened),
      reviewResponse
    }
    const barrel = await Barrel.findByIdAndUpdate(id, {
      $push: { history: { ...open, damage_review: trackDamage } },
      damaged,
      open: null
    });
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
  const damage_review = {
    opened: new Date(),
  }
  if (comments) damage_review.comments = comments;
  try {
    const barrel = await Barrel.findByIdAndUpdate(id, {
      'open.damage_review': damage_review,
      'open.returned': new Date()
    });
    const emailSent = await sendEmail(barrel, comments);
    res.status(200).json({ message: `Barrel submitted for damage review. ${emailSent ? "An email has been sent to Pablo." : "Email couldn't send - please inform Pablo."}` })
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

export { 
  addBarrels, 
  getBarrelById, 
  getBarrelByNumber, 
  getAllBarrelIDS, 
  getSingleID, 
  sendBarrel, 
  returnBarrel,
  requestDamageReview,
  reviewDamageRequest }