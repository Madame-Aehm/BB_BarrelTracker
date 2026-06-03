import customerCache from "../config/cache.js";

const ACTIVE_CUSTOMERS_KEY = "activeCustomers";

export default class CacheService {
  getActiveCustomers() {
    const cached = customerCache.get(ACTIVE_CUSTOMERS_KEY);
    if (cached === undefined) return undefined;
    return cached.customers;
  }

  setActiveCustomers(customers) {
    customerCache.set(ACTIVE_CUSTOMERS_KEY, { customers });
  }

  invalidateActiveCustomers() {
    customerCache.del(ACTIVE_CUSTOMERS_KEY);
  }
}
