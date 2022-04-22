import Harness3dDsPzRelationModel from "../../models/Harness3dDsPzRelation.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";

export default class Harness3dDsPzRelation {
  constructor() {}

  /**
   * function to delete HarnessPartzone relation
   * @param harness
   * @param destroyForce
   */
  public async deleteHarness3dDsPzRelationModel(
    harness: Harness3dDesignSolutionModel,
    destroyForce: boolean
  ): Promise<any> {
    try {
      await Harness3dDsPzRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_harness_3d_design_solution_id: harness.id,
        },
      });
      console.log(
        "deleted Harness3dDsPzRelationModel for harness.id = " + harness.id
      );
      return;
    } catch (error) {
      await Promise.reject(error);
    }
  }
}
