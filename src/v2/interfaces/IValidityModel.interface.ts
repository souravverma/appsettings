/**
 * Inteface for validateModel
 **/
import { IAircraftProgramModel } from "./IAircraftProgramModel.interface";
import { IBase } from "./IBase.interface";

export interface IvalidityModel extends IBase {
  code: string;
  rankNumberFrom: number;
  rankNumberTo: number;
  aircraftPrgm: IAircraftProgramModel;
}
