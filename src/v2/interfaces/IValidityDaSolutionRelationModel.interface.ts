/**
 * Inteface for ValidityDaSolutionRelationModel
 **/
import { IBase } from "./IBase.interface";

export interface IValidityDaSolutionRelationModel extends IBase {
  ValidityId: number;
  DeliverableAssemblySolutionId: number;
}
