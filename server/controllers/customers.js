import Customer from '../models/customers.js';
import Barrel from '../models/barrels.js';
import customerCache from '../config/cache.js';
import customerAlphSort from '../utils/sortCustomers.js';
import { badRequest, notFound } from '../errors/AppError.js';

const getActiveCustomers = async (_, res) => {
  const cachedCustomers = customerCache.get("activeCustomers");
  if (cachedCustomers === undefined) {
    const customers = await Customer.find({ active: true });
    customerAlphSort(customers);
    customerCache.set("activeCustomers", { customers });
    return res.status(200).json(customers);
  }
  res.status(200).json(cachedCustomers.customers);
};

const addCustomer = async (req, res) => {
  const { name } = req.body;
  if (!name) throw badRequest("Who is it? Name names!");
  await Customer.create({ name: name.trim() });
  const customers = await Customer.find({ active: true });
  customerAlphSort(customers);
  customerCache.set("activeCustomers", { customers });
  res.status(201).json(customers);
};

const toggleActive = async (req, res) => {
  const { name } = req.body;
  if (!name) throw badRequest("Need customer name");
  const customer = await Customer.findOne({ name });
  if (!customer) throw notFound("No customer with that name");
  customer.active = !customer.active;
  await customer.save();
  res.status(200).json(customer);
};

const getCustomerHistory = async (req, res) => {
  const { name } = req.params;
  if (!name) throw badRequest("Need customer name");
  const barrels = await Barrel.find({
    $or: [
      { history: { $elemMatch: { customer: name } } },
      { "open.customer": name },
    ],
  });
  const histories = [];
  barrels.forEach((brl) => {
    const brlObj = brl.toObject();
    if (brlObj.open && brlObj.open.customer === name) {
      histories.push({
        ...brlObj.open,
        createdAt: new Date(brlObj.open.createdAt),
        barrel: brlObj.number,
      });
    }
    brlObj.history.forEach((h) => {
      if (h.customer === name) {
        histories.push({
          ...h,
          createdAt: new Date(h.createdAt),
          barrel: brlObj.number,
        });
      }
    });
  });
  histories.sort((a, b) => b.createdAt - a.createdAt);
  res.status(200).send(histories);
};

export { getActiveCustomers, addCustomer, toggleActive, getCustomerHistory };
