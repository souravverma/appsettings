import { IBackshell3dSolutionModel } from "./IBackshell3dSolutionModel.interface";
import { IBase } from "./IBase.interface";
import { IBranch3dExtremitySolutionModel } from "./IBranch3dExtremitySolutionModel.interface";
import { IFunctionalItemModel } from "./IFunctionalItemModel.interface";
/**
 * Inteface for FunctionalItem3dSolutionModel
 **/
import { IFunctionalItemSolutionPartZoneRelation } from "./IFunctionalItemSolutionPartZoneRelation.interface";
import { IPartZoneModel } from "./IPartZoneModel.interface";

export interface IFunctionalItem3dSolutionModel extends IBase {
  solutionNumber?: string;
  partNumber3d?: string;
  instanceName3d?: string;
  definitionZone?: string;
  panel?: string;
  longPartNumber?: string;
  mountingPriority?: string;
  masterSourceId?: string;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  fin?: IFunctionalItemModel;
  mountingFin?: IFunctionalItem3dSolutionModel;
  partZone?: IPartZoneModel[];
  FinPzRelations?: IFunctionalItemSolutionPartZoneRelation[];
  b3dExt?: IBranch3dExtremitySolutionModel[];
  backshells?: IBackshell3dSolutionModel[];
}
