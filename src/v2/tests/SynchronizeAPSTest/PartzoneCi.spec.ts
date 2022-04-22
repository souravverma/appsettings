import 'reflect-metadata';
import PartzoneCi from "../../modelsControllers/SynchronizeAPS/AdapCipzCi/PartzoneCi";
import {
    container
} from "tsyringe";
import AdapItemModel from '../../models/AdapItem.model';
import PartzoneItemModel from '../../models/PartzoneItem.model';
import {
    IAdapCi
} from '../../modelsControllers/SynchronizeAPS/AdapCipzCi/interface/AdapPzCi.interface';
import UserAreaController from '../../modelsControllers/UserArea.controller';

jest.mock("../../models/PartzoneItem.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('PartzoneItemModel', {
        createdAt: '2021-11-03T05:41:48.247Z',
        updatedAt: '2021-11-03T05:41:48.247Z',
    });
});

jest.mock("../../models/UserAreaPartZone.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('UserAreaModel', {
        createdAt: '2021-11-03T05:41:48.247Z',
        updatedAt: '2021-11-03T05:41:48.247Z',
    });
});

describe("Unit Tests for findOne", () => {
    let partzoneCi: PartzoneCi;

    beforeEach(() => {
        partzoneCi = container.resolve(PartzoneCi);
    });

    it("Should return PartzoneItemModel", async () => {
        await partzoneCi.findOne({
            number: 'D92WxxxxxxxxA1'
        }).then(res => {
            expect(res.toJSON()).toEqual({
                createdAt: '2021-11-03T05:41:48.247Z',
                updatedAt: '2021-11-03T05:41:48.247Z',
                number: 'D92WxxxxxxxxA1',
                id: 1
            });
        });
    });
});

describe("Unit Tests for createOrUpdate", () => {
    let partzoneCi: PartzoneCi;
    const userAreaController: UserAreaController = new UserAreaController();


    beforeEach(() => {
        partzoneCi = container.resolve(PartzoneCi);
    });

    afterEach(() => {
        // jest.clearAllMocks();
    })

    it("Should return PartzoneItemModel", async () => {
        await partzoneCi.createOrUpdate([{
            pz_ci_id: '2021'
        }]).then(res => {
            expect(res[0].toJSON()).toEqual({
                createdAt: '2021-11-03T05:41:48.247Z',
                updatedAt: '2021-11-03T05:41:48.247Z',
                number: '2021',
                id: 2
            });
        });
    });

    it("Should return PartzoneItemModel1", async () => {
        jest
            .spyOn(partzoneCi, 'findOne')
            .mockImplementation(() => Promise.resolve(null))

        jest
            .spyOn(PartzoneItemModel, 'create')
            .mockImplementation(() => Promise.resolve(null))

        jest
            .spyOn(userAreaController, "updateRelationForPzItemUserarea")
            .mockImplementation(null)

        await partzoneCi.createOrUpdate([{
            pz_ci_id: '2021'
        }]).then(res => {
            expect(res).toEqual([ null ] );
        });
    });
});



describe("Unit Tests for createOrUpdate", () => {
    let partzoneCi: PartzoneCi;

    beforeEach(() => {
        jest.clearAllMocks();
        partzoneCi = container.resolve(PartzoneCi);
    });

    it("Should return Error", async () => {
        jest
            .spyOn(partzoneCi, 'findOne')
            .mockImplementation(() => Promise.reject("Error"))


        await partzoneCi.createOrUpdate([{
            pz_ci_id: '2021'
        }]).catch(error => {
            expect(error).toEqual("Error")
        });
    });
});
