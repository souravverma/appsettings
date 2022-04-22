import 'reflect-metadata';
import {
    container
} from "tsyringe";
import CoveringElement3dModel from '../../../models/CoveringElement3d.model';
import DeleteCoveringElements from "../../../modelsControllers/Branch/DeleteCoveringElements.controller";
import {
    IWhereClause,
    ICoveringElement3d,
  } from "../../../interfaces/mapping.interface";

jest.mock("../../../models/CoveringElement3d.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('CoveringElement3dModel', {
        id: "26",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

jest.mock("../../../models/Branch3d.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('Branch3dModel', {
        id: "26",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

jest.mock("../../../models/Partzone.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('PartZoneModel', {
        id: "26",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

describe("Unit Tests for findExistingCoveringElementData", () => {
    let deleteCoveringElements: DeleteCoveringElements;

    beforeEach(() => {
        deleteCoveringElements = container.resolve(DeleteCoveringElements);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Should return CoveringElement3dModel", async () => {
        await deleteCoveringElements.findExistingCoveringElementData(
            "BRA0001", {
                harness3dDesignSolution: {
                    adapDesignSolutionNumber: 'D9291134322300',
                    adapDesignSolutionVersionNumber: '001',
                    adapDesignSolutionIssueNumber: '---'
                },
                partZone: {
                    name: 'D92911343223A9'
                }
            },
        ).then(res => {
            expect(res[0].toJSON()).toEqual({
                id: '26',
                createdAt: '2021-11-10T05:28:38.067Z',
                updatedAt: '2021-11-10T05:28:38.067Z'
            })
        })
    });

    it("Should return Error", async () => {
        jest
            .spyOn(CoveringElement3dModel, "findAll")
            .mockImplementation(() => Promise.reject("Error"));

        await deleteCoveringElements.findExistingCoveringElementData(
            "BRA0001", {
                partZone: 123,
                harness3dDesignSolution: 'A1234924'
            },
        ).catch(error => {
            expect(error).toBe("Error");
        });
    });
});

