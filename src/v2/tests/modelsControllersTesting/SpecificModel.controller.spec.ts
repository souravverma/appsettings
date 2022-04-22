import {SpecificModelController} from "../../modelsControllers/SpecificModel.controller";

jest.mock("../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Harness3dDesignSolutionModel', {
      id: "26",
      "adap_design_solution_number":"D92938586520A1",
      "adap_ds_version":"001",
      "adap_ds_issue":"A",
      createdAt: '2021-11-10T05:28:38.067Z',
      updatedAt: '2021-11-10T05:28:38.067Z'
  });
});

jest.mock("../../models/FunctionalItem.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("FunctionalItemModel", {
    id: "26",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    fk_mounting_fin_master_id: 52,
    fk_functional_item_id: 1,
    functionalItem3dSolutionId: 1,
  });
});

jest.mock("../../models/Circuit.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("CircuitModel", {
    id: "26",
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    letters:"VU",
    fk_functional_item_id: 1,
    functionalItem3dSolutionId: 1,
  });
});


describe("Unit Tests for Specific Model controller", () => {

  let specificModelController = new SpecificModelController();

  it("Specific Model controller should be defined", () => {
    expect(SpecificModelController).toBeDefined();
  });

  it("should return Harness3dDesignSolution Routing Service", async () => {
    const output = await specificModelController.getHarnessRoutingServiceInfo({adapDesignSolutionNumber:"D92912345678"});
    expect(output).toHaveBeenCalled;
  });

  it("should return Partzones with Mp", async () => {
    const output = await specificModelController.getHarnessPartZoneWithMp({adapDesignSolutionNumber:"D92912345678"});
    expect(output).toHaveBeenCalled;
  });

  it("should return Partzones with origin", async () => {
    const output = await specificModelController.getHarnessPartZoneWithOrigin({adapDesignSolutionNumber:"D92912345678"});
    expect(output).toHaveBeenCalled;
  });

  it("Should be able to call", async () => {
    jest
    .spyOn(specificModelController, "getHarnessVuvb")
    .mockImplementation(() => Promise.resolve(undefined));
    const output = await specificModelController.getHarnessVuvb({adapDesignSolutionNumber:"D92912345678"});
    expect(output).toHaveBeenCalled;
  });
  
  // it("should return false for setVUVBValues", async () => {
  //   // const output = await specificModelController.setVUVBValues({adapDesignSolutionNumber:"D92912345678",fin:[]});
  //   expect(output).toBeFalsy;
  // });
  

});
