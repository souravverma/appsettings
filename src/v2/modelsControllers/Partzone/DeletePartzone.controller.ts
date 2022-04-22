import Harness3dDsPzRelationModel from "../../models/Harness3dDsPzRelation.model";
import FinPartZoneRouteRelation from "../../models/FinPartZoneRouteRelation.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import Branch3dController from "../Branch/Branch3d.controller";
import DeleteFunctionalItem from "../FunctionalItem/DeleteFunctionalItem.controller";
import PartZoneController from "./PartZone.controller";
import PartZoneRelatedHarness from "./PartZoneRelatedHarness.controller";
import { container, injectable } from "tsyringe";
import ModificationProposalPzSolutionRelationModel from "../../models/ModificationProposalPzSolutionRelation";
import PartzoneItemModel from "../../models/PartzoneItem.model";
import AdapItemPartzoneItemRelationModel from "../../models/AdapItemPartzoneItemRelation.model";

@injectable()
export default class DeletePartZone {
  private pzrelatedHarness: PartZoneRelatedHarness;
  private deleteFunctionalItem: DeleteFunctionalItem;
  /**
   *
   */
  constructor() {
    this.pzrelatedHarness = container.resolve(PartZoneRelatedHarness);
    this.deleteFunctionalItem = container.resolve(DeleteFunctionalItem);
  }

  /**
   * destroyAllPartzones, if partzone linked to other harness
   * @returns
   */
  public async destroyAllPartzones(): Promise<any> {
    let unlinkedPartzone = false;
    // const partzoneList = await findAll()
    const partzoneList = await PartZoneModel.findAll({
      include: [
        {
          model: Harness3dDesignSolutionModel,
          attributes: ["id"],
        },
      ],
    });

    return new Promise((resolve, reject) => {
      return Promise.all(
        partzoneList.map(async (partzone: PartZoneModel) => {
          const pzLinkedToOtherHarness =
            await this.pzrelatedHarness.isPartZoneLinkedToOtherHarness(
              partzone
            );
          if (!pzLinkedToOtherHarness) {
            partzone = await PartZoneModel.findOne({
              where: {
                id: partzone.id,
              },
              attributes: PartZoneController.nestedIncludeOptions.attributes,
              include: PartZoneController.nestedIncludeOptions.include,
            });
            await this.deletePartZone(partzone, true);
            console.log(`Part zone :: ${partzone.name} has been deleted.`);
            unlinkedPartzone = true;
          }
        })
      )
        .then(() => {
          if (unlinkedPartzone)
            resolve("All unlinked partzones deleted with success!!");
          else resolve("No unlinked partzones for deletion!!");
        })
        .catch((err: Error) => reject(err));
    });
  }

