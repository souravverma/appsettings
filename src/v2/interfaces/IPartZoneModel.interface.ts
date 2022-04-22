/**
 * Inteface for PartZoneModel
 **/
import { IBase } from "./IBase.interface";
import { IBranch3dModel } from "./IBranch3dModel.interface";
import { IFunctionalItem3dSolutionModel } from "./IFunctionalItem3dSolutionModel.interface";
import { IHarness3dDesignSolutionModel } from "./IHarness3dDesignSolutionModel.interface";
import { IModificationProposalModel } from "./IModificationProposalModel.interface";
import { IPartZoneItemModel } from "./IPartZoneItemModel.interface";
import { IUserAreaModel } from "./IUserAreaModel.interface";

export interface IPartZoneModel extends IBase {
  issue?: string;
  pzType?: string;
  dataStatus?: string;
  dataType?: string;
  consolidationStatus?: string;
  consolidationMessage?: string;
  releaseStatus?: string;
  b3d?: IBranch3dModel[];
  pzItem?: IPartZoneItemModel[];
  userArea?: IUserAreaModel;
  origin?: IPartZoneModel;
  harness3d: IHarness3dDesignSolutionModel[];
  finDs: IFunctionalItem3dSolutionModel[];
  modProp?: IModificationProposalModel[];
}
