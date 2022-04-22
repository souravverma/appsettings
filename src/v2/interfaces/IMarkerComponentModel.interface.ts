/**
 * Inteface for MarkerComponentModel
 **/
import { IBase } from "./IBase.interface";
import { IComponentModel } from "./IComponentModel.interface";

export interface IMarkerComponentModel extends IBase {
  type?: string;
  colour?: string;
  material?: string;
  function?: string;
  component?: IComponentModel;
}
