import PzDsCiRelation from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/PzDsCiRelation";
import {adapDsMockData} from "../mockJson/AdapDs";

const dataFromAps = adapDsMockData;

jest.mock("../../models/PartzoneItem.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('PartzoneItemModel', {
    id: "26",
    number: "D92WxxxxxxxxA1",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    fk_part_zone_solution_id: 2851,
    fk_user_area_id: 52,
  })
})

jest.mock("../../models/Partzone.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('PartZoneModel', {
    id: 2851,
    name: "D92999999999QD",
    version: "A",
    issue: "B",
    pzType: null,
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    dataStatus: "waiting_data",
    consolidationStatus: "N/A",
    consolidationMessage: "Route continuity check not applicable!",
    releaseStatus: null,
    createdAt: {
    },
    updatedAt: {
    },
    deletedAt: null,
    fk_user_area_id: 28,
    fk_origin_id: null,
  })
})

jest.mock("../../modelsControllers/PrototypeModel.controller");

describe("Unit Tests for createPartZoneCisRelation", () => {
  const pzDsCiRelation = new PzDsCiRelation();
  const output = [
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
          added: [
            "MPplus1",
            "MPplus2",
          ],
          removed: [
            "MPminus1",
            "MPminus2",
          ],
        },
      ],
    },
  ]

  it("pzci and Ds should be defined", () => {
    expect(PzDsCiRelation).toBeDefined();
  });

  it("should return empty array", async () => {
   const pzDsCiRelationOutput =  await pzDsCiRelation.createPartZoneCisRelation(dataFromAps[0].specifiedPzDs)
   expect(pzDsCiRelationOutput).toEqual([undefined])
  });

  it("should return empty array when null is passed", async () => {
    const pzDsCiRelationOutput =  await pzDsCiRelation.createPartZoneCisRelation([null]);
    expect(pzDsCiRelationOutput).toEqual([ undefined ])
   });
});
