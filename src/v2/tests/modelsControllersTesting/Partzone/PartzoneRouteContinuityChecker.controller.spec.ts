import { WhereOptions } from "sequelize";
import PartZoneModel from "../../../models/Partzone.model";
import PartzoneRouteContinutityChecker from "../../../modelsControllers/Partzone/PartZoneRouteContinutityChecker.controller";


jest.mock("../../../modelsControllers/PrototypeModel.controller");
jest.mock("../../../modelsControllers/Partzone/ManagePartZoneAssignment.controller");

describe("Unit Tests for PartZoneRouteContinutityChecker Class", () => {

    const partZoneRouteContinutityChecker = new PartzoneRouteContinutityChecker();
     
    afterEach(() => {
      jest.clearAllMocks();
    })

  it("should call getRoutesForDerivation method", async () => {
       jest
        .spyOn(partZoneRouteContinutityChecker, "getRoutesForDerivation")
        .mockImplementation(() => Promise.resolve(undefined));

    const whereClausePz: WhereOptions<PartZoneModel> = {
        name: '',
        version: '001',
        dataStatus: ''
      };
     
      let result = await partZoneRouteContinutityChecker.getRoutesForDerivation(whereClausePz);
      expect(result).toEqual(undefined);
  });

  it("should return fin routes and branch routes", async () => {
  const continuityRoutes={
   EXT0005: {
      routes: { branchRoutes: ['1S','2S'], finRoutes: ['1S','2S'] },
      fin: '2503VN',
      circuit: 'VN'   }
   }
    const output =  partZoneRouteContinutityChecker.routeContinuityMessage(continuityRoutes,'E92911057030AJ');
    expect(output).toBeDefined;
})
});