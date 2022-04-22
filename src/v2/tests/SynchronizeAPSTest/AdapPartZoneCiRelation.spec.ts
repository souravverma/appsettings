import 'reflect-metadata';
import AdapPartzoneCIRelation from "../../modelsControllers/SynchronizeAPS/AdapCipzCi/AdapPartzoneCiRelation";
import {
    container
} from "tsyringe";

jest.mock("../../models/AdapItem.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('AdapItemModel', {
        createdAt: '2021-11-03T05:41:48.247Z',
        updatedAt: '2021-11-03T05:41:48.247Z',
        id: 1
    });
});
jest.mock("../../models/PartzoneItem.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('PartzoneItemModel', {
        createdAt: '2021-11-03T05:41:48.247Z',
        updatedAt: '2021-11-03T05:41:48.247Z',
    });
});

describe("Unit Tests for AdapPartzoneCIRelation", () => {
    let adapPartzoneCIRelation: AdapPartzoneCIRelation;

    beforeEach(() => {
        adapPartzoneCIRelation = container.resolve(AdapPartzoneCIRelation);
    });

    it("Should return adapPartzoneCIRelation", async () => {
        let deleteNonAssociatedPzCiInput = [{
            "id": "22",
            "number": "D92Wxxxxxxxxxx",
            "createdBy": "ce-api-harness",
            "updatedBy": "ce-api-harness",
            "pzItem": [{
                    "id": "26",
                    "number": "D92WxxxxxxxxA1",
                    "createdBy": "ce-api-harness",
                    "updatedBy": "ce-api-harness",
                    "fk_part_zone_solution_id": 2851,
                    "fk_user_area_id": 52,
                    "AdapItemPartzoneItemRelationModel": {
                        "id": "111",
                        "pzItemId": 26,
                        "adapItemId": 22
                    }
                },
                {
                    "id": "27",
                    "number": "D92WxxxxxxxxA2",
                    "createdBy": "ce-api-harness",
                    "updatedBy": "ce-api-harness",
                    "fk_part_zone_solution_id": null,
                    "fk_user_area_id": 54,
                    "AdapItemPartzoneItemRelationModel": {
                        "id": "112",
                        "pzItemId": 27,
                        "adapItemId": 22
                    }
                }
            ]
        }]

        await adapPartzoneCIRelation.getPzCisRelation(deleteNonAssociatedPzCiInput).then(res => {
            expect(res.toJSON()).toEqual({
                "createdAt": "2021-11-03T05:41:48.247Z",
                "id": 1,
                "number": "22",
                "updatedAt": "2021-11-03T05:41:48.247Z"
            })
        });
    });
});
