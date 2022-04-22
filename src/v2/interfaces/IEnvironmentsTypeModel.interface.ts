/**
 * Inteface for EnvironmentsTypeModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";

export interface IEnvironmentsTypeModel extends IBase {
  branches?: IBranch3dModel[];
}
