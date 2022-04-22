import FunctionalItemSolutionPartZoneRelation from "../../../models/FunctionalItem3dSolutionPartZoneRelation.model";
import FunctionalItemSolutionPartZoneRelationController from "../../../modelsControllers/FunctionalItem/FunctionalItemSolutionPartZoneRelation.controller";
jest.mock("../../../models/FunctionalItem3dSolutionPartZoneRelation.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('FunctionalItemSolutionPartZoneRelation', {
        id: '26',
        updated_at: '2021-11-10T05:28:38.067Z',
        partZoneId: 23,
        createdAt: '2021-11-12T07:14:56.403Z',
        updatedAt: '2021-11-12T07:14:56.403Z'
    });
});

describe("Unit Tests for FunctionalItemSolutionPartZoneRelation", () => {
    const FunctionalItem = new FunctionalItemSolutionPartZoneRelationController();
    afterEach(() => {
        jest.clearAllMocks();
    })
    it("Should return FunctionalItemSolutionPartZoneRelation Model", async () => {
        await FunctionalItem.findOne({
            partZoneId: 23
        }).then(res => {
            expect(res.toJSON()).toEqual({
                id: '26',
                updated_at: '2021-11-10T05:28:38.067Z',
                partZoneId: 23,
                createdAt: '2021-11-12T07:14:56.403Z',
                updatedAt: '2021-11-12T07:14:56.403Z'
            });
        });
    });

    it("Should return Error", async () => {
        jest
            .spyOn(FunctionalItemSolutionPartZoneRelation, "findOne")
            .mockImplementation(() => Promise.reject("Error"));
        await FunctionalItem.findOne({
            partZoneId: 23
        }).catch(error => {
            expect(error).toEqual("Error")
        })

    });
})