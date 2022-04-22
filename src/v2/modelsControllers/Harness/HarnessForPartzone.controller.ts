import { Op } from "sequelize";
import { DataStatusEnum } from "../../ConfigurationFiles/GlobalEnums";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import UserAreaModel from "../../models/UserAreaPartZone.model";
import { injectable } from "tsyringe";

@injectable()
export default class HarnessForPartZone {
  constructor() {}

  /**
   *  We get all Harnesses linked to the PartZone
   * @param where
   */
  public async getAllHarnessesForPartZone(
    where: any
  ): Promise<Harness3dDesignSolutionModel[]> {
    try {
      return await Harness3dDesignSolutionModel.findAll({
        where: {
          dataStatus: {
            [Op.not]: DataStatusEnum.FROZEN,
          },
        },
        include: [
          {
            model: PartZoneModel,
            where: where,
            required: true,
            include: [
              {
                model: UserAreaModel,
              },
            ],
          },
        ],
      });
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * CHECK: We search if this founded Harness is already exist (we get also User Area)
   * @returns
   * @param harnessName
   */
  public async checkHarnessForPartzoneExists(
    harnessName: string
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      return await Harness3dDesignSolutionModel.findOne({
        where: {
          adapDesignSolutionNumber: harnessName,
          dataStatus: {
            [Op.not]: DataStatusEnum.FROZEN,
          },
        },
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
    } catch (error) {
      await Promise.reject(error);
    }
  }
}
