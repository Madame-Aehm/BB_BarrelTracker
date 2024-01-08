import express from 'express'
import Customer from '../models/customers.js'

const router = express.Router();

router.post("/new", async(req, res) => {
  const { name } = req.body;
  if (!name) return res.status(401).json({ error: "Who is it? Name names!" });
  try {
    await Customer.create({ name, active: true });
    res.status(201).json({ message: "Customer created!" });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) return res.status(401).json({ error: "Name already in use" });
    res.status(500).json({ error: "Server Error" });
  }
})

export default router