import Barrel from '../models/barrels.js'
import { generateQRCode } from '../utils/generateQRCode.js';

const getBarrelById = async(req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Barrel ID required" });
  try {
    const barrel = await Barrel.findById(id);
    if (!barrel) return res.status(404).json({ error: `No barrel with ID: ${id}` });
    res.status(200).json(barrel);
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
    res.status(200).json(barrel);
  } catch (e) {
    res.status(500).json({ error: "Server Error" });
  }
}

const getAllBarrelIDS = async(req, res) => {
  try {
    // const barrels = await Barrel.find();
    const ids = (await Barrel.find()).map(b => { return { _id: b._id, number: b.number } });
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
    const existingBarrels = await Barrel.find();
    if (existingBarrels.length) {
      offset = existingBarrels.map((b) => b.number).sort((a, b) => b - a)[0] + 1;
    }
    const barrelsToAdd = [];
    for (let i = offset; i < offset + number; i++) {
      barrelsToAdd.push(new Barrel({
        number: i,
        current: {
          date: new Date(),
          by: "Emily",
          where: "BB"
        },
        history: []
      }).save())
    }
    await Promise.all(barrelsToAdd);
    res.status(201).json({ message: `${number} new barrels successfully added` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

export { addBarrels, getBarrelById, getBarrelByNumber, getAllBarrelIDS, getSingleID }