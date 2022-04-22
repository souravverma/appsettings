import PartZoneModel from "../../models/Partzone.model";
import * as GlobalEnums from "../../ConfigurationFiles/GlobalEnums";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";

export default class PartZoneFreezeUnfreeze {
  constructor() {}

  /**
   *
   * @param harnessModel
   */
  public async updatePartzonesToFreeze(
    harnessModel: Harness3dDesignSolutionModel
  ) {
    try {
      const partzones: PartZoneModel[] = harnessModel.partZone;
      await Promise.all(
        partzones.map(async (partzone: PartZoneModel) => {
          if (
            (partzone.issue === null || partzone.issue.includes("---")) &&
            (partzone.dataStatus.includes(
              GlobalEnums.DataStatusEnum.TEMPORARY
            ) ||
              partzone.dataStatus.includes(GlobalEnums.DataStatusEnum.FROZEN))
          )
            await partzone.update({
              issue: harnessModel.adapDesignSolutionIssueNumber,
            });
          if (partzone.dataStatus !== GlobalEnums.DataStatusEnum.FROZEN)
            await partzone.update({
              dataStatus: GlobalEnums.DataStatusEnum.FROZEN,
            });
          return Promise.resolve();
        })
      );
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   *
   * @param harnessModel
   * @param adapDesignSolutionNumber
   */
  public async updatePartzoneToUnfreeze(
    harnessModel: Harness3dDesignSolutionModel,
    adapDesignSolutionNumber: string
  ) {
    try {
      const partzones: PartZoneModel[] = harnessModel.partZone;
      await Promise.all(
        partzones.map(async (partzone: PartZoneModel) => {
          const frozenHarnesses: Harness3dDesignSolutionModel[] =
            partzone.harness3d.filter(
              (partzoneHarness: Harness3dDesignSolutionModel) => {
                return (
                  partzoneHarness.dataStatus ==
                  GlobalEnums.DataStatusEnum.FROZEN
                );
              }
            );
          if (
            frozenHarnesses.length === 1 &&
            frozenHarnesses[0].adapDesignSolutionNumber ==
              adapDesignSolutionNumber
          ) {
            return await partzone.update({
              dataStatus: GlobalEnums.DataStatusEnum.TEMPORARY,
            });
          }
          return Promise.resolve();
        })
      );
    } catch (error) {
      Promise.reject(error);
    }
  }
}
