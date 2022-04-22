import FinHelper from "../../../modelsControllers/FunctionalItem/FinHelper.controller";

jest.mock("../../../models/FunctionalItem.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("FunctionalItemModel", {
    id: "26",
    sequence_number: "D92WxxxxxxxxA1",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    suffix: 2851,
    appended_letter: 52,
    fk_functional_item_id: 1,
    fk_circuit_id: 1,
    fk_aircraft_program_id: 1,
    functionalItemId: 1,
  });
});

jest.mock("../../../models/FunctionalItem3dSolution.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("FunctionalItem3dSolutionModel", {
    id: "26",
    part_number_3d: "D92WxxxxxxxxA1",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    fk_mounting_fin_master_id: 52,
    fk_functional_item_id: 1,
    functionalItem3dSolutionId: 1,
  });
});

jest.mock("../../../models/Branch3d.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("Branch3dModel", {
    id: 43845,
    name: "BRA0001",
    branchId: 1,
    diameter3dMm: 16,
    bendRadius: 16,
    lengthMm: 1752.817,
    lengthForcedMm: 0,
    extraLengthMm: 0,
    notExtractible: false,
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    createdAt: "2021-10-26T05:32:30.109Z",
    updatedAt: "2021-10-26T06:47:30.260Z",
    deletedAt: "2021-10-26T06:47:30.260Z",
  });
});

jest.mock("../../../models/Branch3dExtremitySolution.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("Branch3dExtremitySolutionModel", {
    id: 43845,
    name: "BRA0001",
    electrical_coordinate_x: 1,
    electrical_coordinate_y: 16,
    electrical_coordinate_z: 16,
    fk_branch_manuf_extremity_id: 1,
    fk_branch_3d_extremity_type_id: 2,
    fk_branch_3d_extremity_id: 3,
    branch3dExtremityId: 4,
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    createdAt: "2021-10-26T05:32:30.109Z",
    updatedAt: "2021-10-26T06:47:30.260Z",
  });
});

jest.mock("../../../models/Partzone.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("PartZoneModel", {
    id: 5,
    number: "D92938586520A1",
    createdAt: "2021-10-28T08:46:45.635Z",
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});

jest.mock("../../../models/Circuit.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("CircuitModel", {
    id: 2851,
    letters: "AB",
    fk_circuit_id: "A",
    fk_aircraft_program_id: "B",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
  });
});

jest.mock("../../../modelsControllers/PrototypeModel.controller");

describe("Unit Tests for FinHelper", () => {
  const finHelper = new FinHelper();
  
  it("finHelper should be defined", () => {
    expect(finHelper).toBeDefined();
  });

  it("should return functionalItem", async () => {
    const output = await finHelper.findFunctionalItem("9999", "A", "A1", "A");
    expect(output).toBeDefined;
  });

  it("should return finSolutions", async () => {
    const output = await finHelper.getFinSolutions({ instanceName3d: "" });
    expect(output).toBeDefined;
  });

  it("should return fin", async () => {
    const output = await finHelper.findFin({ circuit: "" });
    expect(output).toBeDefined;
  });
});
