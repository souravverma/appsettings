/**
 * Inteface for DeliverableAssemblyModel
 **/
import { IBase } from "./IBase.interface";
import { IDeliverableAssemblySolutionModel } from "./IDeliverableAssemblySolutionModel.interface";

export interface IDeliverableAssemblyModel extends IBase {
  number?: string;
  constituentAssemblyNumber?: string;
  dASol?: IDeliverableAssemblySolutionModel[];
}
