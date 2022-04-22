import { Response, Router } from "express";
import { config } from "../v2/ConfigurationFiles/config";

const mainRouter: Router = Router();

/**
 * GET /
 * Home page.
 */
mainRouter.get("", (_, res: Response) => {
  res.json({ message: "Hello from Core Elec API Harness" });
});

/**
 * GET /api/v2/partzoneApiVersion
 * get partzone api version.
 */
mainRouter.get("/partzoneApiVersion", (_, res: Response) => {
  res.send({ version: config.partzoneApiVersion });
});

/**
 * GET /api/v1/status
 * Mandatory reponse to verify if service is OK
 */

mainRouter.get("api/v1/status", (_, res: Response) => {
  res.send({ live: true, ready: true });
});

/**
 * GET /api/v2/status
 * Mandatory reponse to verify if service is OK
 */

mainRouter.get("api/v2/status", (_, res: Response) => {
  res.send({ live: true, ready: true });
});

export default mainRouter;
