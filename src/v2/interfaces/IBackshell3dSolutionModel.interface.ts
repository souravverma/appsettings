/**
 * Inteface for Backshell3dSolutionModel
 **/
import { IBase } from "./IBase.interface";
import { IComponentModel } from "./IComponentModel.interface";
import { IFunctionalItem3dSolutionModel } from "./IFunctionalItem3dSolutionModel.interface";

export interface IBackshell3dSolutionModel extends IBase {
  fkFinSol: number;
  backshellOrientation: string;
  backshellOrientationReference: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  type: string;
  partNumber3d: string;
  finSol: IFunctionalItem3dSolutionModel;
  component: IComponentModel;
}
