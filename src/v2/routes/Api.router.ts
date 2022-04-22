import { Response, Router } from "express";

const apiRouter: Router = Router();

apiRouter.get("", (_, res: Response) => {
  res.json({
    message: "Welcome to the Harness API for Kbl import(version 1.0.0)",
    server: process.env.HOSTNAME,
  });
});

apiRouter.get("/status", (_, res: Response) => {
  res.send({ live: true, ready: true });
});

export default apiRouter;
