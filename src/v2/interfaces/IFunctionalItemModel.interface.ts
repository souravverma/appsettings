/**
 * Inteface for FunctionalItemModel
 **/
import { IAircraftProgramModel } from "./IAircraftProgramModel.interface";
import { IBase } from "./IBase.interface";
import { ICircuitModel } from "./ICircuitModel.interface";
import { IFunctionalItem3dSolutionModel } from "./IFunctionalItem3dSolutionModel.interface";
import { IHarness3dDesignSolutionModel } from "./IHarness3dDesignSolutionModel.interface";

export interface IFunctionalItemModel extends IBase {
  sequenceNumber?: string;
  suffix?: string;
  appendedLetter?: string;
  supplementaryPart?: string;
  description?: string;
  finSol?: IFunctionalItem3dSolutionModel[];
  circuit?: ICircuitModel;
  aircraftPrgm?: IAircraftProgramModel;
  harness3d?: IHarness3dDesignSolutionModel[];
}
