import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import Branch3dExtremitySolutionModel from "../models/Branch3dExtremitySolution.model";
import BranchManufExtremityModel from "../models/BranchManufExtremity.model";
import Branch3dExtremityTypeModel from "../models/Branch3dExtremityType.model";
import CoveringElement3dModel from "../models/CoveringElement3d.model";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import Branch3dModel from "../models/Branch3d.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const branch3dExtremitySolutionRouter: Router = Router();
const controller = GenericModelController.getInstance();

branch3dExtremitySolutionRouter.get(
  "/branch3d",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Branch3dExtremitySolutionModel,
        Branch3dModel,
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

branch3dExtremitySolutionRouter.get(
  "/functionalItem3dSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Branch3dExtremitySolutionModel,
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

branch3dExtremitySolutionRouter.get(
  "/coveringElement3d",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Branch3dExtremitySolutionModel,
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
  }
);

branch3dExtremitySolutionRouter.get(
  "/branch3dExtremityType",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Branch3dExtremitySolutionModel,
        Branch3dExtremityTypeModel,
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

branch3dExtremitySolutionRouter.get(
  "/branchManufExtremity",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Branch3dExtremitySolutionModel,
        BranchManufExtremityModel,
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

branch3dExtremitySolutionRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(Branch3dExtremitySolutionModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default branch3dExtremitySolutionRouter;
