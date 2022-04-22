import { Response, Router, Request } from "express";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import SwaggerController from "../modelsControllers/Swagger.controller";

const adapItemRouter: Router = Router();

adapItemRouter.get(
  "/:id/getAdapDsLoLinkByAdapCiId",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const swaggerController = new SwaggerController();
      const result = await swaggerController.getAdapDsLoLinkByAdapCiId(
        req.params.id as string
      );
      if (result) apiResponseManager.successResponse(result);
      else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Adap Ds not found",
          code: "Unable tofind Adap Ds",
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

adapItemRouter.get(
  "/:id/getAdapCiLOLinkByAdapDsId",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const swaggerController = new SwaggerController();
      const result = await swaggerController.getAdapCiLOLinkByAdapDsId(
        req.params.id as string
      );
      if (result) apiResponseManager.successResponse(result);
      else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Adap ci not found",
          code: "Unable to find adapCi",
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

export default adapItemRouter;
