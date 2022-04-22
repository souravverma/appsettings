import 'reflect-metadata';
import ManageMpRelation from "../../modelsControllers/SynchronizeAPS/modificationProposal/ManageMpRelation";
import { container } from "tsyringe";


jest.mock("../../models/Partzone.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('PartZoneModel', {
        id: 2851,
        name: "D92999999999QD",
        version: "001",
        issue: "B",
        pzType: null,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        dataStatus: "waiting_data",
        consolidationStatus: "N/A",
        consolidationMessage: "Route continuity check not applicable!",
        releaseStatus: null,
        createdAt: "2021-11-03T05:41:48.247Z",
        updatedAt: "2021-11-03T05:41:48.247Z",
    });
});

jest.mock("../../models/ModificationProposalPzSolutionRelation", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('ModificationProposalPzSolutionRelationModel', {
        id: 2851,
        name: "D92999999999QD",
        version: "001",
        issue: "B",
        pzType: null,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        dataStatus: "waiting_data",
        consolidationStatus: "N/A",
        consolidationMessage: "Route continuity check not applicable!",
        releaseStatus: null,
        createdAt: "2021-11-03T05:41:48.247Z",
        updatedAt: "2021-11-03T05:41:48.247Z",
    });
});

jest.mock("../../models/ModificationProposal.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('ModificationProposalModel', {
        createdAt: '2021-11-03T05:41:48.247Z',
        updatedAt: '2021-11-03T05:41:48.247Z',
    });
});
jest.mock("../../models/AircraftProgram.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('AircraftProgramModel', {
        createdAt: '2021-11-03T05:41:48.247Z',
        updatedAt: '2021-11-03T05:41:48.247Z',
    });
});
describe("Unit Tests for ManageMpRelation", () => {
    let manageMpRelation :ManageMpRelation;
    
    beforeEach( () => {
        manageMpRelation = new ManageMpRelation();
    });   

    it("ManageMpRelation should be defined", () => {
        expect(manageMpRelation).toBeDefined();
    });
});

describe("Unit Tests for findOnePz", () => {
    let manageMpRelation :ManageMpRelation;
    
    beforeEach( () => {
        manageMpRelation = container.resolve( ManageMpRelation);
    });   

    it("Should return PartZoneModel", async () => {
        await manageMpRelation.findOnePz({
            name: "D92999999999QD"
        }).then(findOnePzOutput => {
            expect(findOnePzOutput.toJSON()).toEqual({
                id: 2851,
                name: "D92999999999QD",
                version: "001",
                issue: "B",
                pzType: null,
                createdBy: "ce-api-harness",
                updatedBy: "ce-api-harness",
                dataStatus: "waiting_data",
                consolidationStatus: "N/A",
                consolidationMessage: "Route continuity check not applicable!",
                releaseStatus: null,
                createdAt: "2021-11-03T05:41:48.247Z",
                updatedAt: "2021-11-03T05:41:48.247Z",
            });
        });
    });
});

describe("Unit Tests for reStructureMpArray", () => {
    let manageMpRelation :ManageMpRelation;
    
    beforeEach( () => {
        manageMpRelation = container.resolve( ManageMpRelation);
    });   
    const specifiedDsInput = [{
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
        }, ],
    }];

    it("Should return Non Empty Array", () => {
        const reStructureMpArrayOutput = manageMpRelation.reStructureMpArray(specifiedDsInput[0].deltaMp);
        expect(reStructureMpArrayOutput).toEqual([{
                type: 'added',
                name: 'MPplus1'
            },
            {
                type: 'added',
                name: 'MPplus2'
            },
            {
                type: 'removed',
                name: 'MPminus1'
            },
            {
                type: 'removed',
                name: 'MPminus2'
            }
        ]);
    });
});

describe("Unit Tests for reStructureMpArray", () => {
    let manageMpRelation :ManageMpRelation;
    
    beforeEach( () => {
        manageMpRelation = container.resolve( ManageMpRelation);
    });   

    const specifiedDsInput = [{
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
        }, ],
    }];

    it("Should return Non Empty Array", () => {
        const reStructureMpArrayOutput = manageMpRelation.reStructureMpArray(specifiedDsInput[0].deltaMp);
        expect(reStructureMpArrayOutput).toEqual([{
                type: 'added',
                name: 'MPplus1'
            },
            {
                type: 'added',
                name: 'MPplus2'
            },
            {
                type: 'removed',
                name: 'MPminus1'
            },
            {
                type: 'removed',
                name: 'MPminus2'
            }
        ]);
    });
});


describe("Unit Tests for createOrUpdate", () => {
    let manageMpRelation :ManageMpRelation;
    
    beforeEach( () => {
        manageMpRelation = container.resolve( ManageMpRelation);
    });   

    const specifiedDsInput = [{
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
        }, ],
    }];

    it("Should return Non Empty Object", async () => {
        
        await manageMpRelation.createOrUpdate(specifiedDsInput[0].deltaMp, "D92999999999QD").then(
            (createOrUpdateOutput) => {
              expect(createOrUpdateOutput[0].toJSON()).toEqual({
                id: 2851,
                name: 'D92999999999QD',
                version: '001',
                issue: 'B',
                pzType: null,
                createdBy: 'ce-api-harness',
                updatedBy: 'ce-api-harness',
                dataStatus: 'waiting_data',
                consolidationStatus: 'N/A',
                consolidationMessage: 'Route continuity check not applicable!',
                releaseStatus: null,
                createdAt: '2021-11-03T05:41:48.247Z',
                updatedAt: '2021-11-03T05:41:48.247Z',
                mpDeltaId: 5,
                partzone: 2851,
                mpDelta: 'added'
              })
            }
        );
    });

    it("Should return undefined", async () => {
        jest
        .spyOn(manageMpRelation, "reStructureMpArray")
        .mockImplementation(() => [null]);
        await manageMpRelation.createOrUpdate(specifiedDsInput[0].deltaMp, "D92999999999QD").then(
            (createOrUpdateOutput) => {
              expect(createOrUpdateOutput).toEqual( [ undefined ])
            }
        );
    });

    it("Should return error", async () => { 
        await manageMpRelation.createOrUpdate(null, "D92999999999QD").catch(
            (error) => {
              expect(error).toEqual(error)
            }
        );
    });
});


describe("Unit Tests for extractSpecificDs", () => {
    let manageMpRelation :ManageMpRelation;
    
    beforeEach( () => {
        manageMpRelation = container.resolve( ManageMpRelation);
    })
    const specifiedDsInput = [{
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
        }, ],
    }];

    it("Should return specific Ds", async () => {
        await manageMpRelation.extractSpecificDs(specifiedDsInput).then(extractSpecificDsOutput => {
            console.log(extractSpecificDsOutput, "extractSpecificDsOutput")
        });
    });

    it("Should return undifined", async () => {
        await manageMpRelation.extractSpecificDs([null]).then(extractSpecificDsOutput => {
            expect(extractSpecificDsOutput).toEqual( [ undefined ])
        });
    });

    it("Should return error", async () => { 
        jest
        .spyOn(manageMpRelation, "createOrUpdate")
        .mockImplementation(() => Promise.reject("Error"));
        await manageMpRelation.extractSpecificDs(specifiedDsInput).catch(
            (error) => {
              expect(error).toEqual("Error")
            }
        );
    });
});