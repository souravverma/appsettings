import AdapLoModel from "../../models/AdapLo.model";
import AdapLo from "../../modelsControllers/SynchronizeAPS/AdapLo/AdapLo";
import {
  adapDsMockData
} from "../mockJson/AdapDs";
const util = require('util')

const dataFromAps = adapDsMockData;
jest.mock("../../models/AdapLo.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('AdapLoModel', {
    id: 5,
    number: 'D92938586520A1',
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
    fk_harness_3d_ds_id:2
  });
})


describe("Unit Tests for createOrFetchAdapLo", () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
  const adapLoController = new AdapLo();

  it("pzci and Ds should be defined", () => {
    expect(AdapLo).toBeDefined();
  });

  it("should return AdapLo Model", async () => {

    const adapLoControllerOutput = await adapLoController.createOrFetchAdapLo(dataFromAps[0].specifiedPzDs)
    expect(adapLoControllerOutput['dataValues']).toEqual({
      '0': {
        id: 'D92999999999QD',
        pzCiId: 'D92WxxxxxxxxA1',
        lastModifiedDate: '23/06/2020',
        issue: 'B',
        version: 'A',
        firstMsn: 12345,
        pzOrigin: [{
            id: 'D92410657000A1',
            issue: '___'
          },
          {
            id: 'D92411002002A1',
            issue: '___'
          }
        ],
        deltaMp: [{
          added: ['MPplus1', 'MPplus2'],
          removed: ['MPminus1', 'MPminus2']
        }]
      },
      id: 5,
      number: 'D92938586520A1',
      createdAt: '2021-10-28T08:46:45.635Z',
      updatedAt: "2021-10-28T08:53:28.541Z",
      fk_harness_3d_ds_id:2
    })

  });

  it("should throw an error", async () => {
    jest
      .spyOn(AdapLoModel, "create")
      .mockImplementation(() => Promise.reject("400 Bad Request"));
    const adapLoControllerOuput = adapLoController.createOrFetchAdapLo(dataFromAps[0].specifiedPzDs);
    adapLoControllerOuput.catch(e => {
      expect(e).toEqual("400 Bad Request");
    });
  });

});

describe("Unit Tests for unlinkAdapLoDs", () => {
const adapLoController = new AdapLo();
it("should return the number of deleated column in adap lo table", async () => {
const output = await adapLoController.unlinkAdapLoDs(2,false);
expect(output).toEqual(1);
});
})

describe("Unit Tests for findOne", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const adapLoController = new AdapLo();
  const output = {
    id: 5,
    number: 'D92938586520A1',
    createdAt: '2021-10-28T08:46:45.635Z',
    updatedAt: "2021-10-28T08:53:28.541Z",
    fk_harness_3d_ds_id:2
  }

  it("should return empty array", async () => {
    const adapLoControllerOuput = await adapLoController.findOne({
      number: 'D92938586520A1'
    });
    expect(adapLoControllerOuput['dataValues']).toEqual(output);
  });

  it("should throw an error", () => {
    jest
      .spyOn(AdapLoModel, "findOne")
      .mockImplementation(() => Promise.reject("400 Bad Request"));
    const adapLoControllerOuput = adapLoController.findOne({
      number: 'D92938586520A1'
    });
    adapLoControllerOuput.catch(e => {
      expect(e).toEqual("400 Bad Request");
    });
  });
});


