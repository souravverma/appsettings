/**
 * Inteface for Branch3dExtremitySolutionModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dExtremityCoveringElementRelationModel } from "./IBranch3dExtremityCoveringElementRelation.interface";
import { IBranch3dExtremityTypeModel } from "./IBranch3dExtremityTypeModel.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";
import { IBranchManufExtremityModel } from "./IBranchManufExtremityModel.interface";
import { IFunctionalItem3dSolutionModel } from "./IFunctionalItem3dSolutionModel.interface";

export interface IBranch3dExtremitySolutionModel extends IBase {
  electricalCoordinateX?: number;
  electricalCoordinateY?: number;
  electricalCoordinateZ?: number;
  bManuf?: IBranchManufExtremityModel;
  type?: IBranch3dExtremityTypeModel;
  cvrgElem?: IBranch3dExtremityCoveringElementRelationModel[];
  finDs?: IFunctionalItem3dSolutionModel[];
  b3d?: IBranch3dModel[];
}
