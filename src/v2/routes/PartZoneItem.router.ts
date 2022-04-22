import { Response, Router, Request } from "express";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import SwaggerController from "../modelsControllers/Swagger.controller";

const partZoneItemRouter: Router = Router();

partZoneItemRouter.get(
  "/:id/getPzDsAdapCiLinkByPzCiId",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const swaggerController = new SwaggerController();
      const result = await swaggerController.getPzDsAdapCiLinkByPzCiId(
        req.params.id as string
      );
      if (result) apiResponseManager.successResponse(result);
      else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Adap Ds not found",
          code: "Unable to find Adap Ds",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse({
        name: "Error",
        message: error,
        code: "Unable to find Adap Ds",
        status: 404,
      });
    }
  }
);

partZoneItemRouter.get(
  "/:id/getPzCiLinkByPzDsId",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const swaggerController = new SwaggerController();
      const result = await swaggerController.getPzCiLinkByPzDsId(
        req.params.id as string
      );
      if (result) apiResponseManager.successResponse(result);
      else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Partzone ci not found",
          code: "Unable to find Partzone Ci",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse({
        name: "Error",
        message: error,
        code: "Unable to find Partzone Ci",
        status: 404,
      });
    }
  }
);

export default partZoneItemRouter;
