/**
 * Inteface for BranchPointDefinitionModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";

export interface IBranchPointDefinitionModel extends IBase {
  coordinateX?: number;
  coordinateY?: number;
  coordinateZ?: number;
  vectorX?: number;
  vectorY?: number;
  vectorZ?: number;
  middle?: boolean;
  pbranch3d?: number;
  b3d?: IBranch3dModel;
}
