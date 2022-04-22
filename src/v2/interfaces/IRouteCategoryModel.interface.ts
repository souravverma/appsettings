/**
 * Inteface for RouteCategoryModel
 **/
import { IAircraftProgramModel } from "./IAircraftProgramModel.interface";
import { IBase } from "./IBase.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";
import { IFunctionalItemSolutionPartZoneRelation } from "./IFunctionalItemSolutionPartZoneRelation.interface";

export interface IRouteCategoryModel extends IBase {
  essential?: boolean;
  system?: number;
  systemDescription?: string;
  categoryCode?: string;
  categoryDescription?: string;
  remarks?: string;
  aircraftPrgm?: IAircraftProgramModel;
  b3dEffective?: IBranch3dModel[];
  finPZ?: IFunctionalItemSolutionPartZoneRelation[];
}
