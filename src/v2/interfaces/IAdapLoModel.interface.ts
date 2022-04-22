/**
 * Inteface for AdapLoModel
 **/
import { IAdapItemModel } from "./IAdapItemModel.interface";
import { IBase } from "./IBase.interface";
import { IHarness3dDesignSolutionModel } from "./IHarness3dDesignSolutionModel.interface";

export interface IAdapLoModel extends IBase {
  number?: string;
  poe?: string;
  adapItem?: IAdapItemModel;
  harness3d?: IHarness3dDesignSolutionModel;
}
