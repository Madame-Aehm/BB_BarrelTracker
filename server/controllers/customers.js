import Customer from '../models/customers.js';
import Barrel from '../models/barrels.js';
import customerCache from '../config/cache.js';

const getCustomers = async(_, res) => {
  try {
    const cachedCustomers = customerCache.get("customers");
    if (cachedCustomers === undefined) {
      const customers = await Customer.find();
      customerCache.set("customers", { customers });
      return res.status(200).json(customers);
    } 
    res.status(200).json(cachedCustomers.customers);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const addCustomer = async(req, res) => {
  const { name } = req.body;
  if (!name) return res.status(401).json({ error: "Who is it? Name names!" });
  try {
    await Customer.create({ name: name.trim(), active: true });
    const customers = await Customer.find();
    customerCache.set("customers", { customers });
    res.status(201).json({ message: "Customer created!" });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) return res.status(401).json({ error: "Name already in use" });
    res.status(500).json({ error: "Server Error" });
  }
}

const getCustomerHistory = async(req, res) => {
  const { name } = req.params;
  if (!name) return res.status(401).json({ error: "Need customer name" });
  try {
    const barrels = await Barrel.find({
      $or:[
        { history: { $elemMatch: { customer: name }}},
        { "open.customer": name }
      ]});
    const histories = [];
    barrels.forEach((brl) => {
      const brlObj = brl.toObject();
      if (brlObj.open && brlObj.open.customer === name) {
        histories.push({ ...brlObj.open, createdAt: new Date(brlObj.open.createdAt), barrel: brlObj.number });
      }
      brlObj.history.forEach((h) => {
        if (h.customer === name) {
          histories.push({ ...h, createdAt: new Date(h.createdAt), barrel: brlObj.number })
        }
      })
    })
    histories.sort((a, b) => b.createdAt - a.createdAt);
    res.send(histories);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

export { getCustomers, addCustomer, getCustomerHistory }