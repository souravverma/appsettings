/**
 * Inteface for Branch3dEnvironmentRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IBranch3dEnvironmentRelationModel extends IBase {
  branch3dId?: number;
  environmentId?: number;
}
