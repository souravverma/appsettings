/**
 * Inteface for CoveringElementTypeModel
 **/
import { IBase } from "./IBase.interface";
import { ICoveringElement3dModel } from "./ICoveringElement3dModel.interface";

export interface ICoveringElementTypeModel extends IBase {
  cvrgElem?: ICoveringElement3dModel[];
}
