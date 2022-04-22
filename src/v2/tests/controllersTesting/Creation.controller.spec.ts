import "reflect-metadata"
import { container } from "tsyringe";
import CreationController from "../../controllers/Creation.controller";
import { IMappedData, IPartZoneManagerData } from "../../interfaces/mapping.interface";
import { IconfigFile } from "../../interfaces/Processing.interface";



describe("Unit Tests for Creation controller", () => {

  const creationController = container.resolve(CreationController);
  const mappedData:IPartZoneManagerData ={
    harness3dDesignSolution: {
      adapDesignSolutionNumber: 'D92917049004',
      adapDesignSolutionVersionNumber: '001',
      adapDesignSolutionIssueNumber: '---',
      harnessType:"def",
      caccDsNumber: 'D92911010000',
      caccDsSolution: '001',
      psSynchroStatus: 'WARNING',
      refParent:{ ref: "harness3dDesignSolution",
        whereClause: {name:"D929123455311"}
      }
    },
    functionalItem: {
      sequenceNumber: '1010',
      circuit: 'VB'
    },
    partZone: [{
        name: 'D92917049000ZE',
        userArea: 'ZE',
        issue: "A",
        version: "001",
        origin: 'noChange'
      }
    ],
    majorComponentAssembly: {
      name: 'AF'
    },
    aircraftProgram: {
      familyName: 'A320'
    }
  };
  const configFile:IconfigFile ={
    name: 'Proptool config file',
    fileFormat: 'proptool',
    unicities:[ {name: "harness3dDesignSolution",
      fields: ["name"]}]
  };
  const mappedDataWithBranch:IMappedData ={
    harness3dDesignSolution: {
      adapDesignSolutionNumber: 'D92917049004',
      adapDesignSolutionVersionNumber: '001',
      adapDesignSolutionIssueNumber: '---',
      harnessType:"def",
      caccDsNumber: 'D92911010000',
      caccDsSolution: '001',
      psSynchroStatus: 'WARNING',
      refParent:{ ref: "harness3dDesignSolution",
        whereClause: {name:"D929123455311"}
      }
    },
    functionalItem: [{
      sequenceNumber: '1010',
      circuit: 'VB'
    }],
    partZone: [{
        name: 'D92917049000ZE',
        userArea: 'ZE',
        issue: "A",
        version: "001",
        origin: 'noChange'
      }
    ],
    branch3d: [{
      "name": "BRA0021",
      "diameter3dMm": 5.5,
      "bendRadius": 16.5,
      "lengthMm": 1617.757,
      "segment": [
        "BNS0001",
        "BNS0006",
        "BNS0005",
        "BNS0002"
      ],
      "effectiveRoutes": [
        "2M"
      ],
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
      }, ]
    }],
    majorComponentAssembly: {
      name: 'AF'
    },
    aircraftProgram: {
      familyName: 'A320'
    }
  };
  it("Creation Model controller should be defined", () => {
    expect(CreationController).toBeDefined();
  });

  it("should return void when mappedData consists IPartZoneManagerData interface without branch3d data", async () => {
    jest.spyOn(creationController, "createComponents").mockImplementation(() => Promise.resolve(undefined));
    const output = await creationController.createComponents(false, mappedData,configFile);
    expect(output).toHaveBeenCalled;
  });

  it("should return void when mappedData consists IMappedData interface with branch3d data", async () => {
    jest.spyOn(creationController, "createComponents").mockImplementation(() => Promise.resolve(undefined));
    const output = await creationController.createComponents(false, mappedDataWithBranch,configFile);
    expect(output).toHaveBeenCalled;
  });
  it("should return void when mappedData consists IMappedData interface with branch3d data with partZoneDeletionList", async () => {
    jest.spyOn(creationController, "createComponents").mockImplementation(() => Promise.resolve(undefined));
    const output = await creationController.createComponents(false, mappedDataWithBranch,configFile,["D92913456234DS"]);
    expect(output).toHaveBeenCalled;
  });

  it("should return void when mappedData consists IPartZoneManagerData interface without branch3d data with partZoneDeletionList", async () => {
    jest.spyOn(creationController, "createComponents").mockImplementation(() => Promise.resolve(undefined));
    const output = await creationController.createComponents(false, mappedData,configFile,["D92913456234DS"]);
    expect(output).toHaveBeenCalled;
  });

  it("should throw an error", () => {
    jest
    .spyOn(creationController, "createComponents")
      .mockImplementation(() => Promise.reject("400 Bad Request"));
    const output = creationController.createComponents(false);
    output.catch(e => {
      expect(e).toEqual("400 Bad Request");
    });
  });

});
