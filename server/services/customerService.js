import customerAlphSort from "../utils/sortCustomers.js";
import { badRequest, notFound } from "../errors/AppError.js";

export default class CustomerService {
  constructor({ customerRepository, cacheService }) {
    this.customerRepository = customerRepository;
    this.cacheService = cacheService;
  }

  async getActiveCustomers() {
    const cached = this.cacheService.getActiveCustomers();
    if (cached !== undefined) return cached;

    const customers = await this.customerRepository.findActive();
    customerAlphSort(customers);
    this.cacheService.setActiveCustomers(customers);
    return customers;
  }

  async addCustomer(name) {
    if (!name) throw badRequest("Who is it? Name names!");
    await this.customerRepository.create(name.trim());
    const customers = await this.customerRepository.findActive();
    customerAlphSort(customers);
    this.cacheService.setActiveCustomers(customers);
    return customers;
  }

  async toggleActive(name) {
    if (!name) throw badRequest("Need customer name");
    const customer = await this.customerRepository.findByName(name);
    if (!customer) throw notFound("No customer with that name");
    customer.active = !customer.active;
    await this.customerRepository.save(customer);
    this.cacheService.invalidateActiveCustomers();
    return customer;
  }

  async getCustomerHistory(name) {
    if (!name) throw badRequest("Need customer name");
    const barrels = await this.customerRepository.findBarrelsForCustomer(name);
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
    return histories;
  }
}
