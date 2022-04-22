import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import helmet from 'helmet';
import passport from "passport";
import dotenv from "dotenv";
import { JWTStrategy } from "@airbus/lib-auth-express";

dotenv.config();

// Routers
import mainRouter from "./routes/Main.Router";
import error404Router from "./routes/error404.router";
// Routers relative to the V1
// import ApiRouterV1 from './v1/routes';

// Routers relative to the v2
import ApiRouterV2 from "./v2/routes";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
passport.use(JWTStrategy(process.env.JWT_PUBLIC_KEY));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// CORS middleware to prepend preflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // intercept OPTIONS method
  if (req.method == "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

// Router assignments
if (process.env.EKS === "true") {
  app.use("/harness", mainRouter);
  // Routes assignments relative to the KBL v1
  // app.use('/harness/api/v1', ApiRouterV1);
  // Routes assignments relative to the KBL v2
  app.use("/harness/api/v2", ApiRouterV2);
  // Routes assignments to manage error 404
  app.use("/harness/*", error404Router);
} else {
  app.use("", mainRouter);
  // Routes assignments relative to the KBL v1
  // app.use('/api/v1', ApiRouterV1);
  // Routes assignments relative to the KBL v2
  app.use("/api/v2", ApiRouterV2);
  // Routes assignments to manage error 404
  app.use("*", error404Router);
}

export default app;
