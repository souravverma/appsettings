import { WhereOptions } from "sequelize";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import UserAreaModel from "../../models/UserAreaPartZone.model";

export default class HarnessUserarea {
  constructor() {}

  /**
   *
   * @param whereClause
   * @param userArea
   * @returns
   */
  public async checkHarnessHasPartZoneOnUserArea(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>,
    userArea: string
  ): Promise<boolean> {
    try {
      const result: Harness3dDesignSolutionModel =
        await Harness3dDesignSolutionModel.findOne({
          where: whereClause,
          include: [
            {
              model: PartZoneModel,
              include: [
                {
                  model: UserAreaModel,
                },
              ],
            },
          ],
        });
      if (
        !result ||
        result.partZone.some((pz) => pz.userArea.name === userArea)
      )
        return false;
      else return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
