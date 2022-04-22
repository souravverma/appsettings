/**
 * Inteface for Branch3dExtremityCoveringElementRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IBranch3dExtremityCoveringElementRelationModel extends IBase {
  lengthMm?: number;
  branch3dExtremityId?: number;
  coveringElement3dId?: number;
}
