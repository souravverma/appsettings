import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import FunctionalItemSolutionPartZoneRelation from "../../models/FunctionalItem3dSolutionPartZoneRelation.model";
import PartZoneModel from "../../models/Partzone.model";
import Backshell3dSolutionController from "../Backshell3dSolution.controller";
import { injectable } from "tsyringe";

@injectable()
export default class DeleteFunctionalItem {
  constructor() {}
  // Function to delete Functional iten  partzone relation
  public async deleteFunctionalItemSolutionPartZoneRelation(
    partZone: PartZoneModel,
    destroyForce: boolean
  ) {
    try {
      await FunctionalItemSolutionPartZoneRelation.destroy({
        force: destroyForce,
        where: {
          fk_part_zone_solution_id: partZone.id,
        },
      });
      console.log(
        "deleted FunctionalItemSolutionPartZoneRelation for partZone.id = " +
          partZone.id
      );
    } catch (error) {
      console.log(
        "Not Deleted FunctionalItemSolutionPartZoneRelation for partZone.id = " +
          partZone.id
      );
    }
  }

  public async deleteFinOfPartZone(
    partZoneFinDs: FunctionalItem3dSolutionModel,
    destroyForce: boolean
  ) {
    await Promise.all(
      partZoneFinDs.backshells.map((backshell) => {
        return Backshell3dSolutionController.deleteBackshell(
          backshell,
          destroyForce
        );
      })
    );
    try {
      await partZoneFinDs.destroy({ force: destroyForce });
      console.log(
        "deleted partZoneFinDs for partZoneFinDs.id = " + partZoneFinDs.id
      );
    } catch (error) {
      console.log(
        "Not Deleted partZoneFinDs for partZoneFinDs.id = " + partZoneFinDs.id
      );
    }
  }
}
