import PartZoneModel from "../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import HarnessForPartZone from "../Harness/HarnessForPartzone.controller";
import { IMappedData, IPartZone } from "../../interfaces/mapping.interface";
import { Op, WhereOptions } from "sequelize";
import Harness3dDsPzRelationModel from "../../models/Harness3dDsPzRelation.model";
import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import { container, injectable } from "tsyringe";
import { IHarness3dDesignSolutionModel } from "../../interfaces/IHarness3dDesignSolutionModel.interface";
import regexJson from "../../ConfigurationFiles/Regex.json";
import * as GlobalEnums from "../../ConfigurationFiles/GlobalEnums";
@injectable()
export default class PartZoneHelper {
  private harnessForPartzone: HarnessForPartZone;
  /**
   *
   */
  constructor() {
    this.harnessForPartzone = container.resolve(HarnessForPartZone);
  }

  public async retrievePartZones(data: IMappedData): Promise<PartZoneModel[]> {
    let whereClause: WhereOptions<PartZoneModel>;
    if (data.partZone[0].version && data.partZone[0].issue) {
      let version = data.partZone[0].version;
      while (version.length < 3) {
        version = "0" + version;
      }
      whereClause = {
        name: data.partZone[0].name,
        version: version.toString(),
        issue: data.partZone[0].issue.toString(),
        dataStatus: {
          [Op.not]: "frozen",
        },
      };
    } else {
      whereClause = {
        name: data.partZone[0].name,
        dataStatus: {
          [Op.not]: "frozen",
        },
      };
    }
    const partZones: PartZoneModel[] = await PartZoneModel.findAll({
      where: whereClause,
    });
    return partZones;
  }

  /**
   * We modify query condition if version exists
   * @param version
   * @param partZoneName
   * @returns
   */
  public createWhereCondition(version: string, partZoneName: string) {
    const where: any = {
      name: partZoneName,
    };
    if (version !== undefined) {
      where["version"] = version;
    }
    return where;
  }

