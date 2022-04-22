import DeleteBranchElements from "../../../modelsControllers/Branch/DeleteBranchElements";

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

jest.mock("../../../models/Branch3dExtremityFinDsRelation.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dExtremityFinDsRelationModel', {
    id: 1,
    fk_branch_3d_extremity_id: "26",
    fk_fin_ds_id: "2"
  });
});

jest.mock("../../../models/Branch3dCoveringElementSolutionRelation.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dCoveringElementSolutionRelationModel', {
    id: 1,
    fk_branch_3d_id: "26",
    fk_covering_element_3d_id: "2",
  });
});

jest.mock("../../../models/Branch3dExtremityCoveringElementRelation.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dExtremityCoveringElementRelation', {
    id: 1,
    fk_branch_3d_extremity_id: "26",
    fk_covering_element_3d_id: "2"
  });
});

describe("Unit Tests for DeleteBranchElements", () => {
  const deleteBranchElements = new DeleteBranchElements();
  let branch3dModel: any = {
    name: "BRA0001",
    id: "26",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  };
  let coveringElement3dModel: any = {
    id: "26",
    name: "BRA0001",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  };
  let branchPointDefinitionModel: any = {
    id: "26",
    coordinate_x:1,
    coordinate_y:2,
    coordinate_z:3,
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  };
  let branch3dSegment: any = {
    name: "DER0001",
    id: "26",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  };
  let branch3dExtremitySolution: any = {
    id: "2",
    name: "EXT0001",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  };
  it("DeleteBranchElements should be defined", () => {
    expect(DeleteBranchElements).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("delete Branch3dCoveringElementSolutionRelationModel", async () => {

    const output = await deleteBranchElements.deleteBranch3dCoveringElementSolutionRelationModel(
      branch3dModel,
      false
    );
    expect(output).toBe(undefined);
  });


  it("delete deleteCoveringElement", async () => {

    const output = await deleteBranchElements.deleteCoveringElement(
      coveringElement3dModel,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteRouteBranch3dRelationModel", async () => {

    const output = await deleteBranchElements.deleteRouteBranch3dRelationModel(
      branch3dModel,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteRouteBranch3dRelationModel", async () => {

    const output = await deleteBranchElements.deleteRouteBranch3dRelationModel(
      branch3dModel,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteBranch3dEnvironmentRelationModel", async () => {

    const output = await deleteBranchElements.deleteBranch3dEnvironmentRelationModel(
      branch3dModel,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteBranchPointDefinitionModel", async () => {

    const output = await deleteBranchElements.deleteBranchPointDefinitionModel(
      branchPointDefinitionModel,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteBranch3dSegmentModel", async () => {

    const output = await deleteBranchElements.deleteBranch3dSegmentModel(
      branch3dSegment,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteBranch3dExtremityRelationModel", async () => {

    const output = await deleteBranchElements.deleteBranch3dExtremityRelationModel(
      branch3dModel,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteBranchExtremity", async () => {

    const output = await deleteBranchElements.deleteBranchExtremity(
      branch3dExtremitySolution,
      false
    );
    expect(output).toBe(undefined);
  });

  it("delete deleteBranch3dExtremityFinDsRelationModel", async () => {

    const output = await deleteBranchElements.deleteBranch3dExtremityFinDsRelationModel(
      branch3dExtremitySolution,
      false
    );
    expect(output).toBe(undefined);
  });
});
