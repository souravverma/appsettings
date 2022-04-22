import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import CircuitModel from "../models/Circuit.model";
import FunctionalItemModel from "../models/FunctionalItem.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const circuitRouter: Router = Router();
const controller = GenericModelController.getInstance();

circuitRouter.get("/functionalItem", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  req.query.letters = ["VU", "VB"];
  controller
    .getAllWith(CircuitModel, FunctionalItemModel, req.query as IWhereClause)
    .then((result) => {
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      apiResponseManager.errorResponse(err);
    });
});

circuitRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(CircuitModel, req.query as IWhereClause)
    .then((result) => {
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      apiResponseManager.errorResponse(err);
    });
});

export default circuitRouter;
