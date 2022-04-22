/**
 * Inteface for AircraftLetterRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IAircraftLetterRelationModel extends IBase {
  aircraftLetter?: string;
  aircraftProgramId?: number;
  domainId?: number;
}
