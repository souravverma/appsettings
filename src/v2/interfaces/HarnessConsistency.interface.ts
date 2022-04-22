export namespace IHarnessConsistency {
  export interface IHarness {
    adapDesignSolutionNumber?: string;
    crossRefList?: IHarnessCrossRef[];
    routeContinutyRef?: { [key: string]: IrouteContinutyRef };
    pzStatus?: boolean;
  }

  export interface IrouteContinutyRef {
    [key: string]: { route?: string[]; status?: string };
  }

  export interface IHarnessCrossRef {
    partZoneName?: string;
    branch3DName?: string;
    branch3DExtremityType?: string;
    branch3DExtremityName?: string;
    branch3DExtremityCoordinate?: IHarnessCrossRefCoordinate;
  }

  interface IHarnessCrossRefCoordinate {
    electricalCoordinateX?: number;
    electricalCoordinateY?: number;
    electricalCoordinateZ?: number;
  }

  export interface IResponse {
    status: IResponseStatus;
    message: string;
  }

  export interface IconsolidationMsg {
    warning?: string[];
    error?: string[];
    noError?: string[];
  }

  export type IResponseStatus = "OK" | "SUCCESS" | "WARNING" | "ERROR" | "KO";
}
