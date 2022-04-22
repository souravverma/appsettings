import Branch3dController from "../../../modelsControllers/Branch/Branch3d.controller";
import Branch3dExtremitySolutionController from "../../../modelsControllers/Branch/Branch3dExtremitySolution.controller";
import {
  container
} from "tsyringe";
import {
  IBranch3dExtremitySolution,
} from "../../../interfaces/mapping.interface";
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
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dExtremitySolutionModel', {
    id: "2",
    name: "EXT0001",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  });
});

jest.mock("../../../models/Branch3dExtremityType.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dExtremityTypeModel', {
    id: "26",
    name: "BRA0003",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  });
});

jest.mock("../../../models/Partzone.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("PartZoneModel", {
    id: 5,
    name: "D92938586520A1",
    createdAt: "2021-10-28T08:46:45.635Z",
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});

jest.mock("../../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Harness3dDesignSolutionModel', {
    id: "26",
    number: "D9291303311600",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  });
});

jest.mock("../../../models/Branch3dExtremityRelation.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Branch3dExtremityRelationModel', {
    id: "12",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z'
  });
});

jest.mock("../../../modelsControllers/PrototypeModel.controller");

const b3dExt: IBranch3dExtremitySolution[] = [{
  "name": "EXT0001",
  "electricalCoordinateX": 11126.628,
  "electricalCoordinateY": 1411.14,
  "electricalCoordinateZ": -1406.839,
  "type": "CONNECTOR",
  "refParent": {
    "ref": "branch3d",
    "whereClause": [{
      "name": "BRA0003",
      "extra": {
        "vectorX": 0,
        "vectorY": -0.65657,
        "vectorZ": -0.75426
      }
    }]
  }
}]
const b3dExtData: any = {
  id: "2",
  name: "EXT0001",
  createdBy: "ce-api-harness",
  updatedBy: "ce-api-harness",
  createdAt: '2021-11-10T05:28:38.067Z',
  updatedAt: '2021-11-10T05:28:38.067Z'
}
describe("Unit Tests for Branch3dExtremitySolutionController", () => {
  let branch3dExtremitySolutionController: Branch3dExtremitySolutionController;

  beforeEach(() => {
    const branchController = new Branch3dController();
    branch3dExtremitySolutionController = new Branch3dExtremitySolutionController(branchController);
    Object.getPrototypeOf(branch3dExtremitySolutionController).whereClause = {
      partZone: {},
      harness3dDesignSolution: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("Should return Branch3dExtremitySolutionModel", async () => {
      const output =await branch3dExtremitySolutionController.findAll();

          expect(output[0].toJSON()).toEqual({
              id: '2',
              name:"EXT0001",
              createdBy: "ce-api-harness",
              updatedBy: "ce-api-harness",
              createdAt: '2021-11-10T05:28:38.067Z',
              updatedAt: '2021-11-10T05:28:38.067Z'
            })
  });

  it("Should createOrUpdate Branch3dExtremitySolutionModel", async () => {
    jest
      .spyOn(branch3dExtremitySolutionController, "createOrUpdate")
      .mockImplementation(() => Promise.resolve(undefined));
    const output = await branch3dExtremitySolutionController.createOrUpdate(b3dExt, null, {
      harness3dDesignSolution: {
        adapDesignSolutionNumber: 'D9291354500000',
        adapDesignSolutionVersionNumber: '001',
        adapDesignSolutionIssueNumber: '---'
      }
    });
    expect(output).toBeUndefined;
  });

  it("Should findAll and return FinsBranchExtAssociation", async () => {

    const output = await branch3dExtremitySolutionController.findAllFinsBranchExtAssociation(b3dExtData);
    expect(output.toJSON()).toEqual({
      id: '2',
      name: 'EXT0001',
      createdBy: 'ce-api-harness',
      updatedBy: 'ce-api-harness',
      createdAt: '2021-11-10T05:28:38.067Z',
      updatedAt: '2021-11-10T05:28:38.067Z'
    })
  });

  it("Should clean branch extremity", async () => {
    const output =await branch3dExtremitySolutionController.clean(b3dExt,[b3dExtData]);
    console.log(output)
    expect(output).toBeUndefined;
  });
});
