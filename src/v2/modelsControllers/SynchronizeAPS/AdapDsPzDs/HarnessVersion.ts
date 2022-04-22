import PartZoneModel from "../../../models/Partzone.model";
import AdapDsHarnessHelper from "./AdapDsHarnessHelper";
import { IAdapDsCiLO } from "./interface/AdapDsPzDs.interface";
import Harness3dDesignSolutionModel from "../../../models/Harness3dDesignSolution.model";
import * as GlobalEnums from "../../../ConfigurationFiles/GlobalEnums";
import { container, injectable } from "tsyringe";

@injectable()
export default class HarnessVersion {
  private harnessHelper: AdapDsHarnessHelper;
  /**
   *
   */
  constructor() {
    this.harnessHelper = container.resolve(AdapDsHarnessHelper);
  }

  public getMaxVersionDS(
    adapDsData: Harness3dDesignSolutionModel[]
  ): Harness3dDesignSolutionModel {
    return adapDsData.reduce((maxVersionObj, currentObj) => {
      if (!maxVersionObj) maxVersionObj = currentObj;
      if (
        parseInt(currentObj.adapDesignSolutionVersionNumber) >
        parseInt(maxVersionObj.adapDesignSolutionVersionNumber)
      )
        maxVersionObj = currentObj;
      return maxVersionObj;
    }, undefined);
  }

  public async getNewDSVersion(
    data: IAdapDsCiLO,
    userAreaNamefromAps: string[],
    newVersion: string
  ) {
    let adapVersion = newVersion;
    try {
      let flagCreateNewDS: any = false;
      const frozenAdapDsData: Harness3dDesignSolutionModel[] =
        await this.harnessHelper.getAllAdapDsPzDsData(
          data.id,
          GlobalEnums.DataStatusEnum.FROZEN
        );

      const temporaryAdapDsData: Harness3dDesignSolutionModel[] =
        await this.harnessHelper.getAllAdapDsPzDsData(
          data.id,
          GlobalEnums.DataStatusEnum.TEMPORARY
        );

      let adapDsData: Harness3dDesignSolutionModel | undefined;

      if (temporaryAdapDsData.length > 0) {
        adapDsData = this.getMaxVersionDS(temporaryAdapDsData);
        adapVersion = adapDsData.adapDesignSolutionVersionNumber;
      } else if (frozenAdapDsData.length > 0) {
        flagCreateNewDS = true;

        let maxVersion: string =
          this.getMaxVersionDS(
            frozenAdapDsData
          ).adapDesignSolutionVersionNumber;

        const adapDsData = await this.harnessHelper.getAdapDsPzDsData(
          data.id,
          maxVersion
        );
        if (userAreaNamefromAps.length === adapDsData?.partZone.length) {
          const partZones: PartZoneModel[] = adapDsData.partZone.filter(
            (p: PartZoneModel) => userAreaNamefromAps.includes(p.userArea.name)
          );
          if (partZones.length == adapDsData.partZone.length) {
            flagCreateNewDS = null;
            newVersion = adapDsData.adapDesignSolutionVersionNumber;

            await this.harnessHelper.updateHarnessWithNewStatus(
              adapDsData.id,
              "OK"
            );
            return {
              newVersion,
              flagCreateNewDS,
              dsIssue: adapDsData?.adapDesignSolutionIssueNumber,
            };
          }
        }

        if (parseInt(adapVersion) <= parseInt(maxVersion)) {
          maxVersion = (Number(maxVersion) + 1001).toString();
          adapVersion = maxVersion.slice(maxVersion.length - 3);
        }
      }
      newVersion = adapVersion;
      return {
        newVersion,
        flagCreateNewDS,
        dsIssue: adapDsData?.adapDesignSolutionIssueNumber,
      };
    } catch (error) {
      console.log("APS synchronization error getNewDSVersion: ", error);
      return Promise.reject(`APS Data not Synchronized`);
    }
  }
}
