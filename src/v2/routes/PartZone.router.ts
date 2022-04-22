import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import PartZoneModel from "../models/Partzone.model";
import Branch3dModel from "../models/Branch3d.model";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import UserAreaModel from "../models/UserAreaPartZone.model";
import PartZoneController from "../modelsControllers/Partzone/PartZone.controller";
import PartzoneswithFunctionalItem from "../modelsControllers/Functionalitem/PartzoneswithFunctionalItem.Controller";
import passport from "passport";
import { RoleGuard } from "@airbus/lib-auth-express";
import { IWhereClause } from "../interfaces/WhereClause.interface";
import DeletePartZone from "../modelsControllers/Partzone/DeletePartzone.controller";
import HarnessConsistencyController from "../modelsControllers/Harness/HarnessConsistency.controller";

const partZoneRouter: Router = Router();
const controller = GenericModelController.getInstance();

partZoneRouter.get(
  "/functionalItem3dSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        PartZoneModel,
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

partZoneRouter.get(
  "/harness3dDesignSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        PartZoneModel,
        Harness3dDesignSolutionModel,
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

partZoneRouter.get("/userArea", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(PartZoneModel, UserAreaModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

partZoneRouter.get("/branch3d", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(PartZoneModel, Branch3dModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

/**
 * To fetch all partzones under VUVB
 */
partZoneRouter.post(
  "/comparative/functionalItem3dSolution",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-write"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      if (!req.body)
        return apiResponseManager.errorResponse(
          Object.assign(new Error("Post request body is missing"), {
            status: 400,
          })
        );
      else if (!Array.isArray(req.body))
        return apiResponseManager.errorResponse(
          Object.assign(
            new Error("Functional Item list is missing in the body request"),
            { status: 400 }
          )
        );

      if (Object.keys(req.query).length && !req.query.VB)
        return apiResponseManager.errorResponse(
          Object.assign(new Error("Filter can be done only on VB field"), {
            status: 400,
          })
        );

      const partZoneswithFincontroller = new PartzoneswithFunctionalItem();
      const result =
        await partZoneswithFincontroller.getPartZoneWithIncludedFin();
      const finResponse = partZoneswithFincontroller.getFinResponse(
        result,
        req.body
      );
      apiResponseManager.successResponse(finResponse);
    } catch (error) {
      apiResponseManager.errorResponse(error);
    }
  }
);

/**
 * To check whether a partzone exists with the provided name
 */
partZoneRouter.head("", async (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  try {
    if (!req.query.name)
      return apiResponseManager.errorResponse(
        Object.assign(new Error("Partzone name attribute is needed"), {
          status: 400,
        })
      );

    const result = await controller.getAll(
      PartZoneModel,
      req.query as IWhereClause
    );
    if (result.length) res.sendStatus(200);
    else res.sendStatus(404);
  } catch (err) {
    apiResponseManager.errorResponse(err);
  }
});

partZoneRouter.get("", async (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  try {
    const result: PartZoneModel[] = await controller.getAll(
      PartZoneModel,
      req.query as IWhereClause
    );

    // API Success Response
    apiResponseManager.successResponse(result);
  } catch (err) {
    // API Error Response
    apiResponseManager.errorResponse(err);
  }
});

partZoneRouter.delete("/all", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  const partZoneController = new DeletePartZone();
  partZoneController
    .destroyAllPartzones()
    .then((result: any) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

partZoneRouter.post("/deletePartZone", async (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  try {
    if (req.body) {
      const partZoneController = new DeletePartZone();
      const { adapDsNumber, adapDsIssue, adapDsVersion } = req.body;
      const harnessConsistencyController: HarnessConsistencyController =
        new HarnessConsistencyController();
      await partZoneController.deletePartzoneList(req.body, true);

      await harnessConsistencyController.harnessConsistencyCheck({
        adapDesignSolutionNumber: adapDsNumber,
        adapDesignSolutionIssueNumber: adapDsIssue,
        adapDesignSolutionVersionNumber: adapDsVersion,
        ChangePsSynchroStatus: "KO",
      });
      return apiResponseManager.successResponse({
        message: "Delete Partzone success",
      });
    }
  } catch (error) {
    apiResponseManager.errorResponse(error);
  }
});
partZoneRouter.post(
  "/deletePartZone",
  async (req: Request, res: Response) => {}
);

export default partZoneRouter;
