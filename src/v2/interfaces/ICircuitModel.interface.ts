/**
 * Inteface for CircuitModel
 **/
import { IAircraftProgramModel } from "./IAircraftProgramModel.interface";
import { IBase } from "./IBase.interface";
import { IFunctionalItemModel } from "./IFunctionalItemModel.interface";

export interface ICircuitModel extends IBase {
  letters?: string;
  description?: string;
  FIN?: IFunctionalItemModel[];
  aircraftProg?: IAircraftProgramModel;
}
