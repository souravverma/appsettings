import Branch3dSegmentController from "../../../modelsControllers/Branch/Segment.controller";
import Branch3dModel from "../../../models/Branch3d.model";

jest.mock("../../../models/Branch3dSegment.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dSegmentModel', {
    name: "DER0001",
    id: "26",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  });
});

describe("Unit Tests for Branch3dSegmentController", () => {
  let branch3dModel: any = {
    name: "BRA0001",
    id: "26",
    branchId: 1,
    diameter3dMm: 16,
    bendRadius: 16,
    lengthMm: 1752.817,
    lengthForcedMm: 0,
    extraLengthMm: 0,
    notExtractible: false,
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  };;
  const branch3dSegmentController = new Branch3dSegmentController();
  it("Branch3dSegmentController should be defined", () => {
    expect(Branch3dSegmentController).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Create or update segment", async () => {
    const output = await branch3dSegmentController.createOrUpdate(
      "DER0001",
      branch3dModel
    );
    expect(output).toBe(undefined);
  });
});
