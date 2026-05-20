import express from 'express'
import { addCustomer, getActiveCustomers, getCustomerHistory, toggleActive } from '../controllers/customers.js';
import { asyncHandler } from '../errors/asyncHandler.js';

const router = express.Router();

router.get("/active", asyncHandler(getActiveCustomers));

router.post("/new", asyncHandler(addCustomer));
router.post("/toggle-active", asyncHandler(toggleActive));

router.get("/history/:name", asyncHandler(getCustomerHistory));

export default router
