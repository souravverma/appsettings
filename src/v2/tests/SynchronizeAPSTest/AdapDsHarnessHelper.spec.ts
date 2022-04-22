import "reflect-metadata"
import { container } from "tsyringe";
import CreationController from "../../controllers/Creation.controller";
import AdapDsHarnessHelper from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/AdapDsHarnessHelper";
import {
  ISpecifiedPzDs
} from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/interface/AdapDsPzDs.interface";

jest.mock("../../controllers/Creation.controller");

jest.mock("../../models/Harness3dDsPzRelation.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Harness3dDsPzRelationModel', {
    id: 5,
    number: 'D92938586520A1',
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});
jest.mock("../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Harness3dDesignSolutionModel', {
    id: 5,
    number: 'D92938586520A1',
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});
jest.mock("../../models/Partzone.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('PartZoneModel', {
    id: 5,
    number: 'D92938586520A1',
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});

describe("Unit Tests for createHarnessJson", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  const InputData = {
    harness3dDesignSolution: {
      adapDesignSolutionNumber: "E9297854566601",
      adapDesignSolutionVersionNumber: "001",
      adapDesignSolutionIssueNumber: "---",
    },
    partZone: [{
      name: "D92999999999QD",
      userArea: "QD",
      issue: "B",
      version: "A",
    },],
  };

  const outputData = {
    harness3dDesignSolution: {
      adapDesignSolutionNumber: 'E9297854566601',
      adapDesignSolutionVersionNumber: '001',
      adapDesignSolutionIssueNumber: '---',
      caccDsNumber: 'D92999999000',
      caccDsSolution: '001',
    },
    partZone: [
      {
        name: 'D92999999999QD',
        userArea: 'QD',
        issue: 'B',
        version: 'A'
      }
    ],
    functionalItem: { sequenceNumber: '9999', circuit: 'VB' },
    majorComponentAssembly: { name: 'AD' },
    aircraftProgram: { familyName: 'A320' }
  }


  it("AdapDsHarness should be defined", () => {
    expect(AdapDsHarnessHelper).toBeDefined();
  });

  it("create Harness Json", async () => {
    const creationController = container.resolve(CreationController);
    jest
      .spyOn(creationController, "createComponents")
      .mockImplementation(() => Promise.resolve(null))

    expect(await adapDsHarnessHelper.createHarnessJson(InputData, "9999", "VB"))
      .toEqual(outputData);
  });
});

describe("Unit Tests for updateHarnessPartZoneRelationship", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  const pzDsfromApsInput = [{
    name: "D92999999999QD",
    userArea: "QD",
    issue: "B",
    version: "A",
  }];
  it("update updateHarnessPartZoneRelationship", async () => {
    expect(await adapDsHarnessHelper.updateHarnessPartZoneRelationship('E9297854566601', '001', pzDsfromApsInput))
  });

});

describe("Unit Tests for getAdapDsPzDsData", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  it("Get AdapDsPzDsData", async () => {
    await adapDsHarnessHelper.getAdapDsPzDsData('E9297854566601', '001').then(res => {
      expect(res.toJSON()).toEqual({
        id: 5,
        number: 'D92938586520A1',
        createdAt: '2021-10-28T08:46:45.635Z',
        updatedAt: '2021-10-28T08:53:28.541Z',
        adapDesignSolutionNumber: 'E9297854566601',
        adapDesignSolutionVersionNumber: '001'
      })
    });
  });
});




describe("Unit Tests for updateHarnessWithNewStatus", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  it("update updateHarnessWithNewStatus", async () => {
    expect(await adapDsHarnessHelper.updateHarnessWithNewStatus(904))
  });

});

describe("Unit Tests for getAllAdapDsPzDsData", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  const temporaryAdapDsDataOutPut =
    it("Returning Empty Data", async () => {
      expect(await adapDsHarnessHelper.getAllAdapDsPzDsData('E9297854566601'))
    });
});


describe("Unit Tests for findAdapDs", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  it("Find findAdapDs", async () => {
    await adapDsHarnessHelper.findAdapDs('E9297854566601', '001').then(res => {
      expect(res.toJSON()).toEqual({
        id: 5,
        number: 'D92938586520A1',
        createdAt: '2021-10-28T08:46:45.635Z',
        updatedAt: '2021-10-28T08:53:28.541Z',
        adapDesignSolutionNumber: 'E9297854566601',
        adapDesignSolutionVersionNumber: '001'
      });
    })
  });

});

describe("Unit Tests for updatePZRelationWithHarness", () => {

  const adapDsHarnessHelper = new AdapDsHarnessHelper();
  const specifiedPzDsInput: ISpecifiedPzDs[] = [{
    id: "D92999999999QD",
    pzCiId: "D92WxxxxxxxxA1",
    lastModifiedDate: "23/06/2020",
    issue: "B",
    version: "A",
    firstMsn: 12345,
    pzOrigin: [{
      id: "D92410657000A1",
      issue: "___",
    },
    {
      id: "D92411002002A1",
      issue: "___",
    },
    ],
    deltaMp: [{
      added: [
        "MPplus1",
        "MPplus2",
      ],
      removed: [
        "MPminus1",
        "MPminus2",
      ],
    },],
  },]

  it("update PZRelationWithHarness", async () => {
    expect(await adapDsHarnessHelper.updatePZRelationWithHarness(specifiedPzDsInput, 54566601))
  });

});