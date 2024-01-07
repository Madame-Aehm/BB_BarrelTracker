import express from "express";
import cors from "cors";
import authRouter from "./routers/auth.js";
import 'dotenv/config'
import mongoose from "mongoose";
import barrelRouter from "./routers/barrels.js";
import authenticate from "./middleware/auth.js";

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

app.use('*', (req, res) => res.status(404).json({ error: "Endpoint not found." }));

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(port, () => {
    console.log("Connection to MongoDB established, and server is running on port " + port);
  });
})
.catch((err) => console.log(err));
