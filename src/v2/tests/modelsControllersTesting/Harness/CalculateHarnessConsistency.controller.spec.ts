import { IHarnessConsistency } from "../../../interfaces/HarnessConsistency.interface";
import CalculateHarnessConsistency from "../../../modelsControllers/Harness/CalculateHarnessConsistency.controller";
import * as GlobalEnums from "../../../ConfigurationFiles/GlobalEnums";

describe("Unit Tests for CalculateHarnessConsistency", () => {
  let calculateHarnessConsistencyController = new CalculateHarnessConsistency();

  it("CalculateHarnessConsistency should be defined", () => {
    expect(CalculateHarnessConsistency).toBeDefined();
  });

  it("should return IHarnessConsistency.IResponse", async () => {
    const output = calculateHarnessConsistencyController.getConsistencyResponse(
      "E92911057030",
      true,
      [
        {
          partZoneName: "E92911057030AJ",
          branch3DName: "BRA0001",
          branch3DExtremityType: "CROSSREF",
          branch3DExtremityName: "=AJD202",
          branch3DExtremityCoordinate: {
            electricalCoordinateX: 7588.789,
            electricalCoordinateY: -1469.659,
            electricalCoordinateZ: -1203.551,
          },
        },
      ],
      {
        error: [
          "CrossRef unlinked : =C9D201 from Partzone E92911057030D2",
          "CrossRef unlinked : =C9D202 from Partzone E92911057030D2",
        ],
        warning: [
          "Dynamic Partzone Warning : CrossRef =AVD201 from Partzones E92911057030D2",
        ],
      }
    );
    expect(output).toStrictEqual({
      status: "ERROR",
      message:
        "Dynamic Partzone Warning : CrossRef =AVD201 from Partzones E92911057030D2,CrossRef unlinked : =C9D201 from Partzone E92911057030D2,CrossRef unlinked : =C9D202 from Partzone E92911057030D2",
    });
  });

  it("should return undefined", async () => {
    const output =
      calculateHarnessConsistencyController.checkHarnessExtremityCoordinate(
        {
          crossRefList: [
            {
              partZoneName: "E92911057030AJ",
              branch3DName: "BRA0001",
              branch3DExtremityType: "CROSSREF",
              branch3DExtremityName: "=AJD202",
            },
          ],
          routeContinutyRef: {
            "=AJD202": {},
          },
          pzStatus: true,
        },
        { error: [], warning: [], noError: [] }
      );

    expect(output).toBeUndefined;
  });

  it("should have an empty consolidation message with K1D202", async () => {
    let consolidationMsg: IHarnessConsistency.IconsolidationMsg = {
      error: [],
      warning: [],
      noError: [],
    };
    calculateHarnessConsistencyController.checkHarnessExtremityCoordinate(
      {
        crossRefList: [
          {
            partZoneName: "E92011057030AJ",
            branch3DName: "BRA0001",
            branch3DExtremityType: "CROSSREF",
            branch3DExtremityName: "=K1D202",
          },
        ],
        routeContinutyRef: {
          "=K1D202": {},
        },
        pzStatus: true,
      },
      consolidationMsg
    );

    expect(consolidationMsg.error.length).toBe(1);
    expect(consolidationMsg.warning.length).toBe(0);
  });

  it("should have an empty consolidation message", async () => {
    let consolidationMsg: IHarnessConsistency.IconsolidationMsg = {
      error: [],
      warning: [],
      noError: [],
    };
    calculateHarnessConsistencyController.checkHarnessExtremityCoordinate(
      {
        crossRefList: [
          {
            partZoneName: "E92011057030AJ",
            branch3DName: "BRA0001",
            branch3DExtremityType: "CROSSREF",
            branch3DExtremityName: "=D1K202",
          },
        ],
        routeContinutyRef: {
          "=D1K202": {},
        },
        pzStatus: true,
      },
      consolidationMsg
    );

    expect(consolidationMsg.error.length).toBe(1);
    expect(consolidationMsg.warning.length).toBe(0);
  });

  it("should have an error in consolidation message if DS is 920 and PZ isn't K", async () => {
    let consolidationMsg: IHarnessConsistency.IconsolidationMsg = {
      error: [],
      warning: [],
      noError: [],
    };
    calculateHarnessConsistencyController.checkHarnessExtremityCoordinate(
      {
        crossRefList: [
          {
            partZoneName: "E92011057030AJ",
            branch3DName: "BRA0001",
            branch3DExtremityType: "CROSSREF",
            branch3DExtremityName: "=D1D202",
          },
        ],
        routeContinutyRef: {
          "=D1D202": {},
        },
        pzStatus: true,
      },
      consolidationMsg
    );

    expect(consolidationMsg.error.length).toBe(2);
  });

  it("should have an error in consolidation message if DS isn't 920", async () => {
    let consolidationMsg: IHarnessConsistency.IconsolidationMsg = {
      error: [],
      warning: [],
      noError: [],
    };
    calculateHarnessConsistencyController.checkHarnessExtremityCoordinate(
      {
        crossRefList: [
          {
            partZoneName: "E92111057030AJ",
            branch3DName: "BRA0001",
            branch3DExtremityType: "CROSSREF",
            branch3DExtremityName: "=K1D202",
          },
        ],
        routeContinutyRef: {
          "=K1D202": {},
        },
        pzStatus: true,
      },
      consolidationMsg
    );

    expect(consolidationMsg.error.length).toBe(3);
  });

  it("should have a warning status and non content consolidation message if DS has 2D DataType", async () => {
    let output = calculateHarnessConsistencyController.getConsistencyResponse(
      "E92921057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.WARNING,
      message: GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA,
    });

    output = calculateHarnessConsistencyController.getConsistencyResponse(
      "E92021057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.WARNING,
      message: GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA,
    });

    output = calculateHarnessConsistencyController.getConsistencyResponse(
      "D92S21057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.WARNING,
      message: GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA,
    });
  });

  it("should have a KO status and not consolidated message if DS has 3D DataType", async () => {
    let output = calculateHarnessConsistencyController.getConsistencyResponse(
      "E92931057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.KO,
      message: GlobalEnums.ConsistencyResponseEnum.KOSTATUS,
    });

    output = calculateHarnessConsistencyController.getConsistencyResponse(
      "E92121057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.KO,
      message: GlobalEnums.ConsistencyResponseEnum.KOSTATUS,
    });

    output = calculateHarnessConsistencyController.getConsistencyResponse(
      "A92921057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.KO,
      message: GlobalEnums.ConsistencyResponseEnum.KOSTATUS,
    });
  });

  it("should have a warning status and no content consolidation message if its a 924 DS", async () => {
    const output = calculateHarnessConsistencyController.getConsistencyResponse(
      "E92421057030",
      false,
      [],
      {
        error: [],
        warning: [],
      }
    );
    expect(output).toStrictEqual({
      status: GlobalEnums.ConsistencyStatus.WARNING,
      message: GlobalEnums.ConsistencyResponseEnum.NOCONTENTCONSOLIDATIONSTATUS,
    });
  });
});
