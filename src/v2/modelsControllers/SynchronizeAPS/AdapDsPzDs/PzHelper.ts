import PartZoneModel from "../../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../../models/Harness3dDesignSolution.model";
import DeletePartZone from "../../Partzone/DeletePartzone.controller";
import regexJson from "../../../ConfigurationFiles/Regex.json";
import * as GlobalEnums from "../../../ConfigurationFiles/GlobalEnums";
import { container, injectable } from "tsyringe";

@injectable()
export default class PzHelper {
  private deletePartZone: DeletePartZone;

  /**
   *
   */
  constructor() {
    this.deletePartZone = container.resolve(DeletePartZone);
  }

  public async deletePartzones(
    adapDsData: Harness3dDesignSolutionModel,
    userAreaNamefromAps: string[]
  ): Promise<{ tempPz: boolean }> {
    const pzDstoBeUnlinked: Object[] = [];
    let tempPz = false;

    adapDsData.partZone.forEach((partzone: PartZoneModel) => {
      if (
        partzone.dataStatus !== GlobalEnums.DataStatusEnum.TEMPORARY &&
        !userAreaNamefromAps.includes(partzone.userArea.name)
      ) {
        pzDstoBeUnlinked.push({
          name: partzone.name,
          version: partzone.version,
        });
      }
      if (
        partzone.dataStatus === GlobalEnums.DataStatusEnum.TEMPORARY &&
        !userAreaNamefromAps.includes(partzone.userArea.name)
      ) {
        const regex = regexJson.CharAt4thIndex.valueEquals4;
        const checkIf924Pz = new RegExp(regex).test(partzone.name);

        // delete temporary PZ if it's a reuse or associated to 924 DS
        if (
          partzone.name.substring(0, 12) !==
            adapDsData.adapDesignSolutionNumber.substring(0, 12) ||
          checkIf924Pz
        ) {
          pzDstoBeUnlinked.push({
            name: partzone.name,
            version: partzone.version,
          });
        } else tempPz = true;
      }
    });
    if (pzDstoBeUnlinked.length) {
      await this.deletePartZone.deletePartzoneList(
        {
          adapDsNumber: adapDsData.adapDesignSolutionNumber,
          adapDsVersion: adapDsData.adapDesignSolutionVersionNumber,
          adapDsIssue: adapDsData.adapDesignSolutionIssueNumber,
          deletedPartZones: pzDstoBeUnlinked,
        },
        true
      );
      console.log("APS synchronization deleted PZs: ", pzDstoBeUnlinked);
    }
    return { tempPz };
  }
}
