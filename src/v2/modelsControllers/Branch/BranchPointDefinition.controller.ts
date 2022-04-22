import BranchPointDefinitionModel from "../../models/BranchPointDefinition.model";
import PrototypeModelController from "../PrototypeModel.controller";
import Branch3dModel from "../../models/Branch3d.model";
import { IBranch3dPointDefinition } from "../../interfaces/mapping.interface";
import { IncludeOptions } from "sequelize";

export default class BranchPointDefinitionController extends PrototypeModelController {
  static nestedIncludeOptions: IncludeOptions = {
    model: BranchPointDefinitionModel,
    attributes: ["id"],
    paranoid: false,
  };
  protected model: typeof BranchPointDefinitionModel =
    BranchPointDefinitionModel;

  constructor() {
    super();
  }

  /**
   *  Based on the inputs given it will create or update the branchpoints in DB
   * @param data - branch point details from the proptol file
   * @param parent - Branch 3d detailes
   * @returns - empty Promise
   */
  async createOrUpdate(
    data: IBranch3dPointDefinition[],
    parent: Branch3dModel
  ): Promise<any> {
    try {
      // search for all points related to the branch
      const branchPointDefinitionData: BranchPointDefinitionModel[] =
        await BranchPointDefinitionModel.findAll({
          where: { pbranch3d: parent.id },
          order: [["id", "ASC"]],
        });
      const branchPointLength: number = branchPointDefinitionData.length;
      const inputDataLength: number = data.length;
      let SamePoints = true;
      if (branchPointLength === inputDataLength) {
        for (let i = 0; i < branchPointLength; i++) {
          const ele = data[i];
          const branchPoint = branchPointDefinitionData[i];
          if (
            Math.abs(ele.coordinateX - branchPoint.coordinateX) > 1e-5 ||
            Math.abs(ele.coordinateY - branchPoint.coordinateY) > 1e-5 ||
            Math.abs(ele.coordinateZ - branchPoint.coordinateZ) > 1e-5
          ) {
            SamePoints = false;
          }
          if (
            (!ele.hasOwnProperty("middle") ||
              ele.middle === false ||
              ele.middle === null) &&
            SamePoints === true
          ) {
            if (
              Math.abs(ele.vectorX - branchPoint.vectorX) > 1e-5 ||
              Math.abs(ele.vectorY - branchPoint.vectorY) > 1e-5 ||
              Math.abs(ele.vectorZ - branchPoint.vectorZ) > 1e-5
            ) {
              SamePoints = false;
            }
          }
          if (!SamePoints) {
            break;
          }
        }
      }
      if (!SamePoints || branchPointLength !== inputDataLength) {
        await this.recreateBranchPoints(
          branchPointDefinitionData,
          data,
          parent
        );
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * It will clear the data in db & recreate it
   * @param branchPoints
   * @param inputData
   * @param parent
   */
  private async recreateBranchPoints(
    branchPoints: BranchPointDefinitionModel[],
    inputData: IBranch3dPointDefinition[],
    parent: Branch3dModel
  ) {
    await Promise.all(
      branchPoints.map(async (branchPoint) => {
        await branchPoint.destroy();
      })
    );
    console.log(parent.name + " -delete points: " + branchPoints.length);

    // store the input points
    const bulkable_points: IBranch3dPointDefinition[] = inputData.map(
      (branchPoint) => {
        return { ...branchPoint, fk_branch_3d_id: parent.id };
      }
    );

    console.log(parent.name + " -create points: " + bulkable_points.length);
    // creation of the points in bulk mode
    if (bulkable_points.length) await this.model.bulkCreate(bulkable_points);
  }
}
