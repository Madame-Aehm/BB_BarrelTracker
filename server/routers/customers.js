import express from "express";
import { asyncHandler } from "../errors/asyncHandler.js";

export function createCustomerRouter(controllers) {
  const router = express.Router();

  router.get("/active", asyncHandler(controllers.getActiveCustomers));
  router.post("/new", asyncHandler(controllers.addCustomer));
  router.post("/toggle-active", asyncHandler(controllers.toggleActive));
  router.get("/history/:name", asyncHandler(controllers.getCustomerHistory));

  return router;
}
