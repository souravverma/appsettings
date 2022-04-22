import 'reflect-metadata';
import {
    container
} from "tsyringe";
import Branch3dExtremityTypeModel from '../../../models/Branch3dExtremityType.model';
import Branch3dExtremityTypeController from "../../../modelsControllers/Branch/BranchExtremityType.controller";


jest.mock("../../../models/Branch3dExtremityType.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('Branch3dExtremityTypeModel', {
        id: "26",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

describe("Unit Tests for findAll", () => {
    let branch3dExtremityTypeController: Branch3dExtremityTypeController;

    beforeEach(() => {
        branch3dExtremityTypeController = container.resolve(Branch3dExtremityTypeController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Should return Branch3dExtremityTypeModel", async () => {
        await branch3dExtremityTypeController.findAll().then(res => {
            expect(res[0].toJSON()).toEqual({
                id: '26',
                createdAt: '2021-11-10T05:28:38.067Z',
                updatedAt: '2021-11-10T05:28:38.067Z'
              })
        })
    });

    it("Should return Error", async () => {
        jest
            .spyOn(Branch3dExtremityTypeModel, "findAll")
            .mockImplementation(() => Promise.reject("Error"))
        await branch3dExtremityTypeController.findAll().catch(error => {
            expect(error).toBe("Error")
        })
    })

})