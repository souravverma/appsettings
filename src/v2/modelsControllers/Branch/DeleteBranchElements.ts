import Branch3dEnvironmentRelationModel from "../../models/Branch3dEnvironmentRelation.model";
import RouteBranch3dRelationModel from "../../models/RouteBranch3dRelation.model";
import Branch3dModel from "../../models/Branch3d.model";
import Branch3dCoveringElementSolutionRelationModel from "../../models/Branch3dCoveringElementSolutionRelation.model";
import Branch3dExtremityCoveringElementRelation from "../../models/Branch3dExtremityCoveringElementRelation.model";
import CoveringElement3dModel from "../../models/CoveringElement3d.model";
import BranchPointDefinitionModel from "../../models/BranchPointDefinition.model";
import Branch3dSegmentModel from "../../models/Branch3dSegment.model";
import Branch3dExtremityRelationModel from "../../models/Branch3dExtremityRelation.model";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import Branch3dExtremityFinDsRelationModel from "../../models/Branch3dExtremityFinDsRelation.model";

export default class DeleteBranchElements {
  /**
   * delete the Branch3dCoveringElementSolutionRelationModel for b3d.id
   * @param b3d
   * @param destroyForce
   */
  public async deleteBranch3dCoveringElementSolutionRelationModel(
    b3d: Branch3dModel,
    destroyForce: boolean
  ) {
    try {
      await Branch3dCoveringElementSolutionRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_branch_3d_id: b3d.id,
        },
      });
      console.log(
        "deleted Branch3dCoveringElementSolutionRelationModel for b3d.id = " +
          b3d.id
      );
    } catch (error) {
      console.log(
        "Not Deleted Branch3dCoveringElementSolutionRelationModel for b3d.id = " +
          b3d.id
      );
    }
  }

  /**
   * delete the coveringElement for coveringElement.id
   * @param coveringElement
   * @param destroyForce
   */
  public async deleteCoveringElement(
    coveringElement: CoveringElement3dModel,
    destroyForce: boolean
  ) {
    try {
      await Branch3dExtremityCoveringElementRelation.destroy({
        force: destroyForce,
        where: {
          fk_covering_element_3d_id: coveringElement.id,
        },
      });
      await coveringElement.destroy({ force: destroyForce });
      console.log(
        "deleted coveringElement for coveringElement.id = " + coveringElement.id
      );
    } catch (error) {
      console.log(
        "Not Deleted coveringElement for coveringElement.id = " +
          coveringElement.id
      );
    }
  }

  /**
   * RouteBranch3dRelationModel delete
   * @param b3d
   * @param destroyForce
   */
  public async deleteRouteBranch3dRelationModel(
    b3d: Branch3dModel,
    destroyForce: boolean
  ) {
    try {
      await RouteBranch3dRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_branch_3d_id: b3d.id,
        },
      });
      console.log("deleted RouteBranch3dRelationModel for b3d.id = " + b3d.id);
    } catch (error) {
      console.log(
        "Not Deleted RouteBranch3dRelationModel for b3d.id = " + b3d.id
      );
    }
  }

  /**
   * Branch3dEnvironmentRelationModel delete
   * @param b3d
   * @param destroyForce
   */
  public async deleteBranch3dEnvironmentRelationModel(
    b3d: Branch3dModel,
    destroyForce: boolean
  ) {
    try {
      await Branch3dEnvironmentRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_branch_3d_id: b3d.id,
        },
      });
      console.log(
        "deleted Branch3dEnvironmentRelationModel for b3d.id = " + b3d.id
      );
    } catch (error) {
      console.log(
        "Not Deleted Branch3dEnvironmentRelationModel for b3d.id = " + b3d.id
      );
    }
  }

  /*
   * @description to delete branchPoint model data
   * @param b3dpointDef
   * @param destroyForce
   * @returns
   */
  public async deleteBranchPointDefinitionModel(
    b3dpointDef: BranchPointDefinitionModel,
    destroyForce: boolean
  ): Promise<any> {
    try {
      await b3dpointDef.destroy({ force: destroyForce });
      console.log("deleted b3dpointDef for b3dpointDef.id = " + b3dpointDef.id);
    } catch (error) {
      console.log(
        "Not Deleted b3dpointDef for b3dpointDef.id = " + b3dpointDef.id
      );
    }
  }

  /**
   * function to delete Branch 3d Segments
   * @param segments
   * @param destroyForce
   */
  public async deleteBranch3dSegmentModel(
    segments: Branch3dSegmentModel | Branch3dSegmentModel[],
    destroyForce: boolean
  ) {
    try {
      if (!Array.isArray(segments)) {
        segments = [segments];
      }
      if (segments.length) {
        await Branch3dSegmentModel.destroy({
          force: destroyForce,
          where: {
            id: segments.map((segment: { id: any }) => segment.id),
          },
        });
        console.log(
          "deleted segments for segments.ids = " +
            segments.map((segment: { id: any }) => segment.id)
        );
      }
    } catch {
      console.log("Not Deleted segment");
    }
  }

  /**
   * Branch3dExtremityRelationModel
   * @param b3d
   * @param destroyForce
   */
  public async deleteBranch3dExtremityRelationModel(
    b3d: Branch3dModel,
    destroyForce: boolean
  ) {
    try {
      await Branch3dExtremityRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_branch_3d_id: b3d.id,
        },
      });
      console.log(
        "deleted Branch3dExtremityRelationModel for b3d.id = " + b3d.id
      );
    } catch {
      console.log(
        "Not Deleted Branch3dExtremityRelationModel for b3d.id = " + b3d.id
      );
    }
  }

  /**
   * Deleted branch3DExtremity
   * @param branch3DExtremity
   * @param destroyForce
   */
  public async deleteBranchExtremity(
    branch3DExtremity: Branch3dExtremitySolutionModel,
    destroyForce: boolean
  ) {
    await this.deleteBranch3dExtremityFinDsRelationModel(
      branch3DExtremity,
      destroyForce
    );
    try {
      await branch3DExtremity.destroy({ force: destroyForce });
      console.log(
        "deleted branch3DExtremity for branch3DExtremity.id = " +
          branch3DExtremity.id
      );
    } catch {
      console.log(
        "Not Deleted branch3DExtremity for branch3DExtremity.id = " +
          branch3DExtremity.id
      );
    }
  }

  /**
   * Branch3dExtremityFinDsRelationModel delete
   * @param extremity
   * @param destroyForce
   */
  public async deleteBranch3dExtremityFinDsRelationModel(
    extremity: Branch3dExtremitySolutionModel,
    destroyForce: boolean
  ) {
    try {
      await Branch3dExtremityFinDsRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_branch_3d_extremity_id: extremity.id,
        },
      });
      console.log(
        "deleted Branch3dExtremityFinDsRelationModel for extremity.id = " +
          extremity.id
      );
    } catch {
      console.log(
        "Not Deleted Branch3dExtremityFinDsRelationModel for extremity.id = " +
          extremity.id
      );
    }
  }
}
