/**
 * Inteface for AdapItemModel
 **/
import { IAdapLoModel } from "./IAdapLoModel.interface";
import { IBase } from "./IBase.interface";
import { IPartZoneItemModel } from "./IPartZoneItemModel.interface";

export interface IAdapItemModel extends IBase {
  number?: string;
  adapLo?: IAdapLoModel[];
  pzItem?: IPartZoneItemModel[];
}
