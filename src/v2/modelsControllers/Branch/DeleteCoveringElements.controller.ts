import sequelize from "sequelize";
import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import Branch3dModel from "../../models/Branch3d.model";
import PartZoneModel from "../../models/Partzone.model";
import { IBranch3d } from "../../interfaces/mapping.interface";
import CoveringElement3dModel from "../../models/CoveringElement3d.model";

export default class DeleteCoveringElements {
  public async findExistingCoveringElementData(
    branchName: string,
    whereClause: IWhereClauseParent
  ): Promise<CoveringElement3dModel[]> {
    try {
      return await CoveringElement3dModel.findAll({
        include: [
          {
            model: Branch3dModel,
            where: { name: branchName },
            include: [
              {
                model: PartZoneModel,
                where: whereClause.partZone,
              },
            ],
          },
        ],
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * cleanup the data to avoid duplicate data entry
   * @param data
   * @param transaction
   * @param whereClause
   */
  async destroyExistingCoveringElement3dModelData(
    branches: IBranch3d[],
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ) {
    try {
      await Promise.all(
        branches.map(async (branch) => {
          const result = await this.findExistingCoveringElementData(
            branch.name,
            whereClause
          );

          const existingIds: any = result.map(
            (coveringElement: CoveringElement3dModel) => {
              return coveringElement.id;
            }
          );
          return await CoveringElement3dModel.destroy({
            where: { id: existingIds },
            force: true,
          });
        })
      );
    } catch (error) {
      console.log("Error creating Coveringelement3D :", error);
      transaction.rollback();
    }
  }
}
