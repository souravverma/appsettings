/**
 * Inteface for BranchManufExtremityModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dExtremitySolutionModel } from "./IBranch3dExtremitySolutionModel.interface";

export interface IBranchManufExtremityModel extends IBase {
  usableFor?: string;
  b3dExt?: IBranch3dExtremitySolutionModel;
}
