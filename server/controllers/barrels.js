import Barrel from '../models/barrels.js'
import { formatBarrelSimple } from '../utils/formatBarrel.js';
import sendEmail from '../utils/sendEmail.js';

const getBarrelById = async(req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Barrel ID required" });
  try {
    const barrel = await Barrel.findById(id);
    if (!barrel) return res.status(404).json({ error: `No barrel with ID: ${id}` });
    if (barrel.damaged) return res.status(401).json({ error: "Barrel marked as damaged - don't use." });
    res.status(200).json(formatBarrelSimple(barrel));
  } catch (e) {
    res.status(500).json({ error: "Server Error" });
  }
}

const getBarrelByNumber = async(req, res) => {
  const number = Number(req.params.number);
  if (!number) return res.status(400).json({ error: "Barrel Number required" });
  try {
    const barrel = await Barrel.findOne({ number: number });
    if (!barrel) return res.status(404).json({ error: `No barrel with Number: ${number}` });
    if (barrel.damaged) return res.status(401).json({ error: "Barrel marked as damaged - don't use." });
    res.status(200).json(formatBarrelSimple(barrel));
  } catch (e) {
    res.status(500).json({ error: "Server Error" });
  }
}

const getAllBarrelIDS = async(_, res) => {
  try {
    const ids = (await Barrel.find().sort({ number: "asc" })).map(b => { return { _id: b._id, number: b.number } });
    res.status(200).json(ids);
  } catch (e) {
    console.log(e);
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
        damaged: false
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
  console.log(id, sendTo);
  if (!id || !sendTo) return res.status(401).json({ error: "Missing fields" })
  try {
    const barrel = await Barrel.findById(id);
    if (barrel.damaged) return res.status(401).json({ error: "Barrel marked as damaged - don't send out" });
    if (!barrel.home) return res.status(401).json({ error: "Barrel already out." });
    barrel.home = false;
    barrel.history = [sendTo, ...barrel.history];
    await barrel.save();
    res.status(200).json({ message: `Barrel successfully sent to ${sendTo.customer}` });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const returnBarrel = async(req, res) => {
  const { id } = req.body;
  if (!id) return res.status(401).json({ error: "Need ID" });
  try {
    const barrel = await Barrel.findById(id);
    if (barrel.home) return res.status(401).json({ error: "Barrel already home.." })
    barrel.home = true;
    barrel.history[0].returned = new Date();
    await barrel.save();
    res.status(200).json({ message: "Barrel marked as returned." });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const markAsDamaged = async(req, res) => {
  const { id } = req.body;
  if (!id) return res.status(401).json({ error: "Need ID" });
  try {
    const barrel = await Barrel.findByIdAndUpdate(id, { damaged: true, home: true });
    if (!barrel) return res.status(404).json({ error: "No barrel could be found" });
    res.status(200).json({ message: `Barrel ${barrel.number} successfully marked as damaged` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const requestDamageReview = async(req, res) => {
  const { id, comments } = req.body;
  if (!id) return res.status(401).json({ error: "Need ID" });
  const damage_review = {
    date: new Date(),
    checked: false
  }
  if (comments) damage_review.comments = comments;
  try {
    const barrel = await Barrel.findById(id);
    barrel.history[0].damage_review = damage_review;
    await barrel.save();
    const emailSent = sendEmail(barrel, comments);
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
  markAsDamaged,
  requestDamageReview }