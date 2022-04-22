import { Op } from "sequelize";
import PartZoneModel from "./../models/Partzone.model";
import Harness3dDesignSolutionModel from "./../models/Harness3dDesignSolution.model";
import Branch3dController from "./Branch/Branch3d.controller";
import DeleteFunctionalItem from "./FunctionalItem/DeleteFunctionalItem.controller";
import HarnessConsistencyController from "./Harness/HarnessConsistency.controller";
import PartZoneController from "../modelsControllers/Partzone/PartZone.controller";
import { IadapDsVersionIssue } from "./../interfaces/mapping.interface";
import PartZoneRelatedHarness from "../modelsControllers/Partzone/PartZoneRelatedHarness.controller";
import DeletePartZone from "../modelsControllers/Partzone/DeletePartzone.controller";
import HarnessHelper from "./Harness/HarnessHelper.controller";
import Harness3dDsPzRelation from "./Harness/HarnessDSPZRelation.controller";
import HarnessFunctionalItem from "./Harness/HarnessFunctionalItem.controller";
import Harness3dDsPzRelationModel from "../models/Harness3dDsPzRelation.model";
import AdapLo from "../modelsControllers/SynchronizeAPS/AdapLo/AdapLo";
import { container } from "tsyringe";
import AdapLoModel from "../models/AdapLo.model";
import AdapItemModel from "../models/AdapItem.model";
import { IHarness3dDesignSolutionModel } from "../interfaces/IHarness3dDesignSolutionModel.interface";
import PartzoneItemModel from "../models/PartzoneItem.model";
import { IPartZoneItemModel } from "../interfaces/IPartZoneItemModel.interface";
import { IAdapItemModel } from "../interfaces/IAdapItemModel.interface";
import { IPartZoneModel } from "../interfaces/IPartZoneModel.interface";

export default class SwaggerController {
  deleteFunctionalItem = new DeleteFunctionalItem();
  pzrelatedHarness = container.resolve(PartZoneRelatedHarness);
  deletePartZone = new DeletePartZone();

  /**
   * @desc Delete Partzone content of a List of Partzones from swagger
   * @param partZones
   * @param destroyForce
   * @returns
   */
  public async deletePartzoneContentFromSwagger(
    partZones: any,
    destroyForce: boolean
  ): Promise<any> {
    return await Promise.all(
      partZones.map(async (pz: PartZoneModel) => {
        try {
          let partZone: PartZoneModel;
          if (pz.version == "LAST") {
            const partZoneId = await PartZoneModel.findOne({
              attributes: ["id"],
              where: { name: pz.name, version: pz.version },
              order: [["version", "DESC NULLS LAST"]],
            });
            partZone = await PartZoneModel.findOne({
              where: {
                id: partZoneId.id,
              },
              attributes: PartZoneController.nestedIncludeOptions.attributes,
              include: PartZoneController.nestedIncludeOptions.include,
            });
          } else if (!pz.version) {
            partZone = await PartZoneModel.findOne({
              where: {
                name: pz.name,
                version: { [Op.is]: null },
              },
              attributes: PartZoneController.nestedIncludeOptions.attributes,
              include: PartZoneController.nestedIncludeOptions.include,
            });
          } else {
            partZone = await PartZoneModel.findOne({
              where: {
                name: pz.name,
                version: pz.version,
              },
              attributes: PartZoneController.nestedIncludeOptions.attributes,
              include: PartZoneController.nestedIncludeOptions.include,
            });
          }
          return this.deletePartzoneAndCheckConsistency(
            partZone,
            destroyForce,
            pz
          );
        } catch (err) {
          return err;
        }
      })
    );
  }

