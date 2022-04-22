/**
 * Inteface for RouteBranch3dRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IRouteBranch3dRelationModel extends IBase {
  branch3dId?: number;
  routeCategoryId?: number;
}
