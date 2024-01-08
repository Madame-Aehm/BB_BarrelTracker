import express from "express";
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
import authenticate from "./middleware/auth.js";
import authRouter from "./routers/auth.js";
import barrelRouter from "./routers/barrels.js";
import customerRouter from "./routers/customers.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/barrel", authenticate, barrelRouter);
app.use("/api/customer", authenticate, customerRouter);

app.use('*', (req, res) => res.status(404).json({ error: "Endpoint not found." }));

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(port, () => {
    console.log("Connection to MongoDB established, and server is running on port " + port);
  });
})
.catch((err) => console.log(err));