  /**
   *
   * @param partZoneDeletionList
   * @returns
   */
  public destroyPartzoneList(partZoneDeletionList: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const partzoneList = await PartZoneModel.findAll({
        where: {
          name: partZoneDeletionList,
        },
      });
      return Promise.all(
        partzoneList.map(async (pz: any) => {
          const pzLinkedToOtherHarness =
            await this.pzrelatedHarness.isPartZoneLinkedToOtherHarness(pz);
          if (!pzLinkedToOtherHarness) {
            const partzone = await PartZoneModel.findOne({
              where: {
                id: pz.id,
              },
              attributes: PartZoneController.nestedIncludeOptions.attributes,
              include: PartZoneController.nestedIncludeOptions.include,
            });
            await this.deletePartZone(partzone, true);
            console.log(`Part zone :: ${partzone.name} has been deleted.`);
          }
        })
      )
        .then(() => resolve())
        .catch((err: Error) => reject(err));
    });
  }

  /**
   * Delete specific partzone selected in UI
   * @param partZoneDeletionList
   * @param destroyForce
   */
  public async deletePartzoneList(partZoneData: any, destroyForce: boolean) {
    try {
      const harness = await Harness3dDesignSolutionModel.findOne({
        where: {
          adapDesignSolutionNumber: partZoneData.adapDsNumber,
          adapDesignSolutionVersionNumber: partZoneData.adapDsVersion,
          adapDesignSolutionIssueNumber: partZoneData.adapDsIssue,
        },
      });
      if (
        partZoneData.deletedPartZones.length === 0 &&
        partZoneData.deleatedPz.length > 0
      ) {
        partZoneData.deletedPartZones = partZoneData.deleatedPz;
      }
      await Promise.all(
        partZoneData.deletedPartZones.map(async (pzData: PartZoneModel) => {
          const partzone: PartZoneModel = await PartZoneModel.findOne({
            where: {
              name: pzData.name,
              version: pzData.version,
            },
          });
          const pzLinkedToOtherHarness: Harness3dDsPzRelationModel[] =
            await Harness3dDsPzRelationModel.findAll({
              where: {
                fk_part_zone_solution_id: partzone.id,
              },
            });
          await Harness3dDsPzRelationModel.destroy({
            force: destroyForce,
            where: {
              fk_part_zone_solution_id: partzone.id,
              fk_harness_3d_design_solution_id: harness.id,
            },
          });
          await this.deleteAdapDsRelation(partzone, destroyForce);
          if (pzLinkedToOtherHarness.length < 2) {
            const identifiedPZs: PartZoneModel = await PartZoneModel.findOne({
              where: {
                id: partzone.id,
              },
              attributes: PartZoneController.nestedIncludeOptions.attributes,
              include: PartZoneController.nestedIncludeOptions.include,
            });
            await this.deletePartZone(identifiedPZs, true);
          }
          return Promise.resolve();
        })
      );
    } catch (error) {
      console.log(`Partzone deletion error. ---> ${error}`);
    }
  }

  public async deletePartzoneByName(name: string, version?: string) {
    try {
      if (
        !name.startsWith("E928") &&
        !name.startsWith("E929") &&
        !name.startsWith("D928") &&
        !name.startsWith("D929")
      ) {
        return Promise.reject({ message: "Partzone can't be deleted" });
      }

      const whereClause: any = { name };
      if (version) {
        whereClause.version = version;
      }
      const partzones: PartZoneModel[] = await PartZoneModel.findAll({
        where: whereClause,
      });

      const partZoneFreezed = partzones.find(
        (partzone) => partzone.dataStatus === "frozen"
      );

      if (partZoneFreezed) {
        return Promise.reject({ message: "Frozen PZ not deleted" });
      }

      await Promise.all(
        partzones.map(async (partzone) => {
          await Harness3dDsPzRelationModel.destroy({
            force: true,
            where: {
              fk_part_zone_solution_id: partzone.id,
            },
          });
          await this.deleteAdapDsRelation(partzone, true);

          const identifiedPZs: PartZoneModel = await PartZoneModel.findOne({
            where: {
              id: partzone.id,
            },
            attributes: PartZoneController.nestedIncludeOptions.attributes,
            include: PartZoneController.nestedIncludeOptions.include,
          });
          return await this.deletePartZone(identifiedPZs, true);
        })
      );
      return Promise.resolve({ success: "Deleted" });
    } catch (error) {
      console.log(`Partzone deletion error. ---> ${error}`);
    }
  }

  /**
   * Delete Finpartzone route relation
   * @param partZone
   * @param destroyForce
   */
  public async deleteFinPartZoneRouteRelation(
    partZone: PartZoneModel,
    destroyForce: boolean
  ) {
    if (partZone.finDs) {
      const finDs = JSON.parse(JSON.stringify(partZone?.finDs));
      await FinPartZoneRouteRelation.destroy({
        force: destroyForce,
        where: {
          fk_fin_part_zone_id: finDs?.map(
            (e: any) => e.FunctionalItemSolutionPartZoneRelation.id
          ),
        },
      });
    }
  }

  /**
   *
   * @param partZone
   * @param destroyForce
   */
  public async deletePartZone(partZone: PartZoneModel, destroyForce: boolean) {
    await this.deleteFinPartZoneRouteRelation(partZone, destroyForce);
    await this.deleteFunctionalItem.deleteFunctionalItemSolutionPartZoneRelation(
      partZone,
      destroyForce
    );
    await Promise.all([
      ...(partZone?.b3d?.map((b3d) => {
        return Branch3dController.deleteBranch(b3d, destroyForce);
      }) || []),
      ...(partZone?.finDs?.map((partZoneFinDs) => {
        return this.deleteFunctionalItem.deleteFinOfPartZone(
          partZoneFinDs,
          destroyForce
        );
      }) || []),
    ]);
    await this.unlinkOtherPartzones(partZone);
    await partZone.destroy({
      force: destroyForce,
    });
  }

  /**
   *
   * @param partZone
   */
  public async unlinkOtherPartzones(partZone: PartZoneModel) {
    const linkedPzs = await PartZoneModel.findAll({
      where: {
        fk_origin_id: partZone.id,
      },
    });
    await Promise.all(
      linkedPzs.map((pz) => {
        return pz.$set("origin", null);
      })
    );
  }

  public async deleteAdapDsRelation(
    partzone: PartZoneModel,
    destroyForce: boolean
  ): Promise<void> {
    const modificationProposal =
      await ModificationProposalPzSolutionRelationModel.findOne({
        where: {
          partzone: partzone.id,
        },
      });
    if (modificationProposal) {
      await ModificationProposalPzSolutionRelationModel.destroy({
        force: destroyForce,
        where: {
          partzone: partzone.id,
        },
      });
    }

    const partzoneItem = await PartzoneItemModel.findOne({
      where: {
        fk_part_zone_solution_id: partzone.id,
      },
    });
    if (partzoneItem) {
      await AdapItemPartzoneItemRelationModel.destroy({
        force: destroyForce,
        where: {
          fk_pz_item_id: partzoneItem.id,
        },
      });
      await PartzoneItemModel.destroy({
        force: destroyForce,
        where: {
          id: partzoneItem.id,
        },
      });
    }
  }

  // clean(): Promise<void> {
  //     return new Promise((resolve, reject) => {
  //         return Promise.all(this.collection.map(async (partzone: PartZoneModel) => {
  //             // to check if partzone linked to other harness
  //             const pzLinkedToOtherHarness = await this.pzrelatedHarness.isPartZoneLinkedToOtherHarness(partzone);
  //             if (!pzLinkedToOtherHarness) {
  //                 partzone = await PartZoneModel.findOne({
  //                     where: {
  //                         id: partzone.id
  //                     },
  //                     attributes: PartZoneController.nestedIncludeOptions.attributes,
  //                     include: PartZoneController.nestedIncludeOptions.include,
  //                 });
  //                 await this.deletePartZone(partzone, true);
  //                 console.log(`Part zone :: ${partzone.name} has been deleted.`);
  //             }
  //         }))
  //             .then(() => resolve())
  //             .catch((err: Error) => reject(err));
  //     });
  // }
}
