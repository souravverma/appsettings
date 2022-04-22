import { TTablesName } from "./mapping.interface";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import { WhereOptions } from "sequelize";

export interface IconfigFile {
  name?: string;
  fileFormat: TFileFormat;
  unicities: Array<IUnicityRule>;
}

export type TFileFormat = "kbl" | "proptool";

export interface IUnicityRule {
  name: TTablesName;
  fields: Array<string>;
}

export interface IWhereClauseParent {
  partZone?: any;
  version?: any;
  harness3dDesignSolution: any;
}

export interface IWhereClauseHarness3dDs {
  adapDesignSolutionNumber: string;
  caccDsNumber?: string;
  caccDsSolution?: string;
}
