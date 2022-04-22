import { IHarness3dDesignSolution } from "../../../interfaces/mapping.interface";
import HarnessHelper from "../../../modelsControllers/Harness/HarnessHelper.controller"
import * as GlobalEnums from "../../../ConfigurationFiles/GlobalEnums";

jest.mock("../../../models/Harness3dDesignSolution.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('Harness3dDesignSolutionModel', {
        id: "26",
        "adap_design_solution_number": "D92938586520A1",
        "adap_ds_version": "001",
        "adap_ds_issue": "A",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

jest.mock("../../../models/FunctionalItem.model", () => {
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

jest.mock("../../../models/AdapItem.model", () => {
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
});

jest.mock("../../../models/AdapLo.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('AdapLoModel', {
        id: 5,
        number: 'D92938586520A1',
        createdAt: '2021-10-28T08:46:45.635Z',
        updatedAt: "2021-10-28T08:53:28.541Z",
        fk_harness_3d_ds_id: 2
    });
});

it("HarnessHelper should be defined", () => {
    expect(HarnessHelper).toBeDefined();
  });

describe("Unit Tests for getHarnessByAdapCi", () => {
    let harnessHelper = new HarnessHelper();
    it("should return harness data for given adap ci", async () => {
        const output = harnessHelper.getHarnessByAdapCi({ number: "D9293858652000" });
        expect(output).toHaveBeenCalled;
    })

    it("should throw an error", async () => {
        jest
            .spyOn(harnessHelper, "getHarnessByAdapCi")
            .mockImplementation(() => Promise.reject("400 Bad Request"));
        const adapLoControllerOuput = harnessHelper.getHarnessByAdapCi({ number: "D9293858652000" });
        adapLoControllerOuput.catch(e => {
            expect(e).toEqual("400 Bad Request");
        });
    });
});

describe("Unit Tests for setVUVBValues", () => {
    let harnessHelper = new HarnessHelper();
    const harnessData:any[]= [{ "id": 922, "adapDesignSolutionNumber": "E9297856800000", "adapDesignSolutionVersionNumber": "001", "adapDesignSolutionIssueNumber": "T", "caccDsNumber": "D92979999000", "caccDsSolution": "001", "dataStatus": "temporary", "consolidationStatus": "KO", "consolidationMsg": "harness not consolidated !", "createdBy": "ce-api-harness", "updatedBy": "ce-api-harness", "psSynchroStatus": "OK","createdAt": "2021-10-28T11:25:19.590Z", "updatedAt": "2021-10-28T11:25:20.979Z", "fk_major_component_assembly_id": 1, "fin": [{ "sequence_number": "9999", "circuit": { id:1,"letters": "VB" }, "FunctionalItemHarness3dDesignSolutionRelationModel": { "id": 17660, "harness3": 922, "function": "3091" } },{ "sequence_number": "9999", "circuit": { id:1,"letters": null }, "FunctionalItemHarness3dDesignSolutionRelationModel": { "id": 17660, "harness3": 922, "function": "3091" } }]}];
    const testOutput=[{ "id": 922, "adapDesignSolutionNumber": "E9297856800000", "adapDesignSolutionVersionNumber": "001", "adapDesignSolutionIssueNumber": "T", "caccDsNumber": "D92979999000", "caccDsSolution": "001", "dataStatus": "temporary", "consolidationStatus": "KO", "consolidationMsg": "harness not consolidated !", "createdBy": "ce-api-harness", "updatedBy": "ce-api-harness", "psSynchroStatus": "OK","createdAt": "2021-10-28T11:25:19.590Z", "updatedAt": "2021-10-28T11:25:20.979Z", "fk_major_component_assembly_id": 1, "fin": [{ "sequence_number": "9999", "circuit": { id:1,"letters": "VB" }, "FunctionalItemHarness3dDesignSolutionRelationModel": { "id": 17660, "harness3": 922, "function": "3091" } }] }];
    it("should return vuvb values which circuit and sequence are not null", async () => {
        const output = harnessHelper.setVUVBValues(harnessData);
        expect(output).toStrictEqual(testOutput);
    });
});

describe("Unit Tests for Harness3dDesignSolution Class", () => {
    let harnessHelper = new HarnessHelper();
    it("should set the dataType to 2D and update status for 2D DesignSolution", () => {
        let designSolution = {
          adapDesignSolutionNumber: "E9292111111111",
          dataStatus: "",
          dataType: "",
        } as any as IHarness3dDesignSolution;
    
        harnessHelper.update2D3DDataForHarness(designSolution);
        expect(designSolution.dataStatus).toBe(GlobalEnums.DataStatusEnum.TEMPORARY);
        expect(designSolution.dataType).toBe("2D");
    
        designSolution = {
          adapDesignSolutionNumber: "E92S2111111111",
          dataStatus: "",
          dataType: "",
        } as any as IHarness3dDesignSolution;
    
        harnessHelper.update2D3DDataForHarness(designSolution);
        expect(designSolution.dataStatus).toBe(GlobalEnums.DataStatusEnum.TEMPORARY);
        expect(designSolution.dataType).toBe("2D");
    
        designSolution = {
          adapDesignSolutionNumber: "D9202111111111",
          dataStatus: "",
          dataType: "",
        } as any as IHarness3dDesignSolution;
    
        harnessHelper.update2D3DDataForHarness(designSolution);
        expect(designSolution.dataStatus).toBe(GlobalEnums.DataStatusEnum.TEMPORARY);
        expect(designSolution.dataType).toBe("2D");
      });
    
      it("should set the dataType to 3D for 3D DesignSolution", () => {
        let designSolution = {
          adapDesignSolutionNumber: "E9293111111111",
          dataStatus: "",
          dataType: "",
        } as any as IHarness3dDesignSolution;
    
        harnessHelper.update2D3DDataForHarness(designSolution);
        expect(designSolution.dataStatus).toBe("");
        expect(designSolution.dataType).toBe("3D");
    
        designSolution = {
          adapDesignSolutionNumber: "E9212111111111",
          dataStatus: "",
          dataType: "",
        } as any as IHarness3dDesignSolution;
    
        harnessHelper.update2D3DDataForHarness(designSolution);
        expect(designSolution.dataStatus).toBe("");
        expect(designSolution.dataType).toBe("3D");
    
        designSolution = {
          adapDesignSolutionNumber: "A92S2111111111",
          dataStatus: "",
          dataType: "",
        } as any as IHarness3dDesignSolution;
    
        harnessHelper.update2D3DDataForHarness(designSolution);
        expect(designSolution.dataStatus).toBe("");
        expect(designSolution.dataType).toBe("3D");
      });
  });