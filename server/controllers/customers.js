import Customer from '../models/customers.js';
import Barrel from '../models/barrels.js';
import customerCache from '../config/cache.js';
import customerAlphSort from '../utils/sortCustomers.js';

const getActiveCustomers = async(_, res) => {
  try {
    const cachedCustomers = customerCache.get("activeCustomers");
    if (cachedCustomers === undefined) {
      const customers = await Customer.find({ active: true });
      customerAlphSort(customers);
      customerCache.set("activeCustomers", { customers });
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
    await Customer.create({ name: name.trim() });
    const allCustomers = await Customer.find();
    customerAlphSort(allCustomers);
    const activeCustomers = allCustomers.filter((c) => c.active);
    customerCache.set("activeCustomers", { activeCustomers });
    res.status(201).json({ message: "Customer created!", allCustomers, activeCustomers });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) return res.status(401).json({ error: "Name already in use" });
    res.status(500).json({ error: "Server Error" });
  }
}

const toggleActive = async(req, res) => {
  const { name } = req.body;
  if (!name) return res.status(401).json({ error: "Need customer name" });
  try {
    const customer = await Customer.findOne({ name });
    if (!customer) return res.status(404).json({ error: "No customer with that name" });
    customer.active = !customer.active;
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const getCustomerHistory = async(req, res) => {
  const { name } = req.params;
  console.log(name);
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

export { getActiveCustomers, addCustomer, toggleActive, getCustomerHistory }