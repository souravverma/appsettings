/**
 * Inteface for CoveringElement3dModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dExtremityCoveringElementRelationModel } from "./IBranch3dExtremityCoveringElementRelation.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";
import { IComponentModel } from "./IComponentModel.interface";
import { ICoveringElementTypeModel } from "./ICoveringElementTypeModel.interface";

export interface ICoveringElement3dModel extends IBase {
  lengthMm?: number;
  diameterMm?: number;
  printedLabel1?: string;
  printedLabel2?: string;
  printedLabel3?: string;
  branch?: IBranch3dModel[];
  cvrgElemType?: ICoveringElementTypeModel;
  component?: IComponentModel;
  b3dExt?: IBranch3dExtremityCoveringElementRelationModel[];
}
