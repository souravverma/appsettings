import { IHarnessConsistency } from "../interfaces/HarnessConsistency.interface";

export const enum ComponentsEnum {
  COMPONENT = "component",
  HARNESS3DDESIGNSOLUTION = "harness3dDesignSolution",
  PARTZONE = "partZone",
  FUNCTIONALITEM = "functionalItem",
  BRANCH3D = "branch3d",
  BRANCH3DEXTREMITYSOLUTION = "branch3dExtremitySolution",
  FUNCTIONALITEM3DSOLUTION = "functionalItem3dSolution",
  BACKSHELL3DSOLUTION = "backshell3dSolution",
  COVERINGELEMENT3D = "coveringElement3d",
}

export const enum DataStatusEnum {
  FROZEN = "frozen",
  TEMPORARY = "temporary",
  FROZENLPZ = "frozenLPZ",
  SUCCESS = "success",
  INCORRECTVERSION = "incorrectVersion",
}

export const enum ConsistencyResponseEnum {
  CONSOLIDATIONSTATUS = "consolidation status ok!",
  HARNESSCONSOLIDATIONSTATUS = "Harness consolidated successfully",
  KOSTATUS = "harness not consolidated !",
  OVERWRITEFORBIDDEN = "Overwrite frozen partzone forbidden!!",
  ROUTEDOESNOTEXIST = "Missing Routes",
  NOCONTENTCONSOLIDATIONSTATUS = "No content for 924 data",
  NONCONTENT2DDATA = "Non content for 2D data",
}

export const enum HarnessStatus {
  FROZENSUCCESS = "Frozen Successfully",
  DSSTATUS = "DS already in unfrozen  state",
  UNFROZENSUCCESS = "Unfreeze Successfull",
  DSALREADYEXIST = "DS Already Exists",
}

export const ConsistencyStatus: {
  [key: string]: IHarnessConsistency.IResponseStatus;
} = {
  OK: "OK",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
  KO: "KO",
};
