import AdapItemModel from "../../models/AdapItem.model";
import AdapCi from "../../modelsControllers/SynchronizeAPS/AdapCipzCi/AdapCi";

jest.mock("../../models/AdapItem.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('AdapItemModel', {
      id: 5,
      number: 'D92938586520A1',
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt : '2021-10-28T08:46:45.635Z',
      updatedAt: "2021-10-28T08:53:28.541Z",
  })
})

const dataFromAps = [
  {
    id: "D92938586520A1", // ADAP-CI id (adap_item): 14 characters
    type: "ADAP-CI",
    subType: "ADAP-CI",
    vu_vb_code: "1001VB",
    ciConfigSet: "A-F", //  "A-D"|"A-E"|"A-UK"
    ataSubAta: "2065", // 4 digits
    pz_ci: [
      {
        pz_ci_id: "D92938586520A1", // Part-zone CI id (part_zone_item): 14 characters
        owner: "TO32030",
        zone: "001",
      },
      {
        pz_ci_id: "D92Wxxxx34xxA2", // Part-zone CI id (part_zone_item): 14 characters
        owner: "TO32030",
        zone: "001",
      },
      {
        pz_ci_id: "D92Wxxxxx23xxB1", // Part-zone CI id (part_zone_item): 14 characters
        owner: "TO32030",
        zone: "002",
      },
    ],
  },
];

describe("Unit Tests for AdapCi", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockresult = 
    {
      id: 5,
      number: 'D92938586520A1',
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt : '2021-10-28T08:46:45.635Z',
      updatedAt: "2021-10-28T08:53:28.541Z",
    }
  
  const adapCiController = new AdapCi();

  it("AdapCi should be defined", () => {
    expect(AdapCi).toBeDefined();
  });

  test("should return AdapItem Model ", async () => {

    const adapCiControllerOutput = await adapCiController.createOrFetchAdapCi(dataFromAps)
    expect(adapCiControllerOutput['dataValues']).toEqual(
      mockresult
    );
  });

  test("should return ADAP CI ", async () => {
    jest
      .spyOn(adapCiController, "findOne")
      .mockImplementation(() => Promise.resolve(null));
    
    const adapCiControllerOutput = await adapCiController.createOrFetchAdapCi(dataFromAps);
    expect(adapCiControllerOutput['dataValues']).toEqual(mockresult);
  });

  test("throgh error " , async () => {
    jest
      .spyOn(adapCiController, "findOne")
      .mockImplementation(() => Promise.reject("Data Not Found"));
      const adapCiControllerOutput = adapCiController.createOrFetchAdapCi(dataFromAps);
      adapCiControllerOutput.catch( e=> {
        expect(e).toEqual("Data Not Found")
      });
    });

    it("should return AdapCi", async () => {
      const output = await adapCiController.getAdapCiList("E929456743800");
      expect(output).toHaveBeenCalled;
    });
});


describe("Unit Tests for findOne" , () => {
  const adapCiController = new AdapCi();
  test("should throw an error" , () => {
    jest
    .spyOn(AdapItemModel, "findOne")
    .mockImplementation(() => Promise.reject("Something went wrong!!!"));
     adapCiController.findOne({ number: '5' }).catch(e => {
          expect(e).toEqual("Something went wrong!!!")
     });
  })
})
