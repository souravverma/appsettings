/**
 * Inteface for ModificationProposalPzSolutionRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IModificationProposalPzSolutionRelationModel extends IBase {
  mpDelta?: string;
  partzone?: number;
}
