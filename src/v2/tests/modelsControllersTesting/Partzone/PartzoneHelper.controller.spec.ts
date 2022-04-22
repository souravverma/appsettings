import { IPartZone } from "../../../interfaces/mapping.interface";
import PartZoneHelper from "../../../modelsControllers/Partzone/PartzoneHelper.controller";
import * as GlobalEnums from "../../../ConfigurationFiles/GlobalEnums";

jest.mock("../../../models/Partzone.model", () => {
  const SequelizeMock = require('sequelize-mock');
  let dbMock = new SequelizeMock();
  return dbMock.define('PartzoneModel', {
      id: "26",
      name: 'E929XXXXXXXXXX',
      version: '001',
      updated_at:'2021-11-10T05:28:38.067Z'
  });
});

//jest.mock("../../../modelsControllers/Harness/HarnessForPartZone.controller");

describe("Unit Tests for PartZoneHelper Class", () => {

    // let mockedSequelize: Sequelize;
    
    // beforeEach(async () => {
    //     mockedSequelize = new Sequelize({
    //         database: '<mockDB>',
    //         dialect: 'sqlite',
    //         username: 'root',
    //         password: '',
    //         validateOnly: true,
    //         models: [__dirname + '/models'],
    //     });
    //     await mockedSequelize.sync({ force: true });
    // })

    // afterEach(async () => {
    //     jest.clearAllMocks();
    //     await mockedSequelize.close();
    // })

    class WhereClauseParentMock {
        partZone?: any;
        version?: any;
        harness3dDesignSolution: any;
      }
      
      class PartZoneMock {
        name: string;
        partzoneVersion?: string;
        userArea: string;
        dataStatus?: string;
        releaseStatus?: string;
        originId?: number;
        origin?: string;
        issue?: string;
        version?: string;
        upissue?: boolean;
      }

      

    const mockresult = [
      {
        pz_ci_id: "D92938586520A1", 
        owner: "TO32030",
        zone: "001",
      },
    ];

    const whereWithVersion: any = {
        name: 'D92913033116A1',
        version: '001'
      };

      const whereWithoutVersion: any = {
        name: 'D92913033116A1',
        version: ''
      };

      const dataToBeUpdated: any = {
        id:'26',
        name: 'E929XXXXXXXXXX',
        version: '001',
        updated_at:'2021-11-10T05:28:38.067Z'
      };

      const pzData = [{
        issue:'A',
        name:'EXXXXXXXXXXXXXT1',
        releaseStatus:'IWDSG',
        userArea:'T1',
        version:'999'
      }]as unknown as IPartZone[];

    const partZoneHelper = new PartZoneHelper();
  
    // it("partZoneHelper should be defined", () => {
    //   expect(partZoneHelper).toBeDefined();
    // });
  
    it("should return where With Version after creation", async () => {
      jest
        .spyOn(partZoneHelper, "createWhereCondition");
  
      expect(await partZoneHelper.createWhereCondition('001', 'D92913033116A1')).toStrictEqual(
        whereWithVersion
      );
    });

    it("should return where Without Version after creation", () => {
        jest
          .spyOn(partZoneHelper, "createWhereCondition");
    
        expect(partZoneHelper.createWhereCondition('','D92913033116A1')).toStrictEqual(
            whereWithoutVersion
        );
      });

      it("should return DS name from the 12 first digit of Pz Name + 00", () => {
        jest
          .spyOn(partZoneHelper, "createDsNameFromPartZoneName");
    
        expect(partZoneHelper.createDsNameFromPartZoneName('D92913033116A1')).toEqual(
            'D9291303311600'
        );
      });

      it("should return expected data", async () => {
        let result =await partZoneHelper.getAllHarnessesForPartZone('D92913033116A1');
        expect(result).toBe(undefined);
      });

      it("should return true for checkHarnessForPartzoneExists", async () => {
        let result =await partZoneHelper.checkHarnessForPartzoneExists("abc");
        expect(result).toBe(undefined);
      });

      it("should return partzone name for createDsNameFromPartZoneName", async () => {
        let result = partZoneHelper.createDsNameFromPartZoneName("E92991353000Q8");
        expect(result).toEqual("E9299135300000");
      });

      it("should return null partzone name for createDsNameFromPartZoneName", async () => {
        let result = partZoneHelper.createDsNameFromPartZoneName("XYZ");
        expect(result).toEqual(null);
      });

      it("setWhereCondition to set data having version should return partzone name ", () => {
        const pzMock = {
          name: "D92938586520A1",
          partzoneVersion: "002",
          userArea: "",
          dataStatus: "",
          dataType: "",
          consolidationStatus: "",
          consolidationMessage: "",
          releaseStatus: "",
          originId: 123,
          origin: "",
          issue: "A",
          version: "",
          upissue: false,
          updated_at: "2021-10-04T11:38:06.301Z",
          pzStatus: ""
        } as unknown as IPartZone;
        let result = partZoneHelper.setWhereCondition(false, pzMock, pzData);
        expect(result.name).toEqual("D92938586520A1");
      });

      
      it("setWhereCondition to set data having version and origine should return partzone name and partzone version ", () => {
        const pzMock = {
          name: "D92938586520A1",
          partzoneVersion: "002",
          userArea: "",
          dataStatus: "",
          dataType: "",
          consolidationStatus: "",
          consolidationMessage: "",
          releaseStatus: "",
          originId: 123,
          origin: "temp",
          issue: "A",
          version: "temp",
          upissue: false,
          updated_at: "2021-10-04T11:38:06.301Z",
          pzStatus: ""
        } as unknown as IPartZone;
        let result = partZoneHelper.setWhereCondition(false, pzMock, pzData);
        expect(result.name).toEqual("D92938586520A1");
        expect(result.version).toEqual("temp");
      });

      it("setWhereCondition to set data having version should return partzone name and partzone version ", () => {
        const pzMock = {
          name: "D92938586520A1",
          partzoneVersion: "002",
          userArea: "",
          dataStatus: "",
          dataType: "",
          consolidationStatus: "",
          consolidationMessage: "",
          releaseStatus: "",
          originId: 123,
          origin: "",
          issue: "A",
          version: "temp",
          upissue: false,
          updated_at: "2021-10-04T11:38:06.301Z",
          pzStatus: ""
        } as unknown as IPartZone;
        let result = partZoneHelper.setWhereCondition(false, pzMock, pzData);
        expect(result.name).toEqual("D92938586520A1");
        expect(result.version).toEqual("temp");
      });

      it("setWhereCondition to set data having origin as update-pz should return partzone name and partzone version ", () => {
        const pzMock = {
          name: "EXXXXXXXXXXXXXT1",
          partzoneVersion: "002",
          userArea: "",
          dataStatus: "",
          dataType: "",
          consolidationStatus: "",
          consolidationMessage: "",
          releaseStatus: "",
          originId: 123,
          origin: "update-pz",
          issue: "A",
          version: "temp",
          upissue: false,
          updated_at: "2021-10-04T11:38:06.301Z",
          pzStatus: ""
        } as unknown as IPartZone;
        let result = partZoneHelper.setWhereCondition(false, pzMock, pzData);
        expect(result.name).toEqual("EXXXXXXXXXXXXXT1");
        expect(result.version).toEqual("999");
      });

      it("should set the dataType to 2D and update status for 2D PartZone", () => {
        let partZone = {
          name: "D92921111111A1",
          dataStatus: "waiting_syncro",
          consolidationStatus: "",
          consolidationMessage: "",
          dataType: "",
        } as any as IPartZone;
    
        partZoneHelper.update2D3DDataForPartzone(partZone);
        expect(partZone.dataStatus).toBe(GlobalEnums.DataStatusEnum.TEMPORARY);
        expect(partZone.consolidationStatus).toBe(GlobalEnums.ConsistencyStatus.WARNING);
        expect(partZone.consolidationMessage).toBe(GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA);
        expect(partZone.dataType).toBe("2D");
    
        partZone = {
          name: "D92021111111A1",
          dataStatus: "waiting_syncro",
          consolidationStatus: "",
          consolidationMessage: "",
          dataType: "",
        } as any as IPartZone;
    
        partZoneHelper.update2D3DDataForPartzone(partZone);
        expect(partZone.dataStatus).toBe(GlobalEnums.DataStatusEnum.TEMPORARY);
        expect(partZone.consolidationStatus).toBe(GlobalEnums.ConsistencyStatus.WARNING);
        expect(partZone.consolidationMessage).toBe(GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA);
        expect(partZone.dataType).toBe("2D");
    
        partZone = {
          name: "E92S21111111A1",
          dataStatus: "waiting_syncro",
          consolidationStatus: "",
          consolidationMessage: "",
          dataType: "",
        } as any as IPartZone;
    
        partZoneHelper.update2D3DDataForPartzone(partZone);
        expect(partZone.dataStatus).toBe(GlobalEnums.DataStatusEnum.TEMPORARY);
        expect(partZone.consolidationStatus).toBe(GlobalEnums.ConsistencyStatus.WARNING);
        expect(partZone.consolidationMessage).toBe(GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA);
        expect(partZone.dataType).toBe("2D");
      });
    
      it("should set the dataType to 3D and update status for 3D PartZone", () => {
        let partZone = {
          name: "D92931111111A1",
          dataStatus: "waiting_syncro",
          consolidationStatus: "",
          consolidationMessage: "",
          dataType: "",
        } as any as IPartZone;
    
        partZoneHelper.update2D3DDataForPartzone(partZone);
        expect(partZone.dataStatus).toBe("waiting_syncro");
        expect(partZone.consolidationStatus).toBe("");
        expect(partZone.consolidationMessage).toBe("");
        expect(partZone.dataType).toBe("3D");
    
        partZone = {
          name: "D92221111111A1",
          dataStatus: "waiting_syncro",
          consolidationStatus: "",
          consolidationMessage: "",
          dataType: "",
        } as any as IPartZone;
    
        partZoneHelper.update2D3DDataForPartzone(partZone);
        expect(partZone.dataStatus).toBe("waiting_syncro");
        expect(partZone.consolidationStatus).toBe("");
        expect(partZone.consolidationMessage).toBe("");
        expect(partZone.dataType).toBe("3D");
    
        partZone = {
          name: "A92S21111111A1",
          dataStatus: "waiting_syncro",
          consolidationStatus: "",
          consolidationMessage: "",
          dataType: "",
        } as any as IPartZone;
    
        partZoneHelper.update2D3DDataForPartzone(partZone);
        expect(partZone.dataStatus).toBe("waiting_syncro");
        expect(partZone.consolidationStatus).toBe("");
        expect(partZone.consolidationMessage).toBe("");
        expect(partZone.dataType).toBe("3D");
      });

      
      // it("should return Increment Partzone VersionNumber For Frozen Status", () => {
      //   const model:PartZoneModel =new PartZoneModel();
      //   const item: IPartZone = new PartZoneMock();
      //   const whereClause: IWhereClauseParent = new WhereClauseParentMock();
  
      //   model.dataStatus = 'frozen';
      //   model.version='002';
      //   item.version = '001';

      //   jest
      //     .spyOn(partZoneHelper, "updatePartzoneVersionNumber");
    
      //   expect(partZoneHelper.updatePartzoneVersionNumber(item, model, whereClause)).toEqual(
      //       '003'
      //   );
      // });
  
      // it("should return Partzone VersionNumber For Temporary Status", () => {
      //   const model:PartZoneModel =new PartZoneModel();
      //   const item: IPartZone = new PartZoneMock();
      //   const whereClause: IWhereClauseParent = new WhereClauseParentMock();
  
      //   model.dataStatus = 'temporary';
      //   model.version='002';
      //   item.version = '001';

      //   jest
      //     .spyOn(partZoneHelper, "updatePartzoneVersionNumber");
    
      //   expect(partZoneHelper.updatePartzoneVersionNumber(item, model, whereClause)).toEqual(
      //       '002'
      //   );
      // });
    // test("should return ADAP CI ID from mock database search", async () => {
    //   jest
    //     .spyOn(adapCiController, "findOne")
    //     .mockImplementation(() => Promise.resolve(mockresult));
  
    //   expect(
    //     await adapCiController.findOne({ number: '5' })
    //   ).toStrictEqual(mockresult);
    // });
  });

function async() {
  throw new Error("Function not implemented.");
}
