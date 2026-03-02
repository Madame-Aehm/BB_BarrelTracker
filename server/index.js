import express from "express";
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import helmetConfig from "./config/helmet.js";
import authenticate from "./middleware/auth.js";
import authRouter from "./routers/auth.js";
import barrelRouter from "./routers/barrels.js";
import customerRouter from "./routers/customers.js";
import cloudinaryConfig from "./config/cloudinary.js";

(function () {
  const app = express();
  const port = process.env.PORT || 5000;

  const middlewares = () => {
    app.use(helmetConfig());
    app.use(express.json({ limit: '10mb' }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: '10mb'
      })
    );
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.warn(`CORS blocked request from origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400
    }));
    
    app.use(mongoSanitize());
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
