/**
 * Inteface for Branch3dExtremityTypeModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dExtremitySolutionModel } from "./IBranch3dExtremitySolutionModel.interface";

export interface IBranch3dExtremityTypeModel extends IBase {
  b3dExt: IBranch3dExtremitySolutionModel[];
}
