/**
 * Inteface for FunctionalItemSolutionPartZoneRelation
 **/
import { IBase } from "./IBase.interface";
import { IConnectionStatusModel } from "./IConnectionStatusModel.interface";
import { IRouteCategoryModel } from "./IRouteCategoryModel.interface";

export interface IFunctionalItemSolutionPartZoneRelation extends IBase {
  mountingPriority?: string;
  functionalItem3dSolutionId?: number;
  partZoneId?: number;
  effectiveRoutes?: IRouteCategoryModel[];
  connStatus?: IConnectionStatusModel;
}