  /**
   * @desc Delete Partzone content and Recalculate consistency check
   * @param partZone
   * @param destroyForce
   * @param inputPartZone
   * @returns  Promise<String>
   */
  public async deletePartzoneAndCheckConsistency(
    partZone: PartZoneModel,
    destroyForce: boolean,
    inputPartZone: PartZoneModel
  ): Promise<String> {
    try {
      if (partZone) {
        console.log(
          "--------------------- starting partzone content deletion ---------------------" +
            partZone.name
        );
        await this.deletePartZone.deleteFinPartZoneRouteRelation(
          partZone,
          destroyForce
        );
        await this.deleteFunctionalItem.deleteFunctionalItemSolutionPartZoneRelation(
          partZone,
          destroyForce
        );
        await Promise.all([
          ...partZone.finDs.map((partZoneFinDs) => {
            return this.deleteFunctionalItem.deleteFinOfPartZone(
              partZoneFinDs,
              destroyForce
            );
          }),
          ...partZone.b3d.map((b3d) => {
            return Branch3dController.deleteBranch(b3d, destroyForce);
          }),
        ]);
        console.log(
          "--------------------- ending partzone content deletion ---------------------" +
            partZone.name
        );
        await partZone.update({ dataStatus: "waiting_data" });
        const routeContinuityMessage = {
          consolidationStatus: "N/A",
          consolidationMessage: "Route continuity check not applicable!",
        };
        await partZone.update(routeContinuityMessage);
        const relatedHarnessList =
          await this.pzrelatedHarness.getPartzoneRelatedToHarness(
            partZone.name,
            "",
            partZone.version
          );
        // Check Harness consistency
        const harnessConsistencyController = new HarnessConsistencyController();
        relatedHarnessList.forEach((harness: any) => {
          const adapDsData: IadapDsVersionIssue = {
            adapDesignSolutionNumber: harness.adapDesignSolutionNumber,
            adapDesignSolutionVersionNumber:
              harness.adapDesignSolutionVersionNumber,
            adapDesignSolutionIssueNumber:
              harness.adapDesignSolutionIssueNumber,
            dataStatus: harness.dataStatus,
          };
          harnessConsistencyController.harnessConsistencyCheck(adapDsData);
        });
        return `PartzoneContent deleted successfully for ${partZone.name} with version ${partZone.version} !!`;
      } else {
        return `Error deleting  ${JSON.stringify(inputPartZone).replace(
          /\"/g,
          ""
        )} . Please check parameters again!!`;
      }
    } catch (err) {
      return `Error deleting Partzone!!`;
    }
  }

