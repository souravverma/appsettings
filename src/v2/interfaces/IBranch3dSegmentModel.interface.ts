/**
 * Inteface for Branch3dSegmentModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";

export interface IBranch3dSegmentModel extends IBase {
  b3d?: IBranch3dModel;
}
