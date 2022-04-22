import { Response, Router } from "express";

const error404Router: Router = Router();

error404Router.get("", (_, res: Response) => {
  res.status(404).send("Error 404 : Page Not found");
});

export default error404Router;