  /**
   * @desc Destroy every entries related to a given harness.
   * @param {string} [adapDsNumber] If empty destroy all harnesses and every entries related
   * @param {false} [destroyForce] false == soft delete | true == delete forever
   * @returns {Promise<Harness3dDesignSolutionModel[]>}
   * @memberof Harness3dDesignSolutionController
   */
  public deleteHarnessFromSwagger(
    adapDsNumber?: string,
    adapDsVersionNumber?: string,
    destroyForce = false
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const helper = new HarnessHelper();
      const harnessDsPzRelation = new Harness3dDsPzRelation();
      const harnessFunctionalItem = new HarnessFunctionalItem();
      const partZoneRelatedHarness = container.resolve(PartZoneRelatedHarness);
      const adapLo = new AdapLo();
      const whereClause = helper.createWhereClause(
        adapDsNumber,
        adapDsVersionNumber
      );
      try {
        const harnesses = await helper.findHarnessesToDelete(whereClause);
        if (harnesses.length) {
          await Promise.all(
            harnesses.map(async (harness) => {
              await harnessDsPzRelation.deleteHarness3dDsPzRelationModel(
                harness,
                destroyForce
              );
              await adapLo.unlinkAdapLoDs(harness.id, destroyForce);
              await Promise.all(
                harness.partZone.map((partZone) => {
                  return partZoneRelatedHarness
                    .isPartZoneLinkedToOtherHarness(partZone)
                    .then(async (pzLinked) => {
                      await Harness3dDsPzRelationModel.destroy({
                        force: true,
                        where: {
                          fk_part_zone_solution_id: partZone.id,
                        },
                      });
                      await this.deletePartZone.deleteAdapDsRelation(
                        partZone,
                        true
                      );
                      if (pzLinked) {
                        await this.deletePartZone.unlinkOtherPartzones(
                          partZone
                        );
                      } else {
                        await this.deletePartZone.deletePartZone(
                          partZone,
                          destroyForce
                        );
                      }
                    });
                })
              );
              return await harnessFunctionalItem.deleteHarness(
                harness,
                destroyForce
              );
            })
          );
          resolve("Deleted with success !");
        } else {
          resolve("Nothing to delete !");
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  /**
   * updates the 2D and 3D Data For PartZones
   * @returns
   */
  public async update2Dand3DDataForPartZones() {
    try {
      const partZones: PartZoneModel[] = await PartZoneModel.findAll({
        paranoid: false,
      });
      const regex2D = /^[DE]92[0|9|S]2([A-Z0-9]{7}|[A-Z0-9]{9})$/;
      const regex3D =
        /^[DE]((92[A-RT-Z1-8]2)|(92[0|9|S]([A-Z0-1|3-9]))|(92[A-RT-Z1-8]([A-Z0-1|3-9])))([A-Z0-9]{7}|[A-Z0-9]{9})$/;

      return Promise.all(
        partZones.map(async (pz) => {
          if (new RegExp(regex3D).test(pz.name)) {
            await PartZoneModel.update({ dataType: "3D" } as any, {
              where: {
                name: pz.name,
              },
            });
          } else if (new RegExp(regex2D).test(pz.name)) {
            await PartZoneModel.update({ dataType: "2D" } as any, {
              where: {
                name: pz.name,
              },
            });
          }
        })
      );
    } catch (error) {
      return `Error adding Partzone 3D data!!`;
    }
  }

  /**
   * update the DS with2D and 3D Data
   * @returns
   */
  public async updateDS2Dand3DData() {
    try {
      const designSolutions: Harness3dDesignSolutionModel[] =
        await Harness3dDesignSolutionModel.findAll();
      const regex2D = /^[DE]92[0|9|S]2([A-Z0-9]{7}|[A-Z0-9]{9})$/;
      const regex3D =
        /^[DE]((92[A-RT-Z1-8]2)|(92[0|9|S]([A-Z0-1|3-9]))|(92[A-RT-Z1-8]([A-Z0-1|3-9])))([A-Z0-9]{7}|[A-Z0-9]{9})$/;

      return Promise.all(
        designSolutions.map(async (ds) => {
          if (new RegExp(regex3D).test(ds.adapDesignSolutionNumber)) {
            await Harness3dDesignSolutionModel.update(
              { dataType: "3D" } as any,
              {
                where: {
                  adapDesignSolutionNumber: ds.adapDesignSolutionNumber,
                },
              }
            );
          } else if (new RegExp(regex2D).test(ds.adapDesignSolutionNumber)) {
            await Harness3dDesignSolutionModel.update(
              { dataType: "2D" } as any,
              {
                where: {
                  adapDesignSolutionNumber: ds.adapDesignSolutionNumber,
                },
              }
            );
          }
        })
      );
    } catch (error) {
      return `Error adding Design Solution 3D data!!`;
    }
  }

  /**
   * get adapds adapLo links by adapCi Id
   * @param adapCiId
   * @returns
   */
  public async getAdapDsLoLinkByAdapCiId(
    adapCiId: string
  ): Promise<IAdapItemModel[]> {
    try {
      const adapCi = await AdapItemModel.findAll({
        where: {
          number: adapCiId,
        },
        include: [
          {
            model: PartzoneItemModel,
          },
          {
            model: AdapLoModel,
            include: [
              {
                model: Harness3dDesignSolutionModel,
              },
            ],
          },
        ],
      });
      return adapCi;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * get partzone ds adap ci links by partzone Ci Id
   * @param pzCiId
   * @returns
   */
  public async getPzDsAdapCiLinkByPzCiId(
    pzCiId: string
  ): Promise<IPartZoneItemModel[]> {
    try {
      const adapCi = await PartzoneItemModel.findAll({
        where: {
          number: pzCiId,
        },
        include: [
          {
            model: PartZoneModel,
            include: [
              {
                model: Harness3dDesignSolutionModel,
                include: [
                  {
                    model: AdapLoModel,
                    include: [
                      {
                        model: Harness3dDesignSolutionModel,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      return adapCi;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * get adapCi adapLo links by adapDsId
   * @param adapDsId
   * @returns
   */
  public async getAdapCiLOLinkByAdapDsId(
    adapDsId: string
  ): Promise<IHarness3dDesignSolutionModel[]> {
    try {
      const adapCi = await Harness3dDesignSolutionModel.findAll({
        where: {
          adapDesignSolutionNumber: adapDsId,
        },
        include: [
          {
            model: AdapLoModel,
            include: [
              {
                model: AdapItemModel,
              },
            ],
          },
        ],
      });
      return adapCi;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * get pzCi linked pzDs Id
   * @param pzDsName
   * @returns
   */
  public async getPzCiLinkByPzDsId(
    pzDsName: string
  ): Promise<IPartZoneModel[]> {
    try {
      const pzCi = await PartZoneModel.findAll({
        where: {
          name: pzDsName,
        },
        include: [
          {
            model: PartzoneItemModel,
          },
        ],
      });
      return pzCi;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
