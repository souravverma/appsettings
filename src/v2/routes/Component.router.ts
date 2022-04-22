import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import ComponentModel from "../models/Component.model";
import Backshell3dSolutionModel from "../models/Backshell3dSolution.model";
import MechanicalBackshellComponentModel from "../models/MechanicalBackshellComponent.model";
import MechanicalCoveringElementComponentModel from "../models/MechanicalCoveringElementComponent.model";
import CoveringElement3dModel from "../models/CoveringElement3d.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const componentRouter: Router = Router();
const controller = GenericModelController.getInstance();

componentRouter.get("/coveringElement", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      ComponentModel,
      CoveringElement3dModel,
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

componentRouter.get(
  "/mechanicalCoveringElementComponent",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        ComponentModel,
        MechanicalCoveringElementComponentModel,
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

componentRouter.get(
  "/mechanicalBackshellComponent",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        ComponentModel,
        MechanicalBackshellComponentModel,
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

componentRouter.get("/backshells", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      ComponentModel,
      Backshell3dSolutionModel,
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

componentRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(ComponentModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default componentRouter;
