import { Router, Request, Response } from "express";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import { SpecificModelController } from "../modelsControllers/SpecificModel.controller";

const wireLengthRouter: Router = Router();

wireLengthRouter.get(
  "/:adapDesignSolutionNumber/:adapDesignSolutionVersionNumber/routingInfo",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    const query = req.params;
    if (query.adapDesignSolutionVersionNumber === "null") {
      delete query["adapDesignSolutionVersionNumber"];
    }
    specificModel
      .getHarnessRoutingServiceInfo(query)
      .then((result) => {
        if (result) apiResponseManager.successResponse(result);
        else
          apiResponseManager.errorResponse({
            name: "Error",
            message: "Harness not found",
            code: "Harness not found with the given adapDsNumber.",
            status: 404,
          });
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

export default wireLengthRouter;
