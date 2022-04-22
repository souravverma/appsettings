/**
 * Inteface for ComponentModel
 **/
import { IBackshell3dSolutionModel } from "./IBackshell3dSolutionModel.interface";
import { IBase } from "./IBase.interface";
import { ICoveringElement3dModel } from "./ICoveringElement3dModel.interface";
import { IMarkerComponentModel } from "./IMarkerComponentModel.interface";
import { IMechanicalBackshellComponentModel } from "./IMechanicalBackshellComponentModel.interface";
import { IMechanicalCoveringElementComponentModel } from "./IMechanicalCoveringElementComponentModel.interface";

export interface IComponentModel extends IBase {
  partNumber?: string;
  norm?: string;
  backshells?: IBackshell3dSolutionModel[];
  mechaBackshellCpnts?: IMechanicalBackshellComponentModel[];
  mechaCvrgElemCpnts?: IMechanicalCoveringElementComponentModel[];
  cvrgElem?: ICoveringElement3dModel[];
  markerComponents?: IMarkerComponentModel[];
}
