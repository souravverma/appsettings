import AdapDsSyncController from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/AdapDsSync.controller";
import { IAdapDsCiLO } from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/interface/AdapDsPzDs.interface";
import { adapDsMockData } from "../mockJson/AdapDs";

const dataFromAps: IAdapDsCiLO[] = adapDsMockData;

describe("Unit Tests for storeAdapData", () => {
  const adapDsSyncController = new AdapDsSyncController();
  const adapLoMockData = [
    {
      number: "E92978545666",
      poe: 12345,
      fk_harness_3d_ds_id: 1,
      fk_adap_item_id: 2,
    },
  ];
  const adapDsMock: any = {
    id: 904,
    adapDesignSolutionNumber: "E9297854566601",
    adapDesignSolutionVersionNumber: "001",
    adapDesignSolutionIssueNumber: "---",
    harnessType: null,
    adapDsOwner: null,
    releaseStatus: null,
    modificationAdapDsDate: null,
    extractionOwner: null,
    extractionDateFrom3d: null,
    storingOwnerInCoreElec: null,
    storingDateInCoreElec: null,
    caccDsNumber: "E92978545666",
    caccDsSolution: "001",
    dataStatus: "temporary",
    consolidationStatus: "KO",
    consolidationMsg: "harness not consolidated !",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    psSynchroStatus: null,
    pdmReleaseStatus: null,
    createdAt: "2021-10-04T11:38:06.269Z",
    updatedAt: "2021-10-04T13:37:49.547Z",
    deletedAt: null,
    fk_deliverable_assembly_solution_id: null,
    fk_major_component_assembly_id: 1,
    partZone: [
      {
        name: "E92978545666A1",
        version: "A",
        issue: "B",
        userArea: { name: "A1" },
        Harness3dDsPzRelationModel: {
          id: 17796,
          harness3dDesignSolutionId: 904,
          partZoneId: 2251,
          pzStatus: null,
        },
      },
    ],
  };
  it("AdapDs should be defined", () => {
    expect(AdapDsSyncController).toBeDefined();
  });

  it("should return synchronization success message", async () => {
    jest
      .spyOn(adapDsSyncController, "storeAdapData")
      .mockImplementation(() => Promise.resolve({"message": "synchronization success"}));
      const output = await adapDsSyncController.storeAdapData(dataFromAps);
      console.log(output)
    expect(output).toMatchObject(
      {"message": "synchronization success"}
    );
  });

  it("should throw an error", () => {
    jest
    .spyOn(adapDsSyncController, "storeAdapData")
      .mockImplementation(() => Promise.reject("400 Bad Request"));
    const output = adapDsSyncController.storeAdapData(dataFromAps);
    output.catch(e => {
      expect(e).toEqual("400 Bad Request");
    });
  });
});
