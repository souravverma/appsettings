/**
 * Inteface for Branch3dModel
 **/
import { IBranch3dExtremitySolutionModel } from "./IBranch3dExtremitySolutionModel.interface";
import { IBranch3dSegmentModel } from "./IBranch3dSegmentModel.interface";
import { IBranchPointDefinitionModel } from "./IBranchPointDefinitionModel.interface";
import { ICoveringElement3dModel } from "./ICoveringElement3dModel.interface";
import { IEnvironmentsTypeModel } from "./IEnvironmentsTypeModel.interface";
import { IPartZoneModel } from "./IPartZoneModel.interface";
import { IRouteCategoryModel } from "./IRouteCategoryModel.interface";

export interface IBranch3dModel {
  id?: number;
  name?: string;
  branchId?: string;
  diameter3dMm?: number;
  bendRadius?: number;
  lengthMm?: number;
  lengthForcedMm?: number;
  extraLengthMm?: number;
  notExtractible?: boolean;
  createdBy?: string;
  updatedBy?: string;
  partZone?: IPartZoneModel;
  environment?: IEnvironmentsTypeModel[];
  b3dExt?: IBranch3dExtremitySolutionModel[];
  cvrgElem?: ICoveringElement3dModel[];
  effectiveRoutes?: IRouteCategoryModel[];
  segments?: IBranch3dSegmentModel[];
  b3dpointDef?: IBranchPointDefinitionModel[];
}
