import { Request, Response, Router } from "express";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import Harness3dDesignSolutionController from "../modelsControllers/Harness/Harness3dDesignSolution.controller";
import passport from "passport";
import { RoleGuard } from "@airbus/lib-auth-express";
import SwaggerController from "../modelsControllers/Swagger.controller";
import UpdateHarnessForDesignSolution from "../modelsControllers/Harness/UpdateHarnessForDS.controller";
import DeletePartZone from "../modelsControllers/Partzone/DeletePartzone.controller";

const AdminRouter: Router = Router();
AdminRouter.post(
  "/delete/PartZoneContent",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-pz_content-delete"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const deletePartZone = new DeletePartZone();
    if (
      req.body.partzones.length > 0 &&
      req.query.password &&
      req.query.password === "Armaguedon"
    ) {
      const swaggerController = new SwaggerController();
      swaggerController
        .deletePartzoneContentFromSwagger(req.body.partzones, true)
        .then((result: any) => {
          apiResponseManager.successResponse(result);
        })
        .catch((err: Error) => {
          // API Error Response
          apiResponseManager.errorResponse(err);
        });
    } else {
      apiResponseManager.forbiddenResponse();
    }
  }
);

AdminRouter.post(
  "/delete/harnesses",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-delete"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    if (
      req.query.adapDesignSolutionNumber &&
      req.query.password &&
      req.query.password === "Armaguedon"
    ) {
      const swaggerController = new SwaggerController();
      swaggerController
        .deleteHarnessFromSwagger(
          req.query.adapDesignSolutionNumber as string,
          req.query.adapDesignSolutionVersionNumber as string,
          true
        )
        .then((result: any) => {
          // API Success Response
          apiResponseManager.successResponse(result);
        })
        .catch((err: Error) => {
          // API Error Response
          apiResponseManager.errorResponse(err);
        });
    } else {
      apiResponseManager.forbiddenResponse();
    }
  }
);

AdminRouter.post(
  "/PartzoneUpdateFor3Dand2DData",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-delete"]),
  async (req: Request, res: Response) => {
    if (req.query.password && req.query.password === "ARMAGUEDON") {
      const apiResponseManager = new ApiResponseManager(res);
      const swaggerController = new SwaggerController();
      await swaggerController
        .update2Dand3DDataForPartZones()
        .then((result: any) => {
          apiResponseManager.successResponse(result);
        })
        .catch((err: Error) => {
          apiResponseManager.errorResponse(err);
        });
    }
  }
);

AdminRouter.post(
  "/DSUpdateFor3Dand2DData",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-delete"]),
  async (req: Request, res: Response) => {
    if (req.query.password && req.query.password === "ARMAGUEDON") {
      const apiResponseManager = new ApiResponseManager(res);
      const swaggerController = new SwaggerController();
      await swaggerController
        .updateDS2Dand3DData()
        .then((result: any) => {
          apiResponseManager.successResponse(result);
        })
        .catch((err: Error) => {
          apiResponseManager.errorResponse(err);
        });
    }
  }
);

AdminRouter.post(
  "/unfreezeDS",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds_unfreeze-write"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    if (req.body.password === "Armaguedon") {
      const updateHarnessForDesignSolution =
        new UpdateHarnessForDesignSolution();
      updateHarnessForDesignSolution
        .unfreezeDesignSolution(req.body.adapDesignSolutionNumber)
        .then((result) => {
          apiResponseManager.successResponse(result);
        })
        .catch((err: Error) => {
          apiResponseManager.errorResponse(err);
        });
    } else {
      apiResponseManager.forbiddenResponse();
    }
  }
);

AdminRouter.delete(
  "/partZone",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-pz_content-delete"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      if (req.query?.name) {
        const partZoneController = new DeletePartZone();
        const result = await partZoneController.deletePartzoneByName(
          req.query.name as string,
          req.query.version as string
        );
        apiResponseManager.successResponse(result);
      }
    } catch (error) {
      apiResponseManager.errorResponse(error);
    }
  }
);

export default AdminRouter;
