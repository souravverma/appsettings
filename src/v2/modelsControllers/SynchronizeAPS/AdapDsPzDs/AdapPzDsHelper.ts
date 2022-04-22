import {
  IPartZone,
  IPartZoneManagerData,
  IFunctionalItem,
} from "../../../interfaces/mapping.interface";
import {
  IAdapDsCiLO,
  ICiLO,
  ISpecifiedPzDs,
} from "./interface/AdapDsPzDs.interface";
import { IAdapCi } from "../AdapCipzCi/interface/AdapPzCi.interface";
import PartZoneModel from "../../../models/Partzone.model";
import AdapDsHarnessHelper from "./AdapDsHarnessHelper";
import regexJson from "../../../ConfigurationFiles/Regex.json";
import { container, injectable } from "tsyringe";
import * as GlobalEnums from "../../../ConfigurationFiles/GlobalEnums";

@injectable()
export default class AdapPzDsHelper {
  private harnessHelper: AdapDsHarnessHelper;
  /**
   *
   */
  constructor() {
    this.harnessHelper = container.resolve(AdapDsHarnessHelper);
  }

  public getuserAreaNamefromAps(specifiedPzDs: ISpecifiedPzDs[]): string[] {
    const pzDsUserAreaNamefromAps: Array<string> = [];
    specifiedPzDs.forEach((pzDs) => {
      pzDsUserAreaNamefromAps.push(pzDs.id.slice(-2));
    });
    return pzDsUserAreaNamefromAps;
  }

  public getadapCiPzCiData(
    specifiedPzDs: ISpecifiedPzDs[],
    cilo: ICiLO[]
  ): IAdapCi {
    const adapCiPzCiData: IAdapCi = { id: cilo[0].adapCiId };
    adapCiPzCiData.pz_ci = [];
    specifiedPzDs.forEach((pzDs) => {
      adapCiPzCiData.pz_ci.push({ pz_ci_id: pzDs.pzCiId });
    });
    return adapCiPzCiData;
  }

  public async getMaxVersionPZ(
    name: string
  ): Promise<PartZoneModel | undefined> {
    const pzFound: PartZoneModel[] = await PartZoneModel.findAll({
      where: { name },
    });

    return pzFound.reduce((maxVersionObj, currentObj) => {
      if (!maxVersionObj) maxVersionObj = currentObj;
      if (parseInt(currentObj.version) > parseInt(maxVersionObj.version))
        maxVersionObj = currentObj;
      return maxVersionObj;
    }, undefined);
  }

  public async updatePZOrigin(
    validSpecifiedPzDs: ISpecifiedPzDs[],
    pzDsfromAps: IPartZone[],
    originNotFound?: string[]
  ): Promise<{
    validSpecifiedPzDs: ISpecifiedPzDs[];
    pzDsfromAps: IPartZone[];
    originNotFound: string[];
  }> {
    const pZnotExists: string[] = [];
    await Promise.all(
      validSpecifiedPzDs.map(async (item, i) => {
        if (item.pzOrigin?.length && item.pzOrigin[0].id) {
          const pzOriginFound: PartZoneModel | undefined =
            await this.getMaxVersionPZ(item.pzOrigin[0].id);
          if (!pzOriginFound) {
            originNotFound?.push(`PZ<${item.pzOrigin[0].id}>`);
            pZnotExists.push(item.id);
          } else {
            pzDsfromAps[i].originId = pzOriginFound.id;
            pzDsfromAps[i].version = "001";
            validSpecifiedPzDs[i].version = "001";
          }
        }
        return Promise.resolve();
      })
    );
    pzDsfromAps = pzDsfromAps.filter(
      (item) => !pZnotExists.includes(item.name)
    );
    validSpecifiedPzDs = validSpecifiedPzDs.filter(
      (item) => !pZnotExists.includes(item.id)
    );
    return { validSpecifiedPzDs, pzDsfromAps, originNotFound };
  }

  public createPzDsDictionary(pzDsfromAps: IPartZone[], item: ISpecifiedPzDs) {
    pzDsfromAps.push({
      name: item.id,
      userArea: item.id.slice(-2),
      issue: item.issue || "---",
      version: item.version,
    });
  }

