import AdapPzDsHelper from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/AdapPzDsHelper";
import {
    IAdapDsCiLO,
    IImplementedPzDs,
    ISpecifiedPzDs
} from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/interface/AdapDsPzDs.interface";
jest.mock("../../modelsControllers/SynchronizeAPS/AdapDsPzDs/AdapDsHarnessHelper");
jest.mock("../../models/Partzone.model", () => {
    const SequelizeMock = require('sequelize-mock');
    let dbMock = new SequelizeMock();
    return dbMock.define('findAll', {
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
    })
})

describe("Unit Tests for AdapPzDsHelper", () => {

    const adapPzDsHelper = new AdapPzDsHelper();
    const specifiedPzDsInput: ISpecifiedPzDs[] = [{
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
        },],
    },];
    const outputData = ["QD"]

    it("AdapDsHarness should be defined", () => {
        expect(adapPzDsHelper).toBeDefined();
    });

    it("Get userAreaNamefromAps", () => {
        const expectedOutput = adapPzDsHelper.getuserAreaNamefromAps(specifiedPzDsInput);
        expect(expectedOutput)
            .toEqual(outputData);
    });
});

describe("Unit Tests for getadapCiPzCiData", () => {

    const adapPzDsHelper = new AdapPzDsHelper();

    const specifiedPzDsInput: ISpecifiedPzDs[] = [{
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
        },],
    },]

    const outputData = {
        id: "DME92Z420904",
        pz_ci: [{
            pz_ci_id: "D92WxxxxxxxxA1",
        }],
    }
    const ciLoInput = [{
        adapCiId: "DME92Z420904",
        adapLoId: "DME92Z420905",
    },]

    it("Get getadapCiPzCiData", () => {
        expect(adapPzDsHelper.getadapCiPzCiData(specifiedPzDsInput, ciLoInput))
            .toEqual(outputData);
    });

});

describe("Unit Tests for getMaxVersionPZ", () => {
    const adapPzDsHelper = new AdapPzDsHelper();
    let name = 'D92999999999QD';

    it("Update PZOrigin", async () => {
        const expectedOutput = await adapPzDsHelper.getMaxVersionPZ(name);
        console.log(expectedOutput, "expectedOutput");
    });


});

describe("Unit Tests for updatePZOrigin", () => {
    const adapPzDsHelper = new AdapPzDsHelper();
    const specifiedPzDsInput: ISpecifiedPzDs[] = [{
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
        },],
    },]

    const pzDsfromApsInput = [{
        name: "D92999999999QD",
        userArea: "QD",
        issue: "B",
        version: "A",
    }]

    it("version and orginid should not be avialable", async () => {
        specifiedPzDsInput[0].pzOrigin = null;
        await adapPzDsHelper.updatePZOrigin(specifiedPzDsInput, pzDsfromApsInput);
        expect(pzDsfromApsInput).toEqual([{
            name: "D92999999999QD",
            userArea: "QD",
            issue: "B",
            version: "A",
        }])
    });

    it("Should get version and orginid", async () => {
        specifiedPzDsInput[0].pzOrigin = [{
            id: "D92410657000A1",
            issue: "___",
        },
        {
            id: "D92411002002A1",
            issue: "___",
        },
        ]
        await adapPzDsHelper.updatePZOrigin(specifiedPzDsInput, pzDsfromApsInput);
        expect(pzDsfromApsInput).toEqual([{
            name: "D92999999999QD",
            userArea: "QD",
            issue: "B",
            version: "001",
            originId: 2851
        }])
    });
});


describe("Unit Tests for createPzDsDictionary", () => {

    const adapPzDsHelper = new AdapPzDsHelper();
    const pzDsfromApsInput = [{
        name: "D92999999999QD",
        userArea: "QD",
        issue: "B",
        version: "A",
    },];
    const specifiedPzDsInput: ISpecifiedPzDs = {
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
        },],
    }

    it("pzDsfromApsInput should be 2", () => {
        adapPzDsHelper.createPzDsDictionary(pzDsfromApsInput, specifiedPzDsInput)
        expect(pzDsfromApsInput.length)
            .toBe(2);
    });

    it("Validate newly created field in pzDsfromApsInput", () => {
        adapPzDsHelper.createPzDsDictionary(pzDsfromApsInput, specifiedPzDsInput)
        expect(pzDsfromApsInput[1])
            .toEqual({
                name: specifiedPzDsInput.id,
                userArea: specifiedPzDsInput.id.slice(-2),
                issue: specifiedPzDsInput.issue,
                version: specifiedPzDsInput.version
            });
    });

});


