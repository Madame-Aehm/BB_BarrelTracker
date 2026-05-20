import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import helmetConfig from "./config/helmet.js";
import authenticate from "./middleware/auth.js";
import authRouter from "./routers/auth.js";
import barrelRouter from "./routers/barrels.js";
import customerRouter from "./routers/customers.js";
import cloudinaryConfig from "./config/cloudinary.js";
import env from "./config/env.js";
import { errorHandler } from "./errors/errorHandler.js";

(function () {
  const app = express();
  const port = env.port;

  const middlewares = () => {
    app.use(helmetConfig());
    app.use(express.json({ limit: '10mb' }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: '10mb'
      })
    );
    
    const allowedOrigins = env.allowedOrigins;
    
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
    app.get("/api/version", (_, res) => res.send({ version: "1.3" })); // change this on on redeploy to trigger hard refresh and clear browser cache
    app.use(errorHandler);
  }

  const connectMongoose = () => {
    mongoose
    .connect(env.mongoUri)
    .then(() => {
      app.listen(port, () => {
        console.log("Connection to MongoDB established, and server is running on port " + port);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err);
      process.exit(1);
    });
  }

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    if (env.nodeEnv === "production") process.exit(1);
  });

  middlewares();
  routes();
  connectMongoose();
})();
