/**
 * Inteface for AircraftProgramModel
 **/
import { IAircraftLetterRelationModel } from "./IAircraftLetterRelationModel.interface";
import { IBase } from "./IBase.interface";
import { ICircuitModel } from "./ICircuitModel.interface";
import { IFunctionalItemModel } from "./IFunctionalItemModel.interface";
import { IModificationProposalModel } from "./IModificationProposalModel.interface";
import { IRouteCategoryModel } from "./IRouteCategoryModel.interface";

export interface IAircraftProgramModel extends IBase {
  familyName?: string;
  taksyProjectKey?: number;
  taksyShortCode?: string;
  FIN?: IFunctionalItemModel[];
  circuits?: ICircuitModel[];
  routes?: IRouteCategoryModel[];
  mpDeltaId?: IModificationProposalModel[];
  domain?: IAircraftLetterRelationModel[];
}
