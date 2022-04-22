import BranchPointDefinitionModel from "../../../models/BranchPointDefinition.model";
import BranchPointDefinitionController from "../../../modelsControllers/Branch/BranchPointDefinition.controller";

describe("Branch Point Definition Controller", () => {
  const branchPointDefController = new BranchPointDefinitionController();
  it("Branch Point Definition Controller should be defined", () => {
    expect(branchPointDefController).toBeDefined();
  });
  it("Create or Update BranchPoint when inputs are valid - success", () => {
    const data = [
      {
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
      },
      {
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
      },
      {
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        middle: true,
      },
    ];
    const parent: any = {
      id: 81035,
      name: "BRA0001",
      branchId: null,
      diameter3dMm: 4.4,
      bendRadius: 15.4,
      lengthMm: 329.006,
      lengthForcedMm: 0,
      extraLengthMm: 0,
      notExtractible: false,
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt: "2022-02-28T12:01:04.310Z",
      updatedAt: "2022-02-28T12:01:04.310Z",
      deletedAt: null,
      fk_part_zone_solution_id: 4085,
      partZone: {
        id: 4085,
        harness3d: [
          {
            id: 1381,
            Harness3dDsPzRelationModel: {
              id: 19585,
              harness3dDesignSo: 1381,
              partZoneId: 4085,
              pzStatus: null,
            },
          },
        ],
      },
    };
    const branchPointsForBranch: any = [
      {
        id: 14055,
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14057,
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14061,
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        vectorX: null,
        vectorY: null,
        vectorZ: null,
        middle: true,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
    ];
    jest
      .spyOn(BranchPointDefinitionModel, "findAll")
      .mockResolvedValue(Promise.resolve(branchPointsForBranch));
    const result = branchPointDefController.createOrUpdate(data, parent);
    expect(result).toStrictEqual(Promise.resolve());
  });
  it("Create or Update BranchPoint when inputs are different", async () => {
    const data: any = [
      {
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
      },
      {
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
      },
    ];
    const parent: any = {
      id: 81035,
      name: "BRA0001",
      branchId: null,
      diameter3dMm: 4.4,
      bendRadius: 15.4,
      lengthMm: 329.006,
      lengthForcedMm: 0,
      extraLengthMm: 0,
      notExtractible: false,
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt: "2022-02-28T12:01:04.310Z",
      updatedAt: "2022-02-28T12:01:04.310Z",
      deletedAt: null,
      fk_part_zone_solution_id: 4085,
      partZone: {
        id: 4085,
        harness3d: [
          {
            id: 1381,
            Harness3dDsPzRelationModel: {
              id: 19585,
              harness3dDesignSo: 1381,
              partZoneId: 4085,
              pzStatus: null,
            },
          },
        ],
      },
    };
    const branchPointsForBranch: any = [
      {
        id: 14055,
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14057,
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14061,
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        vectorX: null,
        vectorY: null,
        vectorZ: null,
        middle: true,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
    ];
    jest
      .spyOn(BranchPointDefinitionModel, "findAll")
      .mockResolvedValue(Promise.resolve(branchPointsForBranch));
    //unable to mock the destroy function in recreate method
    const myPrivateFunc = jest.spyOn(
      branchPointDefController as any,
      "recreateBranchPoints"
    );
    myPrivateFunc.mockImplementation(() => jest.fn());
    const result = await branchPointDefController.createOrUpdate(data, parent);
    expect(myPrivateFunc).toBeCalled();
    expect(result).toEqual(undefined);
  });

  it("Create or Update BranchPoint when inputs are not same - coordinateX", async () => {
    const data = [
      {
        coordinateX: 7220.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
      },
      {
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
      },
      {
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        middle: true,
      },
    ];
    const parent: any = {
      id: 81035,
      name: "BRA0001",
      branchId: null,
      diameter3dMm: 4.4,
      bendRadius: 15.4,
      lengthMm: 329.006,
      lengthForcedMm: 0,
      extraLengthMm: 0,
      notExtractible: false,
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt: "2022-02-28T12:01:04.310Z",
      updatedAt: "2022-02-28T12:01:04.310Z",
      deletedAt: null,
      fk_part_zone_solution_id: 4085,
      partZone: {
        id: 4085,
        harness3d: [
          {
            id: 1381,
            Harness3dDsPzRelationModel: {
              id: 19585,
              harness3dDesignSo: 1381,
              partZoneId: 4085,
              pzStatus: null,
            },
          },
        ],
      },
    };
    const branchPointsForBranch: any = [
      {
        id: 14055,
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14057,
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14061,
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        vectorX: null,
        vectorY: null,
        vectorZ: null,
        middle: true,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
    ];
    jest
      .spyOn(BranchPointDefinitionModel, "findAll")
      .mockResolvedValue(Promise.resolve(branchPointsForBranch));
    //unable to mock the destroy function in recreate method
    const myPrivateFunc = jest.spyOn(
      branchPointDefController as any,
      "recreateBranchPoints"
    );
    myPrivateFunc.mockImplementation(() => jest.fn());
    const result = await branchPointDefController.createOrUpdate(data, parent);
    expect(result).toEqual(undefined);
    expect(myPrivateFunc).toBeCalled();
  });

  it("Create or Update BranchPoint when inputs are not same - vectorX", async () => {
    const data = [
      {
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
      },
      {
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 0,
        vectorY: 0,
        vectorZ: 0,
      },
      {
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        middle: true,
      },
    ];
    const parent: any = {
      id: 81035,
      name: "BRA0001",
      branchId: null,
      diameter3dMm: 4.4,
      bendRadius: 15.4,
      lengthMm: 329.006,
      lengthForcedMm: 0,
      extraLengthMm: 0,
      notExtractible: false,
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt: "2022-02-28T12:01:04.310Z",
      updatedAt: "2022-02-28T12:01:04.310Z",
      deletedAt: null,
      fk_part_zone_solution_id: 4085,
      partZone: {
        id: 4085,
        harness3d: [
          {
            id: 1381,
            Harness3dDsPzRelationModel: {
              id: 19585,
              harness3dDesignSo: 1381,
              partZoneId: 4085,
              pzStatus: null,
            },
          },
        ],
      },
    };
    const branchPointsForBranch: any = [
      {
        id: 14055,
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14057,
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14061,
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        vectorX: null,
        vectorY: null,
        vectorZ: null,
        middle: true,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
    ];
    jest
      .spyOn(BranchPointDefinitionModel, "findAll")
      .mockResolvedValue(Promise.resolve(branchPointsForBranch));
    //unable to mock the destroy function in recreate method
    const myPrivateFunc = jest.spyOn(
      branchPointDefController as any,
      "recreateBranchPoints"
    );
    myPrivateFunc.mockImplementation(() => jest.fn());
    const result = await branchPointDefController.createOrUpdate(data, parent);
    expect(result).toEqual(undefined);
    expect(myPrivateFunc).toBeCalled();
  });
  it("Create or Update BranchPoint when inputs are not same - Error from DB", async () => {
    const data = [
      {
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
      },
      {
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 0,
        vectorY: 0,
        vectorZ: 0,
      },
      {
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        middle: true,
      },
    ];
    const parent: any = {
      id: 81035,
      name: "BRA0001",
      branchId: null,
      diameter3dMm: 4.4,
      bendRadius: 15.4,
      lengthMm: 329.006,
      lengthForcedMm: 0,
      extraLengthMm: 0,
      notExtractible: false,
      createdBy: "ce-api-harness",
      updatedBy: "ce-api-harness",
      createdAt: "2022-02-28T12:01:04.310Z",
      updatedAt: "2022-02-28T12:01:04.310Z",
      deletedAt: null,
      fk_part_zone_solution_id: 4085,
      partZone: {
        id: 4085,
        harness3d: [
          {
            id: 1381,
            Harness3dDsPzRelationModel: {
              id: 19585,
              harness3dDesignSo: 1381,
              partZoneId: 4085,
              pzStatus: null,
            },
          },
        ],
      },
    };
    const branchPointsForBranch: any = [
      {
        id: 14055,
        coordinateX: 7222.418,
        coordinateY: -718.174,
        coordinateZ: -677.35,
        vectorX: 0.98289,
        vectorY: 0,
        vectorZ: -0.18421,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14057,
        coordinateX: 7331.38,
        coordinateY: -681.133,
        coordinateZ: -595.005,
        vectorX: 1,
        vectorY: 0,
        vectorZ: 0,
        middle: null,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
      {
        id: 14061,
        coordinateX: 7315.011,
        coordinateY: -681.255,
        coordinateZ: -595.124,
        vectorX: null,
        vectorY: null,
        vectorZ: null,
        middle: true,
        pbranch3d: 81035,
        createdBy: "ce-api-harness",
        updatedBy: "ce-api-harness",
        createdAt: "2022-02-28T12:01:04.519Z",
        updatedAt: "2022-02-28T12:01:04.519Z",
        fk_branch_3d_id: 81035,
      },
    ];
    jest
      .spyOn(BranchPointDefinitionModel, "findAll")
      .mockResolvedValue(Promise.resolve(branchPointsForBranch));
    //unable to mock the destroy function in recreate method
    const myPrivateFunc = jest.spyOn(
      branchPointDefController as any,
      "recreateBranchPoints"
    );
    myPrivateFunc.mockImplementation(() => {
      throw new Error("db error");
    });
    await branchPointDefController.createOrUpdate(data, parent).catch((ex) => {
      expect(ex).toEqual(new Error("db error"));
    });
  });
});
