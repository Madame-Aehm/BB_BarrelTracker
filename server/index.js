import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import helmetConfig from "./config/helmet.js";
import cloudinaryConfig from "./config/cloudinary.js";
import env from "./config/env.js";
import { errorHandler } from "./errors/errorHandler.js";
import { createContainer } from "./container.js";
import { createAuthenticate } from "./middleware/auth.js";
import { createAuthControllers } from "./controllers/auth.js";
import { createBarrelControllers } from "./controllers/barrels.js";
import { createCustomerControllers } from "./controllers/customers.js";
import { createAuthRouter } from "./routers/auth.js";
import { createBarrelRouter } from "./routers/barrels.js";
import { createCustomerRouter } from "./routers/customers.js";

(function () {
  const app = express();
  const port = env.port;

  app.set('trust proxy', 1);

  cloudinaryConfig();

  const container = createContainer();
  const authenticate = createAuthenticate(container);
  const authControllers = createAuthControllers(container);
  const barrelControllers = createBarrelControllers(container);
  const customerControllers = createCustomerControllers(container);

  const middlewares = () => {
    app.use(helmetConfig());
    app.use(express.json({ limit: "10mb" }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: "10mb",
      })
    );

    const allowedOrigins = env.allowedOrigins;

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);

          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400,
      })
    );

    app.use(mongoSanitize());
  };

  const routes = () => {
    app.use((req, _, next) => {
      console.log(req.path, req.method);
      next();
    });
    app.use("/api/auth", createAuthRouter(authControllers, authenticate));
    app.use("/api/barrel", authenticate, createBarrelRouter(barrelControllers));
    app.use("/api/customer", authenticate, createCustomerRouter(customerControllers));
    app.get("/api/version", (_, res) => res.send({ version: "1.3" }));
    app.use(errorHandler);
  };

  const connectMongoose = () => {
    mongoose
      .connect(env.mongoUri)
      .then(() => {
        app.listen(port, () => {
          console.log(
            "Connection to MongoDB established, and server is running on port " + port
          );
        });
      })
      .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
      });
  };

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    if (env.nodeEnv === "production") process.exit(1);
  });

  middlewares();
  routes();
  connectMongoose();
})();
