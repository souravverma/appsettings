/**
 * Inteface for MechanicalBackshellComponentModel
 **/
import ComponentModel from "../models/Component.model";
import { IBase } from "./IBase.interface";

export interface IMechanicalBackshellComponentModel extends IBase {
  material?: string;
  emi?: boolean;
  backshellType?: string;
  component?: ComponentModel;
}
