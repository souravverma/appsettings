import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import Backshell3dSolutionModel from "../models/Backshell3dSolution.model";
import ComponentModel from "../models/Component.model";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const backshell3dSolutionRouter: Router = Router();
const controller = GenericModelController.getInstance();

backshell3dSolutionRouter.get("/component", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      Backshell3dSolutionModel,
      ComponentModel,
      req.query as IWhereClause
    )
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

backshell3dSolutionRouter.get(
  "/functionalItem3dSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Backshell3dSolutionModel,
        FunctionalItem3dSolutionModel,
        req.query as IWhereClause
      )
      .then((result) => {
        // API Success Response
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        // API Error Response
        apiResponseManager.errorResponse(err);
      });
  }
);

backshell3dSolutionRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(Backshell3dSolutionModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default backshell3dSolutionRouter;
