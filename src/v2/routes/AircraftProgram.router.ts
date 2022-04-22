import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import AircraftProgramModel from "../models/AircraftProgram.model";
import FunctionalItemModel from "../models/FunctionalItem.model";
import ValidityModel from "../models/Validity.model";
import RouteCategoryModel from "../models/RouteCategory.model";
import { IWhereClause } from "../interfaces/WhereClause.interface";

const aircraftProgramRouter: Router = Router();
const controller = GenericModelController.getInstance();

aircraftProgramRouter.get("/routeCategory", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      AircraftProgramModel,
      RouteCategoryModel,
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

aircraftProgramRouter.get("/validity", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(AircraftProgramModel, ValidityModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

aircraftProgramRouter.get("/functionalItem", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      AircraftProgramModel,
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

aircraftProgramRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(AircraftProgramModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

export default aircraftProgramRouter;
