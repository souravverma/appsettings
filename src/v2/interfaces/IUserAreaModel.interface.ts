/**
 * Inteface for UserAreaModel
 **/
import { IBase } from "./IBase.interface";
import { IPartZoneModel } from "./IPartZoneModel.interface";
import { IPartZoneItemModel } from "./IPartZoneItemModel.interface";

export interface IUserAreaModel extends IBase {
  partZone?: IPartZoneModel[];
  pzItem?: IPartZoneItemModel[];
}
