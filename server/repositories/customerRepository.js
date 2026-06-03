import Customer from "../models/customers.js";
import Barrel from "../models/barrels.js";

export const customerRepository = {
  async findActive() {
    return Customer.find({ active: true });
  },

  async create(name) {
    return Customer.create({ name });
  },

  async findByName(name) {
    return Customer.findOne({ name });
  },

  async save(customer) {
    return customer.save();
  },

  async findBarrelsForCustomer(name) {
    return Barrel.find({
      $or: [
        { history: { $elemMatch: { customer: name } } },
        { "open.customer": name },
      ],
    });
  },
};
