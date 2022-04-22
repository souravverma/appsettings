import PartZoneController from "../../../modelsControllers/Partzone/PartZone.controller";

jest.mock("../../../models/Partzone.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("PartzoneModel", {
    id: "26",
    name: "D92913033116A1",
    version: "001",
    dataStatus: "waiting_data",
    updated_at: "2021-11-10T05:28:38.067Z",
    updatedAt: "2021-12-07T04:31:05.082Z",
    createdAt: "2021-12-07T04:31:05.082Z",
    releaseStatus: "OK",
  });
});

jest.mock("../../../models/PartzoneItem.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("PartzoneItemModel", {
    id: "26",
    partzone: 26,
  });
});

jest.mock("../../../models/AdapItemPartzoneItemRelation.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("AdapItemPartzoneItemRelationModel", {
    id: "26",
    pzItemId: 26,
  });
});

jest.mock("../../../models/ModificationProposalPzSolutionRelation", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("ModificationProposalPzSolutionRelationModel", {
    id: "26",
    mpDelta: "D92913033116A1",
    mpDeltaId: 123,
    partzone: 26,
  });
});

jest.mock("../../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("Harness3dDesignSolutionModel", {
    id: 5,
    number: "D9291303311600",
    fin: [],
    createdAt: "2021-10-28T08:46:45.635Z",
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});

jest.mock("../../../models/UserAreaPartZone.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("UserAreaModel", {
    id: "1",
    name: "A2",
    updated_at: "2021-11-10T05:28:38.067Z",
  });
});

jest.mock("../../../modelsControllers/PrototypeModel.controller");
jest.mock(
  "../../../modelsControllers/Partzone/ManagePartZoneAssignment.controller"
);

describe("Unit Tests for PartZone Class", () => {
  const partZoneController = new PartZoneController();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find and return PartZone Model", async () => {
    await partZoneController
      .findPartZone({
        name: "D92913033116A1",
      })
      .then((res) => {
        expect(res.toJSON()).toEqual({
          createdAt: "2021-12-07T04:31:05.082Z",
          id: "26",
          name: "D92913033116A1",
          dataStatus: "waiting_data",
          updatedAt: "2021-12-07T04:31:05.082Z",
          updated_at: "2021-11-10T05:28:38.067Z",
          version: "001",
          releaseStatus: "OK",
        });
      });
  });

  it("should return createOrUpdate", async () => {
    const output = await partZoneController.createOrUpdate(
      false,
      [
        {
          name: "D92913033116A1",
          userArea: "A1",
          issue: "A",
          version: "001",
          releaseStatus: "OK",
        },
      ],
      {
        adapDesignSolutionNumber: "D9291303311600",
        adapDesignSolutionVersionNumber: "001",
        adapDesignSolutionIssueNumber: "A",
        dataStatus: "temporary",
      } as any,
      null,
      {
        partZone: "D92913033116A1",
        version: "001",
        harness3dDesignSolution: "D9291303311600",
      }
    );
    expect(output).toBeDefined;
  });

  it("should find and remove all orphan PartZones if exists", async () => {
    await partZoneController
      .removeOrphanPartZoneAndFindAllPartZone({
        name: "D92913033116A1",
      })
      .then((res) => {
        expect(res).toBeDefined;
      });
  });
});
