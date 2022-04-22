/**
 * Inteface for ConnectionStatusModel
 **/
import { IBase } from "./IBase.interface";
import { IFunctionalItemSolutionPartZoneRelation } from "./IFunctionalItemSolutionPartZoneRelation.interface";

export interface IConnectionStatusModel extends IBase {
  finSolPartZone?: IFunctionalItemSolutionPartZoneRelation[];
}
