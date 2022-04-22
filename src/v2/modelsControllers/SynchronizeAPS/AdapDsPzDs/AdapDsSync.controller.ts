import SyncAdapCIPzController from "../AdapCipzCi/SyncAdapCIPz.controller";
import AdapLo from "../AdapLo/AdapLo";

import ManageMpRelation from "../modificationProposal/ManageMpRelation";
import PzDsCiRelation from "./PzDsCiRelation";
import { IAdapDsCiLO } from "./interface/AdapDsPzDs.interface";
import AdapPzDsHelper from "./AdapPzDsHelper";
import PzHelper from "./PzHelper";
import AdapDsHarnessHelper from "./AdapDsHarnessHelper";
import { IAdapCi } from "../AdapCipzCi/interface/AdapPzCi.interface";
import HarnessVersion from "./HarnessVersion";
import { container } from "tsyringe";
import Harness3dDesignSolutionModel from "../../../models/Harness3dDesignSolution.model";

export default class AdapDsSyncController {
  private adapPzDsHelper: AdapPzDsHelper;
  private pzHelper: PzHelper;
  private harnessHelper: AdapDsHarnessHelper;
  private manageMpRelation: ManageMpRelation;
  private pzDsCiRelation: PzDsCiRelation;
  private adapLo: AdapLo;
  private syncAdapCIPzController: SyncAdapCIPzController;
  private harnessVersion: HarnessVersion;

  constructor() {
    this.adapPzDsHelper = container.resolve(AdapPzDsHelper);
    this.pzHelper = container.resolve(PzHelper);
    this.harnessHelper = container.resolve(AdapDsHarnessHelper);
    this.manageMpRelation = container.resolve(ManageMpRelation);
    this.pzDsCiRelation = container.resolve(PzDsCiRelation);
    this.adapLo = container.resolve(AdapLo);
    this.syncAdapCIPzController = container.resolve(SyncAdapCIPzController);
    this.harnessVersion = container.resolve(HarnessVersion);
  }

  public async storeAdapData(
    dataFromAps: IAdapDsCiLO[] | IAdapDsCiLO
  ): Promise<{ message: string }> {
    try {
      if (!Array.isArray(dataFromAps)) dataFromAps = [dataFromAps];
      const { specifiedPzDs, implementedPzDs, firstMsn, ciLo } = dataFromAps[0];
      let toBeStoredPartzones;
      if (specifiedPzDs && specifiedPzDs.length > 0) {
        toBeStoredPartzones = specifiedPzDs;
      } else if (implementedPzDs && implementedPzDs.length > 0) {
        toBeStoredPartzones = implementedPzDs;
      } else {
        console.log("implementedPzDs and specifiedPzDs are empty");
        return Promise.reject("implementedPzDs and specifiedPzDs are empty");
      }
      if (
        dataFromAps[0].id.length === 12 &&
        ["7", "8", "9"].includes(dataFromAps[0].id.charAt(4))
      ) {
        dataFromAps[0].id += "00";
      }

      let tempPzExists = false;

      const existingVuvb = await this.harnessHelper.chechIfVuvbExists(
        dataFromAps[0].id
      );

      const userAreaNamefromAps: string[] =
        this.adapPzDsHelper.getuserAreaNamefromAps(toBeStoredPartzones);

      const { newVersion, flagCreateNewDS, dsIssue } =
        await this.harnessVersion.getNewDSVersion(
          dataFromAps[0],
          userAreaNamefromAps,
          "001"
        );

      if (dsIssue && !dataFromAps[0].issue) {
        dataFromAps[0].issue = dsIssue;
      }

      const adapCiPzCiData: IAdapCi = this.adapPzDsHelper.getadapCiPzCiData(
        toBeStoredPartzones,
        ciLo
      );

      const { validSpecifiedPzDs, originNotFound } =
        await this.adapPzDsHelper.updateHarnessVersion(
          dataFromAps[0],
          flagCreateNewDS,
          newVersion,
          existingVuvb
        );

      // compare pzDs from APS and elec pz and form an array of pz and unlink pz that are not present in elec db
      const adapDsData: Harness3dDesignSolutionModel =
        await this.harnessHelper.getAdapDsPzDsData(
          dataFromAps[0].id,
          newVersion
        );

      if (adapDsData) {
        const { tempPz } = await this.pzHelper.deletePartzones(
          adapDsData,
          userAreaNamefromAps
        );
        tempPzExists = tempPz;
      }

      const adapCi = await this.syncAdapCIPzController.storeAdapCiPzCiData([
        adapCiPzCiData,
      ]);

      const getAdapId = await this.harnessHelper.findAdapDs(
        adapDsData.adapDesignSolutionNumber,
        adapDsData.adapDesignSolutionVersionNumber
      );

      await this.adapLo.createOrFetchAdapLo({
        number: ciLo[0].adapLoId,
        poe: firstMsn,
        fk_harness_3d_ds_id: getAdapId.id,
        fk_adap_item_id: adapCi.id,
      });

      await this.pzDsCiRelation.createPartZoneCisRelation(validSpecifiedPzDs);

      await this.harnessHelper.updatePZRelationWithHarness(
        validSpecifiedPzDs,
        getAdapId.id,
        "Official"
      );

      await this.harnessHelper.updateHarnessWithNewStatus(
        getAdapId.id,
        !tempPzExists && !originNotFound.length ? "OK" : "KO"
      );

      console.log(
        `APS synchronization done for Harness: ${adapDsData.adapDesignSolutionNumber} and version/issue ${adapDsData.adapDesignSolutionVersionNumber}/${adapDsData.adapDesignSolutionIssueNumber}\nwith Partzones:\n`,
        validSpecifiedPzDs
          .map(
            (item) =>
              `${item.id} and version/issue ${item.version}/${item.issue}`
          )
          .join("\n")
      );

      // create modification proposal and link to pzDs
      if (!originNotFound.length) {
        await this.manageMpRelation.extractSpecificDs(validSpecifiedPzDs);
        return await Promise.resolve({ message: "synchronization success" });
      }
      return Promise.resolve({
        message: `Partial synchronization done for data with PZ Ids: ${validSpecifiedPzDs
          .map((item) => `<${item.id}>`)
          .join(
            ","
          )} and for full synchronzation, please first synchronize/create ${originNotFound.join(
          ","
        )}`,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
