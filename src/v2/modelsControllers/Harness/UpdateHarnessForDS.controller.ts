import { IadapDsVersionIssue } from "../../interfaces/mapping.interface";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import * as GlobalEnums from "../../ConfigurationFiles/GlobalEnums";
import HarnessHelper from "./HarnessHelper.controller";
import PartZoneFreezeUnfreeze from "../Partzone/PartzoneFreezeUnfreeze.controller";
import { IHarnessConsistency } from "../../interfaces/HarnessConsistency.interface";

export default class UpdateHarnessForDesignSolution {
  protected model: typeof Harness3dDesignSolutionModel =
    Harness3dDesignSolutionModel;
  harnessHelper = new HarnessHelper();
  partZoneHelper = new PartZoneFreezeUnfreeze();
  constructor() {}

  /**
   * freezeDesignSolution
   * @param adapDs
   * @returns
   */
  public async freezeDesignSolution(adapDs: IadapDsVersionIssue): Promise<any> {
    const harnessModel: Harness3dDesignSolutionModel =
      await this.harnessHelper.searchForHarness(adapDs);
    await this.harnessHelper.updateHarness(
      harnessModel,
      GlobalEnums.DataStatusEnum.FROZEN
    );
    await this.partZoneHelper.updatePartzonesToFreeze(harnessModel);
    return GlobalEnums.HarnessStatus.FROZENSUCCESS;
  }

  /**
   * unfreezeDesignSolution
   * @param adapDesignSolutionNumber
   * @returns
   */
  public async unfreezeDesignSolution(
    adapDesignSolutionNumber: string
  ): Promise<any> {
    const harnessModel: Harness3dDesignSolutionModel =
      await this.harnessHelper.searchForHarnessWithDSNumber(
        adapDesignSolutionNumber
      );

    if (harnessModel.dataStatus == GlobalEnums.DataStatusEnum.FROZEN) {
      await this.harnessHelper.updateHarness(
        harnessModel,
        GlobalEnums.DataStatusEnum.TEMPORARY
      );
      await this.partZoneHelper.updatePartzoneToUnfreeze(
        harnessModel,
        adapDesignSolutionNumber
      );
      return GlobalEnums.HarnessStatus.UNFROZENSUCCESS;
    } else return GlobalEnums.HarnessStatus.DSSTATUS;
  }

  /**
   * @desc Update the Consolidation Status in datbase for a specific Harness
   * @param {string} adapDesignSolutionNumber
   * @param {IHarnessConsistency.IResponse} consistencyResponse
   * @returns {Promise<null>} Promise<null>
   * @memberof SpecificModelController
   */
  public async updateHarnessConsolidationStatus(
    adapDs: any,
    consistencyResponse: IHarnessConsistency.IResponse
  ): Promise<[number, Array<Harness3dDesignSolutionModel>]> {
    try {
      const dataTobeUpdated: any = {
        consolidationStatus: consistencyResponse.status,
        consolidationMsg: consistencyResponse.message,
      };
      if (adapDs["ChangePsSynchroStatus"]) {
        dataTobeUpdated["psSynchroStatus"] = adapDs["ChangePsSynchroStatus"];
        delete adapDs["ChangePsSynchroStatus"];
      }
      return await Harness3dDesignSolutionModel.update(dataTobeUpdated, {
        where: adapDs,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
