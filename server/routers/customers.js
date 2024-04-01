import express from 'express'
import { addCustomer, getActiveCustomers, getCustomerHistory, toggleActive } from '../controllers/customers.js';

const router = express.Router();

// router.get("/all", getAllCustomers);
router.get("/active", getActiveCustomers);

router.post("/new", addCustomer);
router.post("/toggle-active", toggleActive);

router.get("/history/:name", getCustomerHistory);

export default router