import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import Branch3dExtremitySolutionModel from "../models/Branch3dExtremitySolution.model";
import Branch3dModel from "../models/Branch3d.model";
import CoveringElementTypeModel from "../models/CoveringElementType.model";
import ComponentModel from "../models/Component.model";
import CoveringElement3dModel from "../models/CoveringElement3d.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const coveringElement3dRouter: Router = Router();
const controller = GenericModelController.getInstance();

coveringElement3dRouter.get(
  "/branch3dExtremitySolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        CoveringElement3dModel,
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

coveringElement3dRouter.get("/branch3d", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      CoveringElement3dModel,
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
});

coveringElement3dRouter.get(
  "/coveringElementType",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        CoveringElement3dModel,
        CoveringElementTypeModel,
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

coveringElement3dRouter.get("/component", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      CoveringElement3dModel,
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

coveringElement3dRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(CoveringElement3dModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default coveringElement3dRouter;
