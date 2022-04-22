import { IHarness3dDesignSolutionModel } from "../../../interfaces/IHarness3dDesignSolutionModel.interface";

export const mockData = [
  {
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
  },
] as unknown as IHarness3dDesignSolutionModel[];
