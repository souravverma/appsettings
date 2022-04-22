/**
 * Inteface for DomainModel
 **/
import { IAircraftLetterRelationModel } from "./IAircraftLetterRelationModel.interface";
import { IBase } from "./IBase.interface";

export interface IDomainModel extends IBase {
  code: string;
  aircraftProgram: IAircraftLetterRelationModel[];
}
