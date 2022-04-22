import "reflect-metadata"
import CreationController from "../../../controllers/Creation.controller";
import HarnessDictionaryService from "../../../services/HarnessDictionnary.service";
import HarnessConsistencyController from "../HarnessConsistency.controller";
import HarnessHelper from "../HarnessHelper.controller";

jest.mock("../../../models/Harness3dDesignSolution.model", () => {
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
const harnessDictionary: HarnessDictionaryService =
        new HarnessDictionaryService();
harnessDictionary.addEntry({
    adapDesignSolutionNumber: "D92938586520A1",
    adapDesignSolutionVersionNumber: "001",
    adapDesignSolutionIssueNumber: "A",
    dataStatus: "Temp",
  });

  describe("Unit Tests for performConsistencyCheck", () => {
    let harnessHelper = new HarnessHelper;
    let harnessConsistencyController = new HarnessConsistencyController;
    let creationController = new CreationController(harnessHelper, harnessConsistencyController);
    
    jest.spyOn(harnessHelper, "updateHarnessStatusAndVersion").mockImplementation(() => Promise.resolve());
    jest.spyOn(harnessConsistencyController, "harnessConsistencyCheck").mockImplementation(() => Promise.resolve());
    

    it("performConsistencyCheck should be called when changePsSynchroStatusFlag is false", async () => {
        const changePsSynchroStatusFlag: boolean = false;
        const result = await creationController.performConsistencyCheck(changePsSynchroStatusFlag, harnessDictionary);
        expect(result).toBeUndefined();
      });

      it("performConsistencyCheck should be called when changePsSynchroStatusFlag is true", async () => {
        const changePsSynchroStatusFlag: boolean = true;
        const result = await creationController.performConsistencyCheck(changePsSynchroStatusFlag, harnessDictionary);
        expect(result).toBeUndefined();
      });
    })