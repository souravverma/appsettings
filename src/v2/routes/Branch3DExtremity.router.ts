// import { Request, Response, Router } from 'express';
// import Branch3DExtremityController from '../modelsControllers/Branch3DExtremity.controller';
// import FinDsModel from '../models/functionalItem.model';
// import { ApiResponseManager } from '../services/ApiResponseManager.service';

// const branch3DExtremityRouter: Router = Router();

// branch3DExtremityRouter.get('', (req: Request, res: Response) => {
//   const branch3DExtremityController: Branch3DExtremityController = new Branch3DExtremityController();

//   const apiResponseManager = new ApiResponseManager(res);
//   branch3DExtremityController.getAll(req.query)
//     .then((result) => {
//       // API Success Response
//       apiResponseManager.successResponse(result);
//     })
//     .catch((err: Error) => {
//       // API Error Response
//       apiResponseManager.errorResponse(err);
//     });
// });

// branch3DExtremityRouter.get('/finDsComponent', (req: Request, res: Response) => {
//   const branch3DExtremityController: Branch3DExtremityController = new Branch3DExtremityController();

//   const apiResponseManager = new ApiResponseManager(res);
//   branch3DExtremityController.getAllWith(req.query, FinDsModel)
//     .then((result) => {
//       // API Success Response
//       apiResponseManager.successResponse(result);
//     })
//     .catch((err: Error) => {
//       // API Error Response
//       apiResponseManager.errorResponse(err);
//     });
// });
// export default branch3DExtremityRouter;
