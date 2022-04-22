import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import FunctionalItemModel from "../models/FunctionalItem.model";
import PartZoneModel from "../models/Partzone.model";
import Branch3dExtremitySolutionModel from "../models/Branch3dExtremitySolution.model";
import Backshell3dSolutionModel from "../models/Backshell3dSolution.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const functionalItem3dRouter: Router = Router();
const controller = GenericModelController.getInstance();

functionalItem3dRouter.get("/functionalItem", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      FunctionalItem3dSolutionModel,
      FunctionalItemModel,
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

functionalItem3dRouter.get(
  "/functionalItem3dSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        FunctionalItem3dSolutionModel,
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

functionalItem3dRouter.get("/partZone", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      FunctionalItem3dSolutionModel,
      PartZoneModel,
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

functionalItem3dRouter.get(
  "/branch3dExtremitySolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        FunctionalItem3dSolutionModel,
        Branch3dExtremitySolutionModel,
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

functionalItem3dRouter.get(
  "/backshell3dSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        FunctionalItem3dSolutionModel,
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
  }
);

functionalItem3dRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(FunctionalItem3dSolutionModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default functionalItem3dRouter;
