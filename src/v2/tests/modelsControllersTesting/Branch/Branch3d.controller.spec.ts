import Branch3dController from "../../../modelsControllers/Branch/Branch3d.controller";

jest.mock("../../../models/Branch3d.model", () => {
  const SequelizeMock = require("sequelize-mock");
  let dbMock = new SequelizeMock();
  return dbMock.define("Branch3dModel", {
    id: 43845,
    name: "BRA0001",
    branchId: 1,
    diameter3dMm: 16,
    bendRadius: 16,
    lengthMm: 1752.817,
    lengthForcedMm: 0,
    extraLengthMm: 0,
    notExtractible: false,
    createdBy: "ce-api-harness",
    updatedBy: "ce-api-harness",
    createdAt: "2021-10-26T05:32:30.109Z",
    updatedAt: "2021-10-26T06:47:30.260Z",
    deletedAt: "2021-10-26T06:47:30.260Z",
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

jest.mock("../../../modelsControllers/PrototypeModel.controller");

const dataFromImport: any = {
  "partZone": [{
    "name": "D92S70436000S8-VBE01",
    "userArea": "S8",
    "version": "001"
  }],
  "majorComponentAssembly": {
    "name": "AD"
  },
  "domain": {
    "name": "design office",
    "code": "DO"
  },
  "functionalItem": [{
    "sequenceNumber": "3545",
    "circuit": "VB"
  }],
  "circuit": [{
    "letters": "VB"
  }, {
    "letters": "VT"
  }],
  "aircraftProgram": {
    "mainAircraftLetterCode": "D",
    "familyName": "A320"
  },
  "branch3d": [{
    "name": "BRA0021",
    "diameter3dMm": 5.5,
    "bendRadius": 16.5,
    "lengthMm": 1617.757,
    "notExtractible": "false",
    "environmentType": "PRESSURISED",
    "segment": ["BNS0001", "BNS0006", "BNS0005", "BNS0002"],
    "effectiveRoutes": ["2M"],
    "refParent": {
      "ref": "partZone",
      "whereClause": {
        "name": "D92S70436000S8-VBE01"
      }
    },
    "branch3dPointDefinition": [{
      "coordinateX": 11491.507,
      "coordinateY": 920.921,
      "coordinateZ": -527.7,
      "vectorX": -0.99793,
      "vectorY": 0.06403,
      "vectorZ": -0.006
    }]
  }],
  "functionalItem3dSolution": [{
    "partNumber3d": "NSA937901M16-01",
    "instanceName3d": "7506VT_11",
    "definitionZone": "",
    "panel": "",
    "longPartNumber": "3545VB",
    "mountingPriority": "P",
    "solutionNumber": "1",
    "positionX": 11126.628,
    "positionY": 1411.14,
    "positionZ": -1406.839,
    "refParent": [{
      "ref": "branch3dExtremitySolution",
      "whereClause": {
        "name": "EXT0001"
      }
    }, {
      "ref": "partZone",
      "whereClause": {
        "name": "D92S70436000S8-VBE01",
        "extra": {
          "mountingPriority": "P",
          "connectionStatus": [],
          "effectiveRoutes": ["2M"]
        }
      }
    }, {
      "ref": "functionalItem",
      "whereClause": {
        "sequenceNumber": "7506",
        "circuit": "VT",
        "suffix": "",
        "appendedLetter": "11",
        "extra": {
          "mountingPriority": "P",
          "connectionStatus": [],
          "effectiveRoutes": ["2M"]
        }
      }
    }]
  }],
  "component": [],
  "harness3dDesignSolution": {
    "adapDesignSolutionNumber": "D9291354500000",
    "adapDesignSolutionVersionNumber": "001",
    "adapDesignSolutionIssueNumber": "---",
    "dataStatus": "temporary"
  }
}

const branchData = {
  id: 43845,
  name: "BRA0001",
  branchId: 1,
  diameter3dMm: 16,
  bendRadius: 16,
  lengthMm: 1752.817,
  lengthForcedMm: 0,
  extraLengthMm: 0,
  notExtractible: false,
  createdBy: "ce-api-harness",
  updatedBy: "ce-api-harness",
  createdAt: "2021-10-26T05:32:30.109Z",
  updatedAt: "2021-10-26T06:47:30.260Z",
  deletedAt: "2021-10-26T06:47:30.260Z",
};

describe("Unit Tests for find All branch", () => {
  const branch3dController = new Branch3dController();
  it("Branch3dController should be defined", () => {
    expect(Branch3dController).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("find all branches", async () => {
    Object.getPrototypeOf(branch3dController).whereClause = {
      partZone: {},
      harness3dDesignSolution: {},
    };
    const output = await branch3dController.findAll();
    expect(JSON.parse(JSON.stringify(output[0]))).toStrictEqual(
      JSON.parse(JSON.stringify(branchData))
    );
  });

  it("unit Tests findAllBranchAssociation", async () => {
    const output = await branch3dController.findAll();
    expect(await branch3dController.findAllBranchAssociation(output[0]));
  });

  it("unit Tests createOrUpdate", async () => {
    jest
    .spyOn(branch3dController, "createOrUpdate")
    .mockImplementation(() => Promise.resolve(undefined));
    const whereClause = {
      partZone: { name: 'D92S70436000S8-VBE01', version: '001' },
      harness3dDesignSolution: {
        adapDesignSolutionNumber: 'D9291354500000',
        adapDesignSolutionVersionNumber: '001',
        adapDesignSolutionIssueNumber: '---'
      }
    }
    const output = await branch3dController.createOrUpdate(dataFromImport, null, whereClause);
    expect(output).toBeUndefined
  });


  it("Unit Tests for compareRoute", async () => {
    const effectiveRoutes = ["2S", "2SB"];
    const routes = ["2S", "2SB"];
    expect(
      Object.getPrototypeOf(branch3dController).compareRoute(
        effectiveRoutes,
        routes
      )
    ).toBe(true);
  });

  it("unit Tests clearBranchInformation", async () => {
    expect(
      Object.getPrototypeOf(branch3dController).clearBranchInformation(
        branchData
      )
    ).toBe(undefined);
  });
});
