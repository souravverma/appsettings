import CSVForDSComposition from "../../../modelsControllers/Harness/CSVForDSComposition.controller";


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

describe("Unit Tests for generateCSVforAllDSComposition", () => {
    let csvForDSCompositionController = new CSVForDSComposition();

    it("CSVForDSComposition should be defined", () => {
        expect(CSVForDSComposition).toBeDefined();
      });

    it("should return All Ds Composition", async () => {
    const output = await csvForDSCompositionController.generateCSVForDSComposition({adapDesignSolutionNumber:"D9293858652000"},{name:"D92938586520A1"},true);
    expect(output).toHaveBeenCalled;
    })

    it("should return Ds Composition", async () => {
        const output = await csvForDSCompositionController.getDesignSolutionConstitution({adapDesignSolutionNumber:"D9293858652000"});
        expect(output).toHaveBeenCalled;
    })    

    it("should return Ds Composition JSON", async () => {
        const testInput =[{"adap_design_solution_number":"D9299999999900","adap_ds_version":"001","adap_ds_issue":"A","updated_at":"2022-01-24T05:35:17.400Z","partZone.name":"D92911344000L0","partZone.version":"001","partZone.issue":"A","partZone.updated_at":"2022-01-24T05:35:17.520Z","partZone.dataStatus":"frozen"}];
        const testOutput =[{"AdapDs Number":"D9299999999900","AdapDs Version":"001","AdapDs Issue":"A","Ds Modified At":"2022-01-24T05:35:17.400Z","Pz Name":"D92911344000L0","Pz Version":"001","Pz Issue":"A","Pz Modified At":"2022-01-24T05:35:17.520Z","PZ Status":"frozen"}];
        const output =  csvForDSCompositionController.JsonDataGeneratorforexcelreport(testInput);
        expect(output).toEqual(testOutput);
    })

    it("should return empty Array when input data has length less than one", async () => {
        const output =  csvForDSCompositionController.JsonDataGeneratorforexcelreport([]);
        expect(output).toEqual([]);
    })

    it("should return All Ds Composition JSON", async () => {
        const output =  csvForDSCompositionController.generateCSVforAllDSComposition(true);
        expect(output).toHaveBeenCalled;
    })

    it("should return AdapCiLoDsStatus Composition", async () => {
        const output =  csvForDSCompositionController.getAdapCiLoDsStatus();
        expect(output).toHaveBeenCalled;
    })

    it("should return AdapCiLoDsStatus JSON when input data has length greater than one", async () => {
        const testInput = [{"adap_design_solution_number":"D9292345678900","adap_ds_version":"001","adap_ds_issue":"---","ps_synchro_status":"OK","ps_synchro_date":"2021-09-23T04:21:01.076Z","adapLo.number":"E929999999","adapLo.adapItem.id":"E929999999","adapLo.adapItem.number":"E929999999"} ];
        const testOutput = {"adapCiLoDsStatus":[{"AdapDs Number":"D9292345678900","AdapDs Version":"001","AdapDs Issue":"---","Adap Lo":"E929999999","Adap Ci":"E929999999","PS Sync Status":"OK","DS Sync Date":"2021-09-23T04:21:01.076Z"}]}
        const output =  csvForDSCompositionController.JsonDataGeneratorforAdapCiLoDsStatus(testInput);
        expect(output).toEqual(testOutput);
    })

    it("should return empty adapCiLoDsStatus Array when input data has length less than one", async () => {
        const output =  csvForDSCompositionController.JsonDataGeneratorforAdapCiLoDsStatus([]);
        expect(output).toEqual({"adapCiLoDsStatus":[]});
    })

    it("should return Fin Composition", async () => {
        const output =  csvForDSCompositionController.getDesignSolutionConstitutionFin({adapDesignSolutionNumber:"D9293858652000"},{name:"D92938586520A1"});
        expect(output).toHaveBeenCalled;
    })

    it("should return Fin Composition JSON when input data has length greater than one", async () => {
        const testInput =[{ "adap_design_solution_number": "D9299999999900", "adap_ds_version": "001", "adap_ds_issue": "A", "partZone.name": "D92911344000L0", "partZone.version": "001", "partZone.issue": "A", "partZone.b3d.name": "BRA0021", "partZone.b3d.lengthMm": 66.367, "partZone.b3d.lengthForcedMm": 0, "partZone.b3d.notExtractible": false, "partZone.b3d.diameter3dMm": 2, "partZone.b3d.bendRadius": 4, "partZone.b3d.b3dExt.id": 42112, "partZone.b3d.b3dExt.name": "EXT0002", "partZone.b3d.b3dExt.electricalCoordinateX": 2664.884, "partZone.b3d.b3dExt.electricalCoordinateY": -28.297, "partZone.b3d.b3dExt.electricalCoordinateZ": 1910.431, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.id": 124751, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorX": 0.00001, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorY": 1, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorZ": 0.00002, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.branch3dId": 40999, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.branch3dExtr": 42112, "partZone.b3d.b3dExt.finDs.partNumber3d": "NSA936501TA2004", "partZone.b3d.b3dExt.finDs.longPartNumber": "", "partZone.b3d.b3dExt.finDs.mountingPriority": "", "partZone.b3d.b3dExt.finDs.instanceName3d": "201WL", "partZone.b3d.b3dExt.finDs.definitionZone": "110", "partZone.b3d.b3dExt.finDs.FinPzRelations.effectiveRoutes.name": "1M", "partZone.b3d.b3dExt.finDs.FinPzRelations.effectiveRoutes.FinPar": 18 }]
        const testOutput = [{"AdapDs Number":"D9299999999900","AdapDs Version":"001","AdapDs Issue":"A","Pz Name":"D92911344000L0","Pz Version":"001","Pz Issue":"A","B3d Ext":"EXT0002","EffectiveRoute":"1M","Fin":"201WL","Component":"NSA936501TA2004"}]
        const output =  csvForDSCompositionController.jsonDataGeneratorforFin(testInput,{});
        expect(output).toEqual(testOutput);
    })

    it("should return empty Array when input data has length less than one", async () => {
        const output =  csvForDSCompositionController.jsonDataGeneratorforFin([],{});
        expect(output).toEqual([]);
    })

    it("should return Branch Composition", async () => {
        const output =  csvForDSCompositionController.getDesignSolutionConstitutionBranches({adapDesignSolutionNumber:"D9293858652000"},{name:"D92938586520A1"});
        expect(output).toHaveBeenCalled;
    })

    it("should return Branch Composition JSON when input data has length greater than one", async () => {
        const testInput = [{ "adap_design_solution_number": "D9299999999900", "adap_ds_version": "001", "adap_ds_issue": "A", "partZone.name": "D92911344000L0", "partZone.version": "001", "partZone.issue": "A", "partZone.b3d.id": 40965, "partZone.b3d.name": "BRA0001", "partZone.b3d.lengthMm": 30.539, "partZone.b3d.lengthForcedMm": 0, "partZone.b3d.notExtractible": false, "partZone.b3d.diameter3dMm": 8, "partZone.b3d.bendRadius": 54,"partZone.b3d.segments.name":"3M", "partZone.b3d.b3dExt.id": 42128, "partZone.b3d.b3dExt.name": "DER0001", "partZone.b3d.b3dExt.electricalCoordinateX": 150.935, "partZone.b3d.b3dExt.electricalCoordinateY": 1533.273, "partZone.b3d.b3dExt.electricalCoordinateZ": 1110.948, "partZone.b3d.effectiveRoutes.id": 18, "partZone.b3d.effectiveRoutes.name": "1M"}];
        const testOutput = [{"AdapDs Number":"D9299999999900","AdapDs Version":"001","AdapDs Issue":"A","Pz Name":"D92911344000L0","Pz Version":"001","Pz Issue":"A","B3d Name":"BRA0001","B3dExt Name":"DER0001","Route":"1M","Length Mm":30.539,"LengthForced Mm":0,"Segments Name":"3M"}]
        const output =  csvForDSCompositionController.jsonDataGeneratorforBranches(testInput,{});
        expect(output).toEqual(testOutput);
    })

    it("should return empty Array when input data has length less than one", async () => {
        const output =  csvForDSCompositionController.jsonDataGeneratorforBranches([],{});
        expect(output).toEqual([]);
    })

    it("should return Marker Sleeve Lta Composition", async () => {
        const output =  csvForDSCompositionController.getDesignSolutionConstitutionMarkerSleeveLta({adapDesignSolutionNumber:"D9293858652000"},{name:"D92938586520A1"});
        expect(output).toHaveBeenCalled;
    })

    it("should return Marker Sleeve Lta Composition JSON when input data has length greater than one", async () => {
        const testInput =[{ "adap_design_solution_number": "D9299999999900", "adap_ds_version": "001", "adap_ds_issue": "A", "partZone.id": 2623, "partZone.name": "D92911344000L0", "partZone.version": "001", "partZone.issue": "A", "partZone.b3d.id": 40965, "partZone.b3d.name": "BRA0001", "partZone.b3d.lengthMm": 30.539, "partZone.b3d.lengthForcedMm": 0, "partZone.b3d.diameter3dMm": 8, "partZone.b3d.b3dExt.name": "DER0001", "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorX": -0.99932, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorY": -0.02848, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorZ": -0.02335, "partZone.b3d.cvrgElem.id": 23056, "partZone.b3d.cvrgElem.name": "BRA0001-EN6049-006-----.3", "partZone.b3d.cvrgElem.lengthMm": 200, "partZone.b3d.cvrgElem.Branch3dCoveringElementSolutionRelationMo": 23056, "partZone.b3d.cvrgElem.component.partNumber": "EN6049-006-----", "partZone.b3d.cvrgElem.b3dExt.id": 72626, "partZone.b3d.cvrgElem.b3dExt.lengthMm": 0, "partZone.b3d.cvrgElem.cvrgElemType.name": "SLEEVE" }, { "adap_design_solution_number": "D9299999999900", "adap_ds_version": "001", "adap_ds_issue": "A", "partZone.id": 2623, "partZone.name": "D92911344000L0", "partZone.version": "001", "partZone.issue": "A", "partZone.b3d.id": 40965, "partZone.b3d.name": "BRA0001", "partZone.b3d.lengthMm": 30.539, "partZone.b3d.lengthForcedMm": 0, "partZone.b3d.diameter3dMm": 8, "partZone.b3d.b3dExt.name": "DER0001", "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorX": -0.99932, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorY": -0.02848, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorZ": -0.02335, "partZone.b3d.cvrgElem.id": 23056, "partZone.b3d.cvrgElem.name": "BRA0001-EN6049-006-----.3", "partZone.b3d.cvrgElem.lengthMm": 200, "partZone.b3d.cvrgElem.Branch3dCoveringElementSolutionRelationMo": 23056, "partZone.b3d.cvrgElem.component.partNumber": "EN6049-006-----", "partZone.b3d.cvrgElem.b3dExt.id": 72626, "partZone.b3d.cvrgElem.b3dExt.lengthMm": 0, "partZone.b3d.cvrgElem.cvrgElemType.name": "LACING_TAPE" }, { "adap_design_solution_number": "D9299999999900", "adap_ds_version": "001", "adap_ds_issue": "A", "partZone.id": 2623, "partZone.name": "D92911344000L0", "partZone.version": "001", "partZone.issue": "A", "partZone.b3d.id": 40965, "partZone.b3d.name": "BRA0001", "partZone.b3d.lengthMm": 30.539, "partZone.b3d.lengthForcedMm": 0, "partZone.b3d.diameter3dMm": 8, "partZone.b3d.b3dExt.name": "DER0001", "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorX": -0.99932, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorY": -0.02848, "partZone.b3d.b3dExt.Branch3dExtremityRelationModel.vectorZ": -0.02335, "partZone.b3d.cvrgElem.id": 23056, "partZone.b3d.cvrgElem.name": "BRA0001-EN6049-006-----.3", "partZone.b3d.cvrgElem.lengthMm": 200, "partZone.b3d.cvrgElem.Branch3dCoveringElementSolutionRelationMo": 23056, "partZone.b3d.cvrgElem.component.partNumber": "EN6049-006-----", "partZone.b3d.cvrgElem.b3dExt.id": 72626, "partZone.b3d.cvrgElem.b3dExt.lengthMm": 0, "partZone.b3d.cvrgElem.cvrgElemType.name": "MARKER" } ];
        const testOutput = { lta: [{ "AdapDs Issue": "A", "AdapDs Number": "D9299999999900", "AdapDs Version": "001", "Branch": "BRA0001", "Component": "EN6049-006-----", "Ext of branch": "DER0001", "LTA Length": 200, "LTA to EXT/DER length": 0, "Lta Id": "BRA0001-EN6049-006-----.3", "Pz Issue": "A", "Pz Name": "D92911344000L0", "Pz Version": "001", }, ], marker: [{ "AdapDs Issue": "A", "AdapDs Number": "D9299999999900", "AdapDs Version": "001", "Branch Id": "BRA0001", "Component": "EN6049-006-----", "Marker Id": "BRA0001-EN6049-006-----.3", "Pz Issue": "A", "Pz Name": "D92911344000L0", "Pz Version": "001", }, ],sleeve: [{ 'AdapDs Number': 'D9299999999900', 'AdapDs Version': '001', 'AdapDs Issue': 'A', 'Pz Name': 'D92911344000L0', 'Pz Version': '001', 'Pz Issue': 'A', 'Sleeve Id': 'BRA0001-EN6049-006-----.3', 'Length Sleeve': 200, 'ext of branch': 'DER0001', 'Component': 'EN6049-006-----', 'branch to sleeve ext length': 0 }] }
        const output =  csvForDSCompositionController.jsonDataGeneratorforMarkersSleeveLta(testInput,{});
        expect(output).toEqual(testOutput);
    })

    it("should return Marker Sleeve Lta Composition empty JSON when input data has length less than one", async () => {
        const output =  csvForDSCompositionController.jsonDataGeneratorforMarkersSleeveLta([],{});
        expect(output).toEqual( { lta: [],marker:[],sleeve:[]});
    })

    it("should return Ds Auto Composition", async () => {
        const output =  csvForDSCompositionController.generateCSVforDSautoForHarness({adapDesignSolutionNumber:"D9293858652000"});
        expect(output).toHaveBeenCalled;
    })


})