/**
 * Inteface for MechanicalCoveringElementComponentModel
 **/
import { IBase } from "./IBase.interface";
import { IComponentModel } from "./IComponentModel.interface";

export interface IMechanicalCoveringElementComponentModel extends IBase {
  bendRadiusMinD?: number;
  colour?: string;
  comment?: string;
  commentTresti?: string;
  diameterMaxMm?: number;
  diameterMaxMmTresti?: number;
  diameterMinMm?: number;
  diameterMinMmTresti?: number;
  environement?: string;
  lengthMm?: number;
  lengthMmTresti?: number;
  material?: string;
  order?: string;
  orderTresti?: string;
  sizeCode?: string;
  sizeCodeTresti?: string;
  sleeveFamily?: string;
  sleeveFamilyTresti?: string;
  temperatureMaxC?: number;
  temperatureMinC?: number;
  thicknessCoeffA?: string;
  thicknessCoeffATresti?: string;
  thicknessCoeffB?: string;
  thicknessCoeffBTresti?: string;
  weightG?: number;
  weightGMTresti?: number;
  component?: IComponentModel;
}
