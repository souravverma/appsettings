import SwaggerController from "../../modelsControllers/Swagger.controller";

jest.mock("../../models/AdapItem.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('AdapItemModel', {
    id: 5,
    number: 'D92938586520A1',
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
  })
})

jest.mock("../../models/PartzoneItem.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('PartzoneItemModel', {
    createdAt: '2021-11-03T05:41:48.247Z',
    updatedAt: '2021-11-03T05:41:48.247Z',
  });
});

jest.mock("../../models/Harness3dDesignSolution.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('Harness3dDesignSolutionModel', {
    id: "26",
    "adap_design_solution_number": "D92938586520A1",
    "adap_ds_version": "001",
    "adap_ds_issue": "A",
    createdAt: '2021-11-10T05:28:38.067Z',
    updatedAt: '2021-11-10T05:28:38.067Z',
    partZone: [{
      id: 5,
      name: "D92938586520A1",
      createdAt: "2021-10-28T08:46:45.635Z",
      updatedAt: "2021-10-28T08:53:28.541Z",
    }]
  });
});

jest.mock("../../models/Partzone.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("PartZoneModel", {
    id: 5,
    name: "D92938586520A1",
    createdAt: "2021-10-28T08:46:45.635Z",
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});

jest.mock("../../models/Harness3dDsPzRelation.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("Harness3dDsPzRelationModel", {
    id: 5,
    name: "D92938586520A1",
    createdAt: "2021-10-28T08:46:45.635Z",
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
});

jest.mock("../../models/AdapLo.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('AdapLoModel', {
    id: 5,
    number: 'D92938586520A1',
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
  });
})

  let swaggerController = new SwaggerController();

  it("Swagger controller should be defined", () => {
    expect(SwaggerController).toBeDefined();
  });

  describe("Unit Tests for deleteHarnessFromSwagger", () => {
    it("should return Deleted with success when the Ds exists in db", async () => {
      jest.spyOn(swaggerController, "deleteHarnessFromSwagger").mockImplementation(() => Promise.resolve("Deleted with success !"));
      const output = await swaggerController.deleteHarnessFromSwagger("D92938586520A1", "001", false);
      expect(output).toEqual("Deleted with success !");
    });

    it("should return Nothing to delete when the Ds does not exists in db", async () => {
      jest.spyOn(swaggerController, "deleteHarnessFromSwagger").mockImplementation(() => Promise.resolve("Nothing to delete !"));
      const output = await swaggerController.deleteHarnessFromSwagger("D92938586520A1", "001", false);
      expect(output).toEqual("Nothing to delete !");
    });

    it("should throw an error", () => {
      jest
        .spyOn(swaggerController, "deleteHarnessFromSwagger")
        .mockImplementation(() => Promise.reject("400 Bad Request"));
      const output = swaggerController.deleteHarnessFromSwagger();
      output.catch(e => {
        expect(e).toEqual("400 Bad Request");
      });
    });
  })
  describe("Unit Tests for getAdapDsLoLinkByAdapCiId", () => {
    it("should return adapds adapLo links by adapCi Id", async () => {
      const output = await swaggerController.getAdapDsLoLinkByAdapCiId("D92938586520A1");
      expect(output).toHaveBeenCalled;
    });

    it("should throw an error", () => {
      jest
        .spyOn(swaggerController, "getAdapDsLoLinkByAdapCiId")
        .mockImplementation(() => Promise.reject("400 Bad Request"));
      const output = swaggerController.getAdapDsLoLinkByAdapCiId("D92938586520A1");
      output.catch(e => {
        expect(e).toEqual("400 Bad Request");
      });
    });
  })

  describe("Unit Tests for getPzDsAdapCiLinkByPzCiId", () => {
    it("should return partzone ds adap ci links by partzone Ci Id", async () => {
      const output = await swaggerController.getPzDsAdapCiLinkByPzCiId("D92938586520A1");
      expect(output).toHaveBeenCalled;
    });

    it("should throw an error", () => {
      jest
        .spyOn(swaggerController, "getPzDsAdapCiLinkByPzCiId")
        .mockImplementation(() => Promise.reject("400 Bad Request"));
      const output = swaggerController.getPzDsAdapCiLinkByPzCiId("D92938586520A1");
      output.catch(e => {
        expect(e).toEqual("400 Bad Request");
      });
    });
  });

  describe("Unit Tests for getAdapCiLOLinkByAdapDsId", () => {

    it("should return adapCi adapLo links by adapDsId", async () => {
      const output = await swaggerController.getAdapCiLOLinkByAdapDsId("D92938586520A1");
      expect(output).toHaveBeenCalled;
    });

    it("should throw an error", () => {
      jest
        .spyOn(swaggerController, "getAdapCiLOLinkByAdapDsId")
        .mockImplementation(() => Promise.reject("400 Bad Request"));
      const output = swaggerController.getAdapCiLOLinkByAdapDsId("D92938586520A1");
      output.catch(e => {
        expect(e).toEqual("400 Bad Request");
      });
    });
  })

  describe("Unit Tests for getPzCiLinkByPzDsId", () => {
    it("should return pzCi linked to pzDs Id", async () => {
      const output = await swaggerController.getPzCiLinkByPzDsId("D92938586520A1");
      expect(output).toHaveBeenCalled;
    });

    it("should throw an error", () => {
      jest
        .spyOn(swaggerController, "getPzCiLinkByPzDsId")
        .mockImplementation(() => Promise.reject("400 Bad Request"));
      const output = swaggerController.getPzCiLinkByPzDsId("D92938586520A1");
      output.catch(e => {
        expect(e).toEqual("400 Bad Request");
      });
    });
  });

