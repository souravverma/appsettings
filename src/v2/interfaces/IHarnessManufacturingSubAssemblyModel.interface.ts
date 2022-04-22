/**
 * Inteface for HarnessManufacturingSubAssemblyModel
 **/
import { IBase } from "./IBase.interface";
import { IDeliverableAssemblySolutionModel } from "./IDeliverableAssemblySolutionModel.interface";

export interface IHarnessManufacturingSubAssemblyModel extends IBase {
  dASol: IDeliverableAssemblySolutionModel;
}
