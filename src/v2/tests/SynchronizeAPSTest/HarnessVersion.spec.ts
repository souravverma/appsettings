import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import AdapDsHarnessHelper from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/AdapDsHarnessHelper";
import HarnessVersion from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/HarnessVersion";
import { IAdapDsCiLO } from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/interface/AdapDsPzDs.interface";

jest.mock("../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("Harness3dDesignSolutionModel", {
    id: 904,
    adapDesignSolutionNumber: "E9297854566600",
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

//Else condition is remaining in this test file
describe("Unit Tests for getNewDSVersion", () => {
  const harnessVersion = new HarnessVersion();
  let dataFromApsInput: IAdapDsCiLO = {
    id: "E9297854566600",
    type: "ADAP-DS",
    subType: "ADAP-DS",
    englishTitle: "ROUTING FR20/23 FLOOR",
    issue: "---",
    version: "001",
    lastReleased: false,
    lastIssue: false,
    lastModifiedDate: "23/06/2020",
    releaseStatus: "Release",
    firstMsn: 12345,
    ciLo: [
      {
        adapCiId: "DME92Z420904",
        adapLoId: "DME92Z420905",
      },
    ],
    specifiedPzDs: [
      {
        id: "D92999999999QD",
        pzCiId: "D92WxxxxxxxxA1",
        lastModifiedDate: "23/06/2020",
        issue: "B",
        version: "A",
        firstMsn: 12345,
        pzOrigin: [
          {
            id: "D92410657000A1",
            issue: "___",
          },
          {
            id: "D92411002002A1",
            issue: "___",
          },
        ],
        deltaMp: [
          {
            added: ["MPplus1", "MPplus2"],
            removed: ["MPminus1", "MPminus2"],
          },
        ],
      },
    ],
    implementedPzDs: [
      {
        id: "D929xxxxxxxxA1",
        pzCiId: "D92WxxxxxxxxA1",
        issue: "B",
        version: "A",
        lastModifiedDate: "23/06/2020",
        pzOrigin: [],
        deltaMp: [],
        firstMsn: 12345,
      },
    ],
  };
  const userAreaNamefromApsInput = ["QD"];

  const outputData = {
    newVersion: "001",
    flagCreateNewDS: false,
  };

  it("harnessVersion should be defined", () => {
    expect(harnessVersion).toBeDefined();
  });

  it("Get New DSVersion", async () => {
    const adapDsHarnessHelper = new AdapDsHarnessHelper();

    jest
      .spyOn(adapDsHarnessHelper, "getAllAdapDsPzDsData")
      .mockImplementationOnce(() => Promise.resolve(null));

    const getNewDSVersionOutput = await harnessVersion.getNewDSVersion(
      dataFromApsInput,
      userAreaNamefromApsInput,
      "001"
    );
    console.log(getNewDSVersionOutput, "getNewDSVersionOutput");
  });

  it("Get 14 digit DSVersion for 12 digit proposed ds", async () => {
    const adapDsHarnessHelper = new AdapDsHarnessHelper();
    dataFromApsInput.id = "E92978545666";
    jest
      .spyOn(adapDsHarnessHelper, "getAllAdapDsPzDsData")
      .mockImplementationOnce(() => Promise.resolve(null));

    const getNewDSVersionOutput = await harnessVersion.getNewDSVersion(
      dataFromApsInput,
      userAreaNamefromApsInput,
      "001"
    );
    console.log(getNewDSVersionOutput, "getNewDSVersionOutput");
  });
});
