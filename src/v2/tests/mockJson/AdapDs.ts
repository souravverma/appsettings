import { IAdapDsCiLO } from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/interface/AdapDsPzDs.interface";

export const adapDsMockData: IAdapDsCiLO[] = [
  {
    id: "E9297854566655",
    type: "ADAP-DS",
    subType: "ADAP-DS",
    englishTitle: "ROUTING FR20/23 FLOOR",
    domesticTitle: "ROUTING FR20/23 FLOOR",
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
        pzOrigin: null,
        deltaMp: null,
        firstMsn: 12345,
      },
    ],
  },
];
