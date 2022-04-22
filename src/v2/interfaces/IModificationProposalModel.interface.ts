/**
 * Inteface for ModificationProposalModel
 **/
import { IAircraftProgramModel } from "./IAircraftProgramModel.interface";
import { IBase } from "./IBase.interface";
import { IPartZoneModel } from "./IPartZoneModel.interface";

export interface IModificationProposalModel extends IBase {
  indice?: string;
  type: string;
  aircraftPrgm?: IAircraftProgramModel;
  partzone?: IPartZoneModel[];
}
