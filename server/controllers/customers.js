export function createCustomerControllers({ customerService }) {
  const getActiveCustomers = async (_, res) => {
    const customers = await customerService.getActiveCustomers();
    res.status(200).json(customers);
  };

  const addCustomer = async (req, res) => {
    const customers = await customerService.addCustomer(req.body.name);
    res.status(201).json(customers);
  };

  const toggleActive = async (req, res) => {
    const customer = await customerService.toggleActive(req.body.name);
    res.status(200).json(customer);
  };

  const getCustomerHistory = async (req, res) => {
    const histories = await customerService.getCustomerHistory(req.params.name);
    res.status(200).send(histories);
  };

  return { getActiveCustomers, addCustomer, toggleActive, getCustomerHistory };
}
