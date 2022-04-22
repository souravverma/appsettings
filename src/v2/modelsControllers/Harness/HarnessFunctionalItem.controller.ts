import { WhereOptions } from "sequelize";
import CircuitModel from "../../models/Circuit.model";
import FunctionalItemModel from "../../models/FunctionalItem.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import UserAreaModel from "../../models/UserAreaPartZone.model";
import FunctionalItemHarness3dDesignSolutionRelationModel from "../../models/FunctionalItemHarness3dDsRelation.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import AdapLoModel from "../../models/AdapLo.model";

export default class HarnessFunctionalItem {
  constructor() {}

  /**
   * Function to first destroy FunctionalItemHarness3dDesignSolutionRelation and then destroy harness
   * @param harness
   * @param destroyForce
   */
  public async deleteHarness(
    harness: Harness3dDesignSolutionModel,
    destroyForce: boolean
  ): Promise<void> {
    try {
      await FunctionalItemHarness3dDesignSolutionRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_harness_3d_design_solution_id: harness.id,
        },
      });

      await AdapLoModel.destroy({
        force: destroyForce,
        where: {
          fk_harness_3d_ds_id: harness.id,
        },
      });
      console.log(
        "deleted FunctionalItemHarness3dDesignSolutionRelationModel for harness.id = " +
          harness.id
      );
      // Remove harness
      await harness.destroy({ force: destroyForce });
      console.log("deleted harness for harness.id = " + harness.id);
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   *
   * @param whereClause
   * @returns
   */
  public async getHarnessPartZoneWithFin(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      return await Harness3dDesignSolutionModel.findOne({
        where: whereClause,
        include: [
          {
            model: PartZoneModel,
            include: [
              {
                model: FunctionalItem3dSolutionModel,
              },
              {
                model: UserAreaModel,
              },
            ],
          },
          {
            model: FunctionalItemModel,
            include: [
              {
                model: CircuitModel,
                required: false,
                where: { letters: "VB" },
                attributes: ["id", "letters"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