describe("Unit Tests for updateHarnessVersion", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    const adapPzDsHelper = new AdapPzDsHelper();
    const iAdapDsCiLOWithImplementedPzInput: IAdapDsCiLO = {
        id: "E9297854566601",
        type: "ADAP-DS",
        subType: "ADAP-DS",
        englishTitle: "ROUTING FR20/23 FLOOR",
        issue: "---",
        version: "001",
        lastReleased: false,
        lastIssue: false,
        lastModifiedDate: "23/06/2020",
        releaseStatus: "Release",
        firstMsn: 12345,
        ciLo: [{
            adapCiId: "DME92Z420904",
            adapLoId: "DME92Z420905",
        },],
        implementedPzDs: [{
            id: "D929xxxxxxxxA1",
            pzCiId: "D92WxxxxxxxxA1",
            issue: "B",
            version: "A",
            lastModifiedDate: "23/06/2020",
            pzOrigin: null,
            deltaMp: null,
            firstMsn: 12345,
        }],
    };

    const iAdapDsCiLOWithSpecifiedPzInput: IAdapDsCiLO = {
        id: "E9297854566601",
        type: "ADAP-DS",
        subType: "ADAP-DS",
        englishTitle: "ROUTING FR20/23 FLOOR",
        issue: "---",
        version: "001",
        lastReleased: false,
        lastIssue: false,
        lastModifiedDate: "23/06/2020",
        releaseStatus: "Release",
        firstMsn: 12345,
        ciLo: [{
            adapCiId: "DME92Z420904",
            adapLoId: "DME92Z420905",
        },],
        specifiedPzDs: [{
            id: "E92978545666QD",
            pzCiId: "D92WxxxxxxxxA1",
            lastModifiedDate: "23/06/2020",
            issue: "B",
            version: "A",
            firstMsn: 12345,
            pzOrigin: [{
                id: "E92978545666A1",
                issue: "___",
            },
            {
                id: "E92978545666A1",
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
            },],
        }],
    };



    it("Should return promise object when set flagCreateNewDS to false and specifiedPzDs data is present", async () => {
        iAdapDsCiLOWithSpecifiedPzInput.specifiedPzDs[0].issue = '';
        const UpdatePzOrginSpy = jest
            .spyOn(adapPzDsHelper, "updatePZOrigin")
            .mockImplementation(() => Promise.resolve({
                validSpecifiedPzDs: [],
                pzDsfromAps: [],
                originNotFound: []
            }));

        await adapPzDsHelper.updateHarnessVersion(iAdapDsCiLOWithSpecifiedPzInput, false, '001', { sequenceNumber: "9999", circuit: "VB" })
        expect(UpdatePzOrginSpy).toHaveBeenCalledTimes(1)
    });

    it("Should return promise object when set flagCreateNewDS to true and specifiedPzDs data is present", async () => {
        iAdapDsCiLOWithSpecifiedPzInput.specifiedPzDs[0].issue = 'A';

        const getMaxVersionPZSpy = jest
            .spyOn(adapPzDsHelper, "getMaxVersionPZ")
            .mockImplementation(() => null);
        jest
            .spyOn(adapPzDsHelper, "updatePZOrigin")
            .mockImplementation(() => Promise.resolve({
                validSpecifiedPzDs: [],
                pzDsfromAps: [],
                originNotFound: []
            }));

        await adapPzDsHelper.updateHarnessVersion(iAdapDsCiLOWithSpecifiedPzInput, true, '001', { sequenceNumber: "9999", circuit: "VB" });
        expect(getMaxVersionPZSpy).toHaveBeenCalledTimes(1)
    });

    it("Should return promise object when set flagCreateNewDS to false and implementedPzDs data is present", async () => {
        iAdapDsCiLOWithImplementedPzInput.implementedPzDs[0].issue = '';
        const UpdatePzOrginSpy = jest
            .spyOn(adapPzDsHelper, "updatePZOrigin")
            .mockImplementation(() => Promise.resolve({
                validSpecifiedPzDs: [],
                pzDsfromAps: [],
                originNotFound: []
            }));

        await adapPzDsHelper.updateHarnessVersion(iAdapDsCiLOWithImplementedPzInput, false, '001', { sequenceNumber: "9999", circuit: "VB" })
        expect(UpdatePzOrginSpy).toHaveBeenCalledTimes(1)
    });

    it("Should return promise object when set flagCreateNewDS to true and implementedPzDs data is present", async () => {
        iAdapDsCiLOWithImplementedPzInput.implementedPzDs[0].issue = 'A';

        const getMaxVersionPZSpy = jest
            .spyOn(adapPzDsHelper, "getMaxVersionPZ")
            .mockImplementation(() => null);
        jest
            .spyOn(adapPzDsHelper, "updatePZOrigin")
            .mockImplementation(() => Promise.resolve({
                validSpecifiedPzDs: [],
                pzDsfromAps: [],
                originNotFound: []
            }));

        await adapPzDsHelper.updateHarnessVersion(iAdapDsCiLOWithImplementedPzInput, true, '001', { sequenceNumber: "9999", circuit: "VB" });
        expect(getMaxVersionPZSpy).toHaveBeenCalledTimes(1)
    });

    it("updateHarnessVersion for 924 DS data should return validSpecifiedPzDs", async () => {
        iAdapDsCiLOWithImplementedPzInput.id = "E9247854566601";
    
        jest
          .spyOn(adapPzDsHelper, "getMaxVersionPZ")
          .mockImplementation(() => null);
        jest.spyOn(adapPzDsHelper, "updatePZOrigin").mockImplementation(() =>
          Promise.resolve({
            validSpecifiedPzDs: [
              {
                id: "E92478545666QD",
                pzCiId: "D92WxxxxxxxxA1",
                lastModifiedDate: "23/06/2020",
                issue: "B",
                version: "A",
                firstMsn: 12345,
                pzOrigin: [
                  {
                    id: "E92478545666A1",
                    issue: "___",
                  },
                  {
                    id: "E92478545666A1",
                    issue: "___",
                  },
                ],
                deltaMp: [
                  {
                    added: ["MPplus1", "MPplus2"],
                    removed: ["MPminus1", "MPminus2"],
                  },
                ],
              },
            ],
            pzDsfromAps: [],
            originNotFound: [],
          })
        );
    
        const result = await adapPzDsHelper.updateHarnessVersion(
          iAdapDsCiLOWithImplementedPzInput,
          true,
          "001",
          { sequenceNumber: "9999", circuit: "VB" }
        );
        expect(result.validSpecifiedPzDs.length).toEqual(1);
      });
});