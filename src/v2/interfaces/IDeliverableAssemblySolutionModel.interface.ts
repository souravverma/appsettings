/**
 * Inteface for DeliverableAssemblySolutionModel
 **/
import { IBase } from "./IBase.interface";
import { IDeliverableAssemblyModel } from "./IDeliverableAssemblyModel.interface";
import { IHarness3dDesignSolutionModel } from "./IHarness3dDesignSolutionModel.interface";

export interface IDeliverableAssemblySolutionModel extends IBase {
  deliverableAssemblySolution?: string;
  status?: string;
  dA?: IDeliverableAssemblyModel;
  harness3d?: IHarness3dDesignSolutionModel[];
  hManufSA?: IHarness3dDesignSolutionModel[];
}
