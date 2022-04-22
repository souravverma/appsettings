import 'reflect-metadata';
import ManageMpRelation from "../../modelsControllers/SynchronizeAPS/modificationProposal/ManageMpRelation";
import ModificationProposal from "../../modelsControllers/SynchronizeAPS/modificationProposal/ModificationProposal";
import { container } from "tsyringe";

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


describe("Unit Tests for createOrFetchMdProposal", () => {
    let  modificationProposal :ModificationProposal;
    
    beforeEach( () => {
        modificationProposal = container.resolve( ModificationProposal);
    });   

    it("Should return createOrFetchMdProposal", async () => {
       await modificationProposal.createOrFetchMdProposal("MPplus1").then(res => {
           expect(res.toJSON()).toEqual({
            createdAt: '2021-11-03T05:41:48.247Z',
            updatedAt: '2021-11-03T05:41:48.247Z',
            name: 'MPplus1',
            id: 2
          })
       });

    });
});

describe("Unit Tests for createOrFetchMdProposal", () => {
    let  modificationProposal :ModificationProposal;
    
    beforeEach( () => {
        jest.clearAllMocks();
        modificationProposal = container.resolve( ModificationProposal);
    });   

    it("Should return ModificationProposalModel", async () => {
        jest.spyOn(modificationProposal , "findOne")
            .mockImplementation(() => null)

        await modificationProposal.createOrFetchMdProposal("MPplus1").catch(error => {
            expect(error).toEqual("Error")
       });
    });
});

describe("Unit Tests for createOrFetchMdProposal", () => {
    let  modificationProposal :ModificationProposal;
    
    beforeEach( () => {
        jest.clearAllMocks();
        modificationProposal = container.resolve( ModificationProposal);
    });   

    it("Should return error", async () => {
        jest.spyOn(modificationProposal , "findOne")
            .mockImplementation(() => Promise.reject("Error"))

        await modificationProposal.createOrFetchMdProposal("MPplus1").catch(error => {
            expect(error).toEqual("Error")
       });
    });
});