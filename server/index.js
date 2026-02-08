import express from "express";
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import authenticate from "./middleware/auth.js";
import authRouter from "./routers/auth.js";
import barrelRouter from "./routers/barrels.js";
import customerRouter from "./routers/customers.js";
import cloudinaryConfig from "./config/cloudinary.js";

(function () {
  const app = express();
  const port = process.env.PORT || 5000;

  const middlewares = () => {
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );
    app.use(cors());
    app.use(mongoSanitize()); // Prevent NoSQL injection attacks
    cloudinaryConfig();
  }

  const routes = () => {
    app.use((req, _, next) => {
      console.log(req.path, req.method);
      next();
    })
    app.use("/api/auth", authRouter);
    app.use("/api/barrel", authenticate, barrelRouter);
    app.use("/api/customer", authenticate, customerRouter);
    app.get("/api/version", (_, res) => res.send({ version: "1.1" })); // change this on on redeploy to trigger hard refresh and clear browser cache (hopefully)
    app.use('*', (_, res) => res.status(404).json({ error: "Endpoint not found." }));
  }

  const connectMongoose = () => {
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(port, () => {
        console.log("Connection to MongoDB established, and server is running on port " + port);
      });
    })
    .catch((err) => console.log(err));
  }

  middlewares();
  routes();
  connectMongoose();
})();
