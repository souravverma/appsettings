import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import Branch3dModel from "../models/Branch3d.model";
import PartZoneModel from "../models/Partzone.model";
import EnvironmentsTypeModel from "../models/EnvironmentType.model";
import Branch3dExtremitySolutionModel from "../models/Branch3dExtremitySolution.model";
import CoveringElement3dModel from "../models/CoveringElement3d.model";
import RouteCategoryModel from "../models/RouteCategory.model";
import Branch3dSegmentModel from "../models/Branch3dSegment.model";
import BranchPointDefinitionModel from "../models/BranchPointDefinition.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const branch3dRouter: Router = Router();
const controller = GenericModelController.getInstance();

branch3dRouter.get("/branchPointDefinition", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      Branch3dModel,
      BranchPointDefinitionModel,
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

branch3dRouter.get("/branch3dSegment", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(Branch3dModel, Branch3dSegmentModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

branch3dRouter.get("/routeCategory", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(Branch3dModel, RouteCategoryModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

branch3dRouter.get("/coveringElement3d", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      Branch3dModel,
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

branch3dRouter.get(
  "/branch3dExtremitySolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Branch3dModel,
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

branch3dRouter.get("/environmentsType", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(Branch3dModel, EnvironmentsTypeModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

branch3dRouter.get("/partZone", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(Branch3dModel, PartZoneModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

branch3dRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(Branch3dModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default branch3dRouter;
