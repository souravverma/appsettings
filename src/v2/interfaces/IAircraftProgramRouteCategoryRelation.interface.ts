/**
 * Inteface for AircraftProgramRouteCategoryRelation
 **/
import { IBase } from "./IBase.interface";

export interface IAircraftProgramRouteCategoryRelation extends IBase {
  aircraftProgramId?: number;
  routeCategoryId?: number;
}
