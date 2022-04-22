import { IPartZoneManagerData } from "../../interfaces/mapping.interface";

export const createHarnessJson = () => {
  const createHarnessoutputData: IPartZoneManagerData = {
    harness3dDesignSolution: {
      adapDesignSolutionNumber: "E9297854566601",
      adapDesignSolutionVersionNumber: "001",
      adapDesignSolutionIssueNumber: "---",
      caccDsNumber: "D92999999000",
      caccDsSolution: "001",
      refParent: null,
      psSynchroStatus: "WARNING",
    },
    partZone: [
      {
        name: "D92999999999QD",
        userArea: "QD",
        issue: "B",
        version: "A",
      },
    ],
    functionalItem: {
      sequenceNumber: "9999",
      circuit: "VB",
    },
    majorComponentAssembly: {
      name: "AD",
    },
    aircraftProgram: {
      familyName: "A320",
    },
  };

  Promise.resolve(createHarnessoutputData);
};

export const updateHarnessPartZoneRelationship = () => {
  return Promise.resolve(null);
};

export const getAllAdapDsPzDsData = (
  adapId: string,
  status = "frozen"
): any => {
  let temporaryAdapDsData;
  if (status == "frozen") {
    return (temporaryAdapDsData = [
      {
        id: 904,
        adapDesignSolutionNumber: "E9297854566601",
        adapDesignSolutionVersionNumber: "001",
        adapDesignSolutionIssueNumber: "---",
        caccDsNumber: "D92999999000",
        caccDsSolution: "001",
        dataStatus: "frozen",
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
    ]);
  } else if (status == "temporary") {
    return (temporaryAdapDsData = [
      {
        id: 904,
        adapDesignSolutionNumber: "E9297854566601",
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
    ]);
  } else {
    return (temporaryAdapDsData = null);
  }
};