  /**
   *  We get all Harnesses linked to the PartZone
   * @param where
   */
  public async getAllHarnessesForPartZone(
    where: any
  ): Promise<IHarness3dDesignSolutionModel[]> {
    try {
      return await this.harnessForPartzone.getAllHarnessesForPartZone(where);
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * To update the partzone last modified date on every upload
   * @param data
   */
  public async updatePartZoneonProptoolLoad(data: any) {
    try {
      if (data.name) {
        await PartZoneModel.update(
          { updated_at: new Date() },
          {
            where: {
              name: data.name,
              version: data.version,
            },
          }
        );
      }
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * CHECK: We search if this founded Harness is already exist (we get also User Area)
   * @param foundeHarnessName
   * @returns
   */
  public async checkHarnessForPartzoneExists(foundeHarnessName: string) {
    try {
      return await this.harnessForPartzone.checkHarnessForPartzoneExists(
        foundeHarnessName
      );
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * If no related Harness that means The partzone is not linked to an harness
   * So we get/create the name of the Ds Parent.
   *
   * In order to (try) attach this PartZone to an existing harness (SMART UPLOAD), we define DS name from the 12 first digit of Pz Name + 00
   * @param partZoneFileName
   * @returns
   */
  public createDsNameFromPartZoneName(partZoneFileName: string): string {
    try {
      const regex = regexJson.PARTZONE.name;
      const Pz12digits: string = partZoneFileName.substring(0, 12);
      const foundResult = new RegExp(regex).test(Pz12digits);
      if (foundResult) {
        const pz = `${Pz12digits}00`;
        return pz;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `The harness n°${partZoneFileName} does not exist and must be created first !`
      );
    }
  }

  public async updateNewPartzone(newPz: PartZoneModel) {
    try {
      let isHarnessTypeInstallation;
      isHarnessTypeInstallation = false;
      if (newPz.dataStatus !== undefined && newPz.releaseStatus !== undefined) {
        if (newPz.name.charAt(3) === "8" || newPz.name.charAt(3) === "2") {
          isHarnessTypeInstallation = true;
        }
        if (
          (newPz.releaseStatus === null ||
            !newPz.releaseStatus.includes("REL")) &&
          isHarnessTypeInstallation
        ) {
          await newPz.update({
            dataStatus: "temporary",
          });
        } else if (
          newPz.releaseStatus !== null &&
          newPz.releaseStatus.includes("REL") &&
          isHarnessTypeInstallation
        ) {
          await newPz.update({
            dataStatus: "frozen",
          });
        }
      }
    } catch (error) {
      Promise.reject(error);
    }
  }

  public async newPartzoneSetOriginId(
    partZone: IPartZone,
    newPz: PartZoneModel,
    pz: any
  ) {
    if (partZone.originId) {
      // if the partzone data given has a origin id filled, that mean that the partzone is made from another
      try {
        // set originId only if it's different from PZ id
        if (newPz.id !== partZone.originId)
          await newPz.$set("origin", partZone.originId);
        // update date to previous last modified
        if (partZone.origin === "Reuse") {
          await PartZoneModel.update(
            { updated_at: pz["updated_at"] },
            { where: { name: partZone.name, version: partZone.version } }
          );
        }

        if (partZone.origin === "up-issue" || partZone.origin === "update-pz") {
          await PartZoneModel.update(
            { updated_at: pz["updated_at"] },
            { where: { name: partZone.name, version: partZone.version } }
          );
        }
      } catch (err) {
        console.error(
          `Cannot set origin for partzone : ${partZone.name}. origin id :: ${partZone.originId} .`
        );
      }
    }
  }

  /**
   * we do this to convert string to number and add +1 to the LPZ version number
   * @param partZone
   * @param latestPartZone
   */
  public updatePartzoneVersionNumber(
    partZone: IPartZone,
    latestPartZone: PartZoneModel,
    whereClause: IWhereClauseParent
  ) {
    try {
      if (!partZone.version) {
        const version = (Number(latestPartZone.version) + 1001).toString();
        if (latestPartZone.dataStatus === "frozen") {
          whereClause.partZone.version = partZone.version = version.slice(
            version.length - 3
          );
        } else {
          partZone.version = whereClause.partZone.version =
            latestPartZone.version;
        }
      }
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * fetch harness
   * @param latestPartZone
   * @returns
   */
  public async getHarness(latestPartZone: PartZoneModel) {
    const temp = latestPartZone.name.substring(0, 12);
    let harness = await Harness3dDesignSolutionModel.findOne({
      where: {
        adapDesignSolutionNumber: temp + "00",
        dataStatus: "temporary",
      },
    });
    if (!harness) {
      harness = await Harness3dDesignSolutionModel.findOne({
        where: {
          adapDesignSolutionNumber: temp,
          dataStatus: "temporary",
        },
      });
    }
    return harness;
  }

  /**
   * latest partzone is the only partzone with waiting_data or temporary status
   * update the version to '001' when there is no version from proptool
   * @param partZone
   * @param latestPartZone
   */
  public async updateLatestPartzone(
    partZone: IPartZone,
    latestPartZone: PartZoneModel
  ) {
    try {
      if (partZone.version === null || partZone.version === "") {
        await latestPartZone.update({
          updated_at: new Date(),
          version: "001",
          issue: partZone.issue,
          releaseStatus: partZone.releaseStatus,
        });
      } else {
        await latestPartZone.update({
          updated_at: new Date(),
          issue: partZone.issue,
          version: partZone.version,
          releaseStatus: partZone.releaseStatus,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * update only if the frozen version is less than the proptool version
   * @param partZone
   * @param secondLastPartzone
   * @param latestPartZone
   */
  public async smartUploadTemporaryOrWaiting(
    partZone: IPartZone,
    secondLastPartzone: any,
    latestPartZone: PartZoneModel
  ) {
    if (partZone.version && secondLastPartzone.version < partZone.version) {
      await latestPartZone.update({
        updated_at: new Date(),
        issue: partZone.issue,
        version: partZone.version,
        releaseStatus: partZone.releaseStatus,
      });
    }

    /* we keep this code for reference */
    // Frozen partzone with greater version than proptool upload
    // else if (partZone.version && secondLastPartzone.version > partZone.version) {
    //     latestPartZone.update({
    //         updated_at: new Date(),
    //         releaseStatus: partZone.releaseStatus
    //     });
    // }
    // Proptool upload  with no version
    else if (!partZone.version) {
      await latestPartZone.update({
        updated_at: new Date(),
        releaseStatus: partZone.releaseStatus,
      });
    }
  }

  /**
   * Searches PZ with Name
   * @param partZone
   * @returns
   */
  public async getAllPartZonesWithName(partZone: IPartZone) {
    try {
      return await PartZoneModel.findAll({
        where: { name: partZone.name },
        order: [["version", "DESC NULLS LAST"]],
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Update PZ
   * @param partZone
   * @param partzone
   * @param harnessId
   * @returns
   */
  public async updatePartZone(
    partZone: IPartZone,
    partzone: PartZoneModel,
    harnessId: number
  ) {
    try {
      if (partZone.origin.includes("up-issue")) {
        await partzone.update(partZone);
      } else if (partZone.origin.includes("Reuse")) {
        await Harness3dDsPzRelationModel.upsert({
          harness3dDesignSolutionId: harnessId,
          partZoneId: partzone.id,
        });
      }
      if (partZone.origin.includes("update-pz")) {
        const pz = JSON.parse(JSON.stringify(partzone));
        console.log(
          `Updating existing PZ ${pz.name} at version/issue ${pz.version}/${pz.issue} with new Version/issue ${partZone.version}/${partZone.issue}`
        );
        await partzone.update(partZone, {
          where: {
            name: pz.name,
            version: pz.version,
            issue: pz.issue,
          },
        });
        if (partZone.pzStatus !== "Official" || partZone.pzStatus === null) {
          await Harness3dDsPzRelationModel.update(
            {
              pzStatus: "",
            } as any,
            {
              where: {
                harness3dDesignSolutionId: harnessId,
                partZoneId: partzone.id,
              },
            }
          );
        }
      }
      return partzone;
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Update PartZone data based on the PartZone data type
   * @param partZone pz data
   */
  public update2D3DDataForPartzone(partZone: IPartZone) {
    const regex = regexJson.DATA_FORMAT["2D_format"];
    const checkIf2DDS = new RegExp(regex).test(partZone.name);
    if (checkIf2DDS) {
      partZone.dataStatus = GlobalEnums.DataStatusEnum.TEMPORARY;
      partZone.consolidationStatus = GlobalEnums.ConsistencyStatus.WARNING;
      partZone.consolidationMessage =
        GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA;
      partZone.dataType = "2D";
    } else {
      partZone.dataType = "3D";
    }
  }

  /**
   * Create the where condition
   * @param partZone
   * @param data
   * @returns
   */
  public setWhereCondition(
    isProptoolData: boolean,
    partZone: IPartZone,
    data: IPartZone[]
  ) {
    let whereCondition: any;
    if (partZone.origin && partZone.origin.includes("update-pz")) {
      const originPz = data.find(
        (value) =>
          value.name === partZone.name &&
          (value.version !== partZone.version || value.issue !== partZone.issue)
      );
      whereCondition = { name: originPz.name, version: originPz.version };
    } else if (partZone.origin && partZone.version) {
      whereCondition = { name: partZone.name, version: partZone.version };
    } else if (partZone.version && !isProptoolData) {
      whereCondition = { name: partZone.name, version: partZone.version };
    } else {
      whereCondition = { name: partZone.name };
    }
    return whereCondition;
  }
}
