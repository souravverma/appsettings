/**
 * Inteface for PartZoneItemModel
 **/
import { IAdapItemModel } from "./IAdapItemModel.interface";
import { IPartZoneModel } from "./IPartZoneModel.interface";
import { IUserAreaModel } from "./IUserAreaModel.interface";

export interface IPartZoneItemModel {
  id?: number;
  number?: string;
  createdBy?: string;
  updatedBy?: string;
  userArea?: IUserAreaModel;
  partzone?: IPartZoneModel;
  adapItem?: IAdapItemModel[];
}
