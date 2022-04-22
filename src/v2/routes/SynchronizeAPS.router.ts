import { Response, Router, Request } from "express";
import SyncAdapCIPzController from "../modelsControllers/SynchronizeAPS/AdapCipzCi/SyncAdapCIPz.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import AdapDsSyncController from "../modelsControllers/SynchronizeAPS/AdapDsPzDs/AdapDsSync.controller";
import AdapCi from "../modelsControllers/SynchronizeAPS/AdapCipzCi/AdapCi";

const synchronizeAPSRouter: Router = Router();

synchronizeAPSRouter.post(
  "/synchronizeADAPCIandPZCI",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const syncAdapCIPzController = new SyncAdapCIPzController();
      const result = await syncAdapCIPzController.storeAdapCiPzCiData(req.body);
      if (result)
        apiResponseManager.successResponse({
          message: "synchronization success",
        });
      else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "synchronization error",
          code: "Unable to do synchronization",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse({
        name: "Error",
        message: error,
        code: "Unable to do synchronization",
        status: 404,
      });
    }
  }
);

synchronizeAPSRouter.patch(
  "/synchronizationAdap-Pz-DS-Ci-Lo",
  // TODO uncomment this code to enable authentication for this API
  // passport.authenticate("jwt", { session: false }),
  // new RoleGuard().requireAuth(["partzone_manager-ds-write"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const adapDsSyncController = new AdapDsSyncController();
      console.log("APS synchronization request received: ", req.body);
      const result = await adapDsSyncController.storeAdapData(req.body);
      console.log(
        "APS synchronization output: ",
        result?.message || "synchronization success"
      );
      if (result?.message)
        return apiResponseManager.successResponse({
          message: result.message,
        });
      else
        return apiResponseManager.errorResponse({
          name: "Error",
          message: "synchronization error",
          code: "Unable to do synchronization",
          status: 404,
        });
    } catch (error) {
      console.error("APS synchronization failed: ", error);
      return apiResponseManager.errorResponse({
        name: "Error",
        message: error,
        code: "Unable to do synchronization",
        status: 404,
      });
    }
  }
);

synchronizeAPSRouter.get(
  "/getAdapCiList",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const adapCi = new AdapCi();
      const result = await adapCi.getAdapCiList(req.query.id as string);
      if (result) apiResponseManager.successResponse(result);
      else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Adap ci not found",
          code: "Unable tofind adapCi",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse({
        name: "Error",
        message: error,
        code: "Unable to find adapCi",
        status: 404,
      });
    }
  }
);

export default synchronizeAPSRouter;
