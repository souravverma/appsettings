import {
  IMappedData,
  IPartZoneManagerData,
} from "../interfaces/mapping.interface";
import ModelsFactoryController from "../modelsControllers/ModelsFactory.controller";
import HarnessDictionaryService from "../services/HarnessDictionnary.service";
import HarnessConsistencyController from "../modelsControllers/Harness/HarnessConsistency.controller";
import { IconfigFile } from "../interfaces/Processing.interface";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import * as GlobalEnums from "../ConfigurationFiles/GlobalEnums";
import "reflect-metadata";
import { container, injectable } from "tsyringe";
import database from "../../database";
import HarnessHelper from "../modelsControllers/Harness/HarnessHelper.controller";
/**
 * @description Master controller
 * @param {Model} model
 */

@injectable()
export default class CreationController {
  private _factory: ModelsFactoryController;
  private harnessHelper: HarnessHelper;
  private harnessConsistencyController: HarnessConsistencyController;

  constructor(
    harness: HarnessHelper,
    harnessConsistency: HarnessConsistencyController
  ) {
    this.harnessHelper = harness;
    this.harnessConsistencyController = harnessConsistency;
  }
  /**
   *  We can create the Partzone with all related links
   * @param mappedData
   * @param configFile
   * @param partZoneDeletionList
   * @returns
   */
  public async createComponents(
    isProptoolData: boolean,
    mappedData?: IMappedData | IPartZoneManagerData,
    configFile?: IconfigFile,
    partZoneDeletionList?: string[]
  ): Promise<void> {
    try {
      console.log("*** Start DS creation ***");
      const begin = Date.now();
      this._factory = container.resolve(ModelsFactoryController);
      this._factory.setWhereClause(configFile, mappedData);
      this._factory.updatePartZoneDeletionList(partZoneDeletionList);
      await this.factoryCreateComponents(isProptoolData, mappedData);
      if (!this._factory.isFromPZM(mappedData)) {
        console.log(
          `Total time taken for the upload of the proptool file: ${
            (Date.now() - begin) / 1000
          }s`
        );
      } else {
        const harnessDictionary: HarnessDictionaryService =
          new HarnessDictionaryService();

        this.extractToDictionary(
          mappedData.harness3dDesignSolution,
          harnessDictionary
        );
        const harnessConsistencyController: HarnessConsistencyController =
          new HarnessConsistencyController();
        await harnessConsistencyController.harnessConsistencyCheck({
          adapDesignSolutionNumber:
            mappedData.harness3dDesignSolution.adapDesignSolutionNumber,
          adapDesignSolutionVersionNumber:
            mappedData.harness3dDesignSolution.adapDesignSolutionVersionNumber,
          adapDesignSolutionIssueNumber:
            mappedData.harness3dDesignSolution.adapDesignSolutionIssueNumber,
        });
        console.log("*** End of DS creation ***");
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Add entry to the dictionary
   * @param relatedHarnessList
   * @param harnessDictionary
   */
  public extractToDictionary(
    harness: any,
    harnessDictionary: HarnessDictionaryService
  ) {
    harnessDictionary.addEntry({
      adapDesignSolutionNumber: harness.adapDesignSolutionNumber,
      adapDesignSolutionVersionNumber: harness.adapDesignSolutionVersionNumber,
      adapDesignSolutionIssueNumber: harness.adapDesignSolutionIssueNumber,
      dataStatus: harness.dataStatus,
    });
  }

  /*
   * Check for Harness Consistency created
   * @param partZoneDeletionList
   */
  public async performConsistencyCheck(
    changePsSynchroStatusFlag: boolean,
    partZoneDeletionList?: HarnessDictionaryService
  ) {
    try {
      await Promise.all(
        partZoneDeletionList.finalizeEntries().map((harness) => {
          return Harness3dDesignSolutionModel.findOne({
            where: {
              adapDesignSolutionNumber: harness.adapDesignSolutionNumber,
              adapDesignSolutionVersionNumber:
                harness.adapDesignSolutionVersionNumber,
            },
          }).then(async (result) => {
            if (result.dataStatus === GlobalEnums.DataStatusEnum.FROZEN) {
              const newVersion = this.harnessHelper.updateHarnessVersionNumber(
                result.adapDesignSolutionVersionNumber
              );
              await this.harnessHelper.updateHarnessStatusAndVersion(
                result,
                GlobalEnums.DataStatusEnum.TEMPORARY,
                newVersion
              );
            }
            let adapDsData = {};
            if (changePsSynchroStatusFlag) {
              adapDsData = {
                adapDesignSolutionVersionNumber:
                  result.adapDesignSolutionVersionNumber,
                adapDesignSolutionIssueNumber:
                  result.adapDesignSolutionIssueNumber,
                adapDesignSolutionNumber: result.adapDesignSolutionNumber,
                ChangePsSynchroStatus: result.psSynchroStatus,
              };
            } else {
              adapDsData = {
                adapDesignSolutionVersionNumber:
                  result.adapDesignSolutionVersionNumber,
                adapDesignSolutionIssueNumber:
                  result.adapDesignSolutionIssueNumber,
                adapDesignSolutionNumber: result.adapDesignSolutionNumber,
              };
            }
            return this.harnessConsistencyController.harnessConsistencyCheck(
              adapDsData
            );
          });
        })
      );
      // await this._factory.delete(GlobalEnums.ComponentsEnum.PARTZONE);
      this._factory = null;
    } catch (err) {
      console.log(err);
    }
  }

  /*
   * the factory will create every needed object as bellow
   * @param reject
   * @param mappedData
   * @returns
   */
  private async factoryCreateComponents(
    isProptoolData: boolean,
    mappedData: IMappedData | IPartZoneManagerData
  ) {
    const transaction = await database.transaction();
    try {
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.COMPONENT,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.HARNESS3DDESIGNSOLUTION,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.PARTZONE,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.BRANCH3D,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.FUNCTIONALITEM,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.BRANCH3DEXTREMITYSOLUTION,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.FUNCTIONALITEM3DSOLUTION,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.BACKSHELL3DSOLUTION,
        mappedData,
        transaction
      );
      await this._factory.createComponent(
        isProptoolData,
        GlobalEnums.ComponentsEnum.COVERINGELEMENT3D,
        mappedData,
        transaction
      );
      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      throw new Error("Error creating components");
    }
  }
}
