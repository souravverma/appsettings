/**
 * Inteface for Branch3dCoveringElementSolutionRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IBranch3dCoveringElementSolutionRelationModel extends IBase {
  branch3dId?: number;
  coveringElement3dId?: number;
}
