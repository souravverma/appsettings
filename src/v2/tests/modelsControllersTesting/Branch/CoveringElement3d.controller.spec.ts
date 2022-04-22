import 'reflect-metadata';
import {
    container
} from "tsyringe";
import CoveringElement3dModel from '../../../models/CoveringElement3d.model';
import CoveringElement3dController from "../../../modelsControllers/Branch/CoveringElement3d.controller";
import {
    IWhereClause,
    ICoveringElement3d,
  } from "../../../interfaces/mapping.interface";
import Branch3dController from '../../../modelsControllers/Branch/Branch3d.controller';
import Branch3dExtremitySolutionController from '../../../modelsControllers/Branch/Branch3dExtremitySolution.controller';
import ComponentController from '../../../modelsControllers/Component.controller';

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

jest.mock("../../../models/Harness3dDesignSolution.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('Harness3dDesignSolutionModel', {
        id: "26",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

jest.mock("../../../models/CoveringElementType.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('CoveringElementTypeModel', {
        id: "26",
        createdAt: '2021-11-10T05:28:38.067Z',
        updatedAt: '2021-11-10T05:28:38.067Z'
    });
});

describe("Unit Tests for destroyExistingCoveringElement3dModelData", () => {
    let coveringElement3dController: CoveringElement3dController;
    const dataInput : ICoveringElement3d[]= [{
        "name": "BRA0033-EN6049-007----5.2",
        "type": "SLEEVE",
        "printedLabel1": "",
        "printedLabel2": "",
        "printedLabel3": "",
        "lengthMm": 60,
        "diameterMm": 3.1,
        "refParent": [{
            "ref": "branch3d",
            "whereClause": {
                "name": "BRA0033"
            }
        }, {
            "ref": "branch3dExtremitySolution",
            "whereClause": [{
                "name": "=L1L304",
                "extra": {
                    "lengthMm": 800.895
                }
            }, {
                "name": "=L1L304",
                "extra": {
                    "lengthMm": 860.895
                }
            }]
        }, {
            "ref": "component",
            "whereClause": [{
                "partNumber": "EN6049-007-05-5"
            }]
        },
    ]
    }]
    const whereClouseInput = {
        "partZone": {
            "name": "D92911343223A9"
        },
        "harness3dDesignSolution": {
            "adapDesignSolutionNumber": "D9291134322300",
            "adapDesignSolutionVersionNumber": "001",
            "adapDesignSolutionIssueNumber": "---"
        }
    };

    beforeAll(() => {
        const branchController = new Branch3dController();
        const branch3dExtremitySolutionController = new Branch3dExtremitySolutionController(branchController);
        const componentController = new ComponentController();
        coveringElement3dController = new CoveringElement3dController(branchController,
            branch3dExtremitySolutionController,componentController);
    })

    afterEach(() => {
        // jest.clearAllMocks();
    });

    it("should return undefined", async () => {
        await coveringElement3dController.createOrUpdate(
            dataInput,
            null,
            whereClouseInput
        ).then(
            res => {
                expect(res).toEqual(undefined);
            }
        )
    });

    it("should return undefined1", async () => {
        const dataInput : ICoveringElement3d[]= [{
            "name": "BRA0033-EN6049-007----5.2",
            "type": "SLEEVE",
            "printedLabel1": "",
            "printedLabel2": "",
            "printedLabel3": "",
            "lengthMm": 60,
            "diameterMm": 3.1,
            "refParent": [{
                "ref": "branch3d",
                "whereClause": {
                    "name": "BRA0033"
                }
            }, {
                "ref": "branch3d",
                "whereClause": {
                    "name": "BRA0034"
                }
            },{
                "ref": "branch3dExtremitySolution",
                "whereClause": [{
                    "name": "=L1L304",
                    "extra": {
                        "lengthMm": 800.895
                    }
                }, {
                    "name": "=L1L304",
                    "extra": {
                        "lengthMm": 860.895
                    }
                }]
            }, {
                "ref": "branch3dExtremitySolution",
                "whereClause": [{
                    "name": "=L1L307",
                    "extra": {
                        "lengthMm": 800.897
                    }
                }, {
                    "name": "=L1L307",
                    "extra": {
                        "lengthMm": 860.897
                    }
                }]
            }, {
                "ref": "branch3dExtremitySolution",
                "whereClause": [{
                    "name": "=L1L305",
                    "extra": {
                        "lengthMm": 800.896
                    }
                }, {
                    "name": "=L1L305",
                    "extra": {
                        "lengthMm": 860.896
                    }
                }]
            },
            {
                "ref": "component",
                "whereClause": [{
                    "partNumber": "EN6049-007-05-5"
                },
            ]
            },
            {
                "ref": "component",
                "whereClause": [{
                    "partNumber": "EN6049-007-05-6"
                },
            ]
            }
        ]
        }]
        await coveringElement3dController.createOrUpdate(
            dataInput,
            null,
            whereClouseInput
        ).then(
            res => {
                expect(res).toEqual(undefined);
            }
        )
    });

    it("findOneFromCoveringElement3D should return undefined", async () => {
        jest
        .spyOn(coveringElement3dController , "findOneFromCoveringElement3D")
        .mockImplementation(() => Promise.resolve(null))

        await coveringElement3dController.createOrUpdate(
            dataInput,
            null,
            whereClouseInput
        ).then(
            res => {
                expect(res).toEqual(undefined);
            }
        )
    });
});

describe("Unit Tests for CoveringElement3dModel" ,() => {
    let coveringElement3dController: CoveringElement3dController;
    beforeAll(() => {
        jest.clearAllMocks()
        const branchController = new Branch3dController();
        const branch3dExtremitySolutionController = new Branch3dExtremitySolutionController(branchController);
        const componentController = new ComponentController();
        coveringElement3dController = new CoveringElement3dController(branchController,
            branch3dExtremitySolutionController,componentController);
    });
    
    it("Should return CoveringElement3dModel", async () => {
        const dataInput = {name: 'BRA0033-EN6049-007----5.2'} ;
        const whereClauseInput = [{name: 'BRA0033'}];
        
        await coveringElement3dController.findOneFromCoveringElement3D(
            dataInput,
            whereClauseInput
        ).then(res => {
            expect(res).toEqual(undefined);
        });
    });
})