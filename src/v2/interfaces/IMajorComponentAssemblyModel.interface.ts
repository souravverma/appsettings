/**
 * Inteface for MajorComponentAssemblyModel
 **/
import { IBase } from "./IBase.interface";
import { IHarness3dDesignSolutionModel } from "./IHarness3dDesignSolutionModel.interface";

export interface IMajorComponentAssemblyModel extends IBase {
  harness3d?: IHarness3dDesignSolutionModel[];
}
