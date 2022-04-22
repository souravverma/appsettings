/**
 * Inteface for SubAssemblyModel
 **/
import { IBase } from "./IBase.interface";

export interface ISubAssemblyModel extends IBase {
  deliverableAssembly?: string;
  effectiveRoutes?: string;
}
