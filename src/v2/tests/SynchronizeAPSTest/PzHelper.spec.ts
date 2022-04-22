import PzHelper from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/PzHelper";
import DeletePartZone from "../../modelsControllers/Partzone/DeletePartzone.controller";

jest.mock("../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();
  return dbMock.define("Harness3dDesignSolutionModel", {
    id: 904,
    adapDesignSolutionNumber: "E9247854566600",
    adapDesignSolutionVersionNumber: "001",
    adapDesignSolutionIssueNumber: "---",
    caccDsNumber: "D92999999000",
    caccDsSolution: "001",
    dataStatus: "temporary",
    consolidationStatus: "KO",
    consolidationMsg: "harness not consolidated !",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    psSynchroStatus: "OK",
    psSynchroDate: "2021-10-04T11:38:06.301Z",
    createdAt: "2021-10-04T11:38:06.269Z",
    updatedAt: "2021-10-28T05:56:32.213Z",
    fk_major_component_assembly_id: 1,
    partZone: [
      {
        name: "D92999999999QD",
        version: "A",
        issue: "B",
        userArea: {
          name: "QD",
        },
        Harness3dDsPzRelationModel: {
          id: 17805,
          harness3dDesignSolutionId: 904,
          partZoneId: 2851,
          pzStatus: "Official",
        },
      },
    ],
  });
});

describe("Unit Tests for PzHelper", () => {
  const pzHelper = new PzHelper();
  const adapDsData: any = {
    id: 904,
    adapDesignSolutionNumber: "E9247854566600",
    adapDesignSolutionVersionNumber: "001",
    adapDesignSolutionIssueNumber: "---",
    caccDsNumber: "D92999999000",
    caccDsSolution: "001",
    dataStatus: "temporary",
    consolidationStatus: "KO",
    consolidationMsg: "harness not consolidated !",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    psSynchroStatus: "OK",
    // psSynchroDate: "2021-10-04T11:38:06.301Z",
    createdAt: "2021-10-04T11:38:06.269Z",
    updatedAt: "2021-10-28T05:56:32.213Z",
    fk_major_component_assembly_id: 1,
    partZone: [
      {
        name: "D92999999999QD",
        version: "A",
        issue: "B",
        userArea: {
          name: "QD",
        },
        Harness3dDsPzRelationModel: {
          id: 17805,
          harness3dDesignSolutionId: 904,
          partZoneId: 2851,
          pzStatus: "Official",
        },
      },
    ],
  };
  const userAreaNamefromApsInput = ["QD"];

  it("PzHelper should be defined", () => {
    expect(pzHelper).toBeDefined();
  });

  it("deletePartzones should delete data for provided adapDsData", async () => {
    const deletePartZone = new DeletePartZone();

    jest
      .spyOn(deletePartZone, "deletePartzoneList")
      .mockImplementationOnce(() => Promise.resolve(null));

    const result = await pzHelper.deletePartzones(
      adapDsData,
      userAreaNamefromApsInput
    );
    expect(result.tempPz).toEqual(false);
  });
});
