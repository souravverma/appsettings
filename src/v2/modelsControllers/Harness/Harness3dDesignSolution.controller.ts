/**
 * Harness3dDesignSolutionController, used to find create and updated Harness Design Solutions
 **/
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PrototypeModelController from "../PrototypeModel.controller";
import {
  IHarness3dDesignSolution,
  IMajorComponentAssembly,
} from "../../interfaces/mapping.interface";
import MajorComponentAssemblyController from "../MajorComponentAssembly.controller";
import * as GlobalEnums from "../../ConfigurationFiles/GlobalEnums";
import HarnessHelper from "./HarnessHelper.controller";
import HarnessFunctionalItem from "./HarnessFunctionalItem.controller";
import Harness3dDsPzRelation from "./HarnessDSPZRelation.controller";
import PartZoneRelatedHarness from "../Partzone/PartZoneRelatedHarness.controller";
import DeletePartZone from "../Partzone/DeletePartzone.controller";
import sequelize from "sequelize";
import { container } from "tsyringe";
export default class Harness3dDesignSolutionController extends PrototypeModelController {
  protected model: typeof Harness3dDesignSolutionModel =
    Harness3dDesignSolutionModel;
  protected collection: Harness3dDesignSolutionModel[];
  helper = new HarnessHelper();
  harnessDsPzRelation = new Harness3dDsPzRelation();
  harnessFunctionalItem = new HarnessFunctionalItem();
  partZoneRelatedHarness = container.resolve(PartZoneRelatedHarness);
  deletePartZone = new DeletePartZone();

  constructor() {
    super();
  }

  /*** Search for Harness3dDesignSolutionModel in database
   * @returns Collection of Harness3dDesignSolutionModel
   */
  async findAll(): Promise<Harness3dDesignSolutionModel[]> {
    try {
      this.collection = await this.model.findAll();
      return this.collection;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *  harnessData will be defined unless modify version and issue
   * @param harnessData
   * @returns
   */
  public async findHarness(
    harnessData: any
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      if (harnessData) {
        const whereClause = {
          adapDesignSolutionNumber: harnessData.adapDesignSolutionNumber,
          adapDesignSolutionVersionNumber:
            harnessData.adapDesignSolutionVersionNumber,
        };
        return await this.model.findOne({ where: whereClause });
      }
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  public async findExistingHarness(
    harnessData: any
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      if (harnessData) {
        const whereClause = {
          adapDesignSolutionNumber: harnessData.adapDesignSolutionNumber,
          adapDesignSolutionVersionNumber: harnessData.oldAdapDsVersionNumber,
          adapDesignSolutionIssueNumber: harnessData.oldAdapDsIssueNumber,
        };
        return await this.model.findOne({ where: whereClause });
      }
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Creating Harness
   * @param harnessData
   * @param majorComponentAssembly
   * @param transaction
   * @returns
   */
  public async createOrUpdate(
    harnessData: IHarness3dDesignSolution,
    majorComponentAssembly: IMajorComponentAssembly,
    transaction: sequelize.Transaction
  ): Promise<any> {
    try {
      console.log("Creating Harness ... ");
      const majorController: MajorComponentAssemblyController =
        new MajorComponentAssemblyController();
      let harness: Harness3dDesignSolutionModel;
      await this.findAll();
      if (
        harnessData.oldAdapDsVersionNumber &&
        harnessData.oldAdapDsIssueNumber
      ) {
        harness = await this.findExistingHarness(harnessData);
      } else {
        harness = await this.findHarness(harnessData);
      }
      if (harness) {
        if (!this.ObjectIncluded(harnessData, harness)) {
          harness = await harness.update(harnessData);
        }
      } else {
        if (harnessData.psSynchroStatus == null) {
          harnessData.psSynchroStatus = "WARNING";
        }
        this.helper.update2D3DDataForHarness(harnessData);
        harness = await this.model.create(harnessData);
      }

      if (harnessData.fromPZM) {
        await harness.$set(GlobalEnums.ComponentsEnum.PARTZONE, null);
        return await majorController.createOrUpdate(
          majorComponentAssembly.name,
          harness
        );
      }
      if (harnessData.oldAdapDsVersionNumber) {
        this.updateCollection(harness);
      } else {
        this.addToCollection(harness);
      }

      return await majorController.createOrUpdate(
        majorComponentAssembly.name,
        harness
      );
    } catch (error) {
      console.log("Error creating Harness :", error);
      transaction.rollback();
      return Promise.reject(error);
    }
  }

  /**
   * @desc Destroy every entries related to a given harness.
   * @param {string} [adapDsNumber] If empty destroy all harnesses and every entries related
   * @param {false} [destroyForce] false == soft delete | true == delete forever
   * @returns {Promise<Harness3dDesignSolutionModel[]>}
   * @memberof Harness3dDesignSolutionController
   */
  public deleteAllFromHarness(
    adapDsNumber?: string,
    adapDsVersionNumber?: string,
    destroyForce = false
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const whereClause = this.helper.createWhereClause(
        adapDsNumber,
        adapDsVersionNumber
      );
      try {
        const harnesses = await this.helper.findHarnessesToDelete(whereClause);
        if (harnesses.length) {
          await Promise.all(
            harnesses.map((harness) => {
              return this.harnessDsPzRelation
                .deleteHarness3dDsPzRelationModel(harness, destroyForce)
                .then(() => {
                  return Promise.all(
                    harness.partZone.map((partZone) => {
                      return this.partZoneRelatedHarness
                        .isPartZoneLinkedToOtherHarness(partZone)
                        .then(async (pzLinked) => {
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
                          await this.harnessFunctionalItem.deleteHarness(
                            harness,
                            destroyForce
                          );
                        });
                    })
                  );
                });
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
}