  public async updateHarnessVersion(
    apsData: IAdapDsCiLO,
    flagCreateNewDS: boolean,
    version: string,
    existingVuvb: IFunctionalItem
  ): Promise<{
    validSpecifiedPzDs: ISpecifiedPzDs[];
    originNotFound: string[];
  }> {
    let pzDsfromAps: IPartZone[] = [];
    let harnessData: IPartZoneManagerData;
    let originNotFound: string[] = [];
    let validSpecifiedPzDs: ISpecifiedPzDs[] = [];
    let toBeStoredPartzones: ISpecifiedPzDs[];
    const regex = regexJson.CharAt4thIndex.valueEquals4;

    if (apsData.specifiedPzDs && apsData.specifiedPzDs.length > 0) {
      toBeStoredPartzones = apsData.specifiedPzDs;
    } else {
      toBeStoredPartzones = apsData.implementedPzDs;
    }
    await Promise.all(
      toBeStoredPartzones.map(async (partzone, i) => {
        const pzExists: PartZoneModel | undefined = await this.getMaxVersionPZ(
          partzone.id
        );

        // handle reuse PZs
        if (
          partzone.id.substring(0, 12) !== apsData.id.substring(0, 12) &&
          !pzExists
        ) {
          originNotFound.push(`PZ<${partzone.id}>`);
        } else {
          let pzIssue: string = partzone.issue || pzExists?.issue || "---";
          // for reuse PZ issue will be existing one only
          if (partzone.id.substring(0, 12) !== apsData.id.substring(0, 12)) {
            pzIssue = pzExists?.issue;
          }
          pzDsfromAps.push({
            name: partzone.id,
            userArea: partzone.id.slice(-2),
            issue: pzIssue,
            version: pzExists?.version || "001",
          });

          const checkIf924Pz = new RegExp(regex).test(partzone.id);

          // For 924 PZ default data status is temporary
          if (checkIf924Pz && pzDsfromAps[i]) {
            pzDsfromAps[i].dataStatus = GlobalEnums.DataStatusEnum.TEMPORARY;
          }

          toBeStoredPartzones[i].issue = pzIssue;
          toBeStoredPartzones[i].version = pzExists?.version || "001";
          validSpecifiedPzDs.push(toBeStoredPartzones[i]);
        }

        return Promise.resolve();
      })
    );

    const originUpdated = await this.updatePZOrigin(
      validSpecifiedPzDs,
      pzDsfromAps,
      originNotFound
    );
    validSpecifiedPzDs = originUpdated.validSpecifiedPzDs;
    pzDsfromAps = originUpdated.pzDsfromAps;
    originNotFound = originUpdated.originNotFound;

    // in case of no partial synchro return error directly
    if (originNotFound.length && !validSpecifiedPzDs.length) {
      return Promise.reject(
        `First synchronize/create ${originNotFound.join(",")}`
      );
    }
    if (flagCreateNewDS === true) {
      harnessData = await this.harnessHelper.createHarnessJson(
        {
          harness3dDesignSolution: {
            adapDesignSolutionNumber: apsData.id,
            adapDesignSolutionVersionNumber: version,
            adapDesignSolutionIssueNumber: apsData.issue || "---",
          },
          partZone: pzDsfromAps,
        },
        existingVuvb.sequenceNumber,
        existingVuvb.circuit
      );

      await this.harnessHelper.updateHarnessPartZoneRelationship(
        apsData.id,
        version,
        pzDsfromAps
      );
    } else if (flagCreateNewDS === false) {
      harnessData = await this.harnessHelper.createHarnessJson(
        {
          harness3dDesignSolution: {
            adapDesignSolutionNumber: apsData.id,
            adapDesignSolutionVersionNumber: version,
            adapDesignSolutionIssueNumber: apsData.issue || "---",
          },
          partZone: pzDsfromAps,
        },
        existingVuvb.sequenceNumber,
        existingVuvb.circuit
      );
    }

    return { validSpecifiedPzDs, originNotFound };
  }
}
