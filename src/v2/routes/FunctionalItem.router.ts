import { Router, Request, Response } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import FunctionalItemModel from "../models/FunctionalItem.model";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import CircuitModel from "../models/Circuit.model";
import AircraftProgramModel from "../models/AircraftProgram.model";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import PartZoneModel from "../models/Partzone.model";
import passport from "passport";
import { RoleGuard } from "@airbus/lib-auth-express";
import { IWhereClause } from "../interfaces/WhereClause.interface";
import FunctionalItemController from "../modelsControllers/FunctionalItem/FunctionalItem.controller";
import FinHelper from "../modelsControllers/FunctionalItem/FinHelper.controller";
import AdapLoModel from "../models/AdapLo.model";
import AdapItemModel from "../models/AdapItem.model";

const functionalItemRouter: Router = Router();
const controller = GenericModelController.getInstance();

functionalItemRouter.get("/aircraftProgram", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(
      FunctionalItemModel,
      AircraftProgramModel,
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

functionalItemRouter.get("/circuit", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAllWith(FunctionalItemModel, CircuitModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

functionalItemRouter.get(
  "/functionalItem3dSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        FunctionalItemModel,
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

functionalItemRouter.get(
  "/harness3dDesignSolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        FunctionalItemModel,
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

functionalItemRouter.get(
  "/:id/harness3dDesignSolutions/mp",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    if (!req.params.id)
      return apiResponseManager.errorResponse({
        ...new Error("id attribute is needed"),
        status: 422,
      });

    controller
      .getAllWith(
        FunctionalItemModel,
        [Harness3dDesignSolutionModel, AdapLoModel, AdapItemModel],
        req.params
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

functionalItemRouter.get(
  "/harness3dDesignSolutions/mp",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const circuitId = await CircuitModel.findOne({
      where: { letters: ["VB", "VU"] },
    });
    controller
      .getAllWith(
        FunctionalItemModel,
        [Harness3dDesignSolutionModel, PartZoneModel],
        { fk_circuit_id: circuitId.id }
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

functionalItemRouter.get("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(FunctionalItemModel, req.query as IWhereClause)
    .then((result) => {
      // API Success Response
      apiResponseManager.successResponse(result);
    })
    .catch((err: Error) => {
      // API Error Response
      apiResponseManager.errorResponse(err);
    });
});

functionalItemRouter.post(
  "/updateVBCode",
  async (req: Request, res: Response) => {
    const fin = new FinHelper();
    await fin.updateVBCode(req.body);
  }
);

export default functionalItemRouter;
