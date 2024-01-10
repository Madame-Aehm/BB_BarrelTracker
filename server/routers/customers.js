import express from 'express'
import { addCustomer, getCustomerHistory, getCustomers } from '../controllers/customers.js';

const router = express.Router();

router.get("/all", getCustomers);

router.post("/new", addCustomer);

router.get("/history/:name", getCustomerHistory);

export default router