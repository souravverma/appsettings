import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import * as GlobalEnums from "../../ConfigurationFiles/GlobalEnums";
import {
  IadapDsVersionIssue,
  IHarness3dDesignSolution,
} from "../../interfaces/mapping.interface";
import regexJson from "../../ConfigurationFiles/Regex.json";
import PartZoneController from "../Partzone/PartZone.controller";
import AdapLoModel from "../../models/AdapLo.model";
import AdapItemModel from "../../models/AdapItem.model";
import { WhereOptions } from "sequelize";
import { IHarness3dDesignSolutionModel } from "../../interfaces/IHarness3dDesignSolutionModel.interface";
import FunctionalItemModel from "../../models/FunctionalItem.model";
import CircuitModel from "../../models/Circuit.model";
import { injectable } from "tsyringe";

@injectable()
export default class HarnessHelper {
  protected model: typeof Harness3dDesignSolutionModel =
    Harness3dDesignSolutionModel;

  constructor() {}

  /**
   *
   * @param harnessModel
   * @param status
   */
  public async updateHarness(
    harnessModel: Harness3dDesignSolutionModel,
    status: GlobalEnums.DataStatusEnum
  ) {
    try {
      await harnessModel.update({
        dataStatus: status,
      });
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   *
   * @param harnessModel
   * @param status
   */
  public async updateHarnessStatusAndVersion(
    harnessModel: Harness3dDesignSolutionModel,
    status: GlobalEnums.DataStatusEnum,
    version: string
  ) {
    try {
      await harnessModel.update({
        dataStatus: status,
        adapDesignSolutionVersionNumber: version,
      });
    } catch (error) {
      console.log("Harness update error");
      await Promise.reject(error);
    }
  }

  /**
   * we do this to convert string to number and add +1 to the LPZ version number
   * @param item
   * @param latestPartZone
   */
  public updateHarnessVersionNumber(currentVersion: string) {
    const version = (Number(currentVersion) + 1001).toString();
    return version.slice(version.length - 3);
  }

  /**
   *
   * @param adapDs
   * @returns
   */
  public async searchForHarness(
    adapDs: IadapDsVersionIssue
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      return await this.model.findOne({
        include: [
          {
            model: PartZoneModel,
          },
        ],
        where: {
          adapDesignSolutionNumber: adapDs.adapDesignSolutionNumber,
          adapDesignSolutionIssueNumber: adapDs.adapDesignSolutionIssueNumber,
          adapDesignSolutionVersionNumber:
            adapDs.adapDesignSolutionVersionNumber,
        },
      });
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   *
   * @param adapDesignSolutionNumber
   * @returns
   */
  public async searchForHarnessWithDSNumber(
    adapDesignSolutionNumber: string
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      return await this.model.findOne({
        include: [
          {
            model: PartZoneModel,
            include: [
              {
                model: Harness3dDesignSolutionModel,
              },
            ],
          },
        ],
        where: { adapDesignSolutionNumber: adapDesignSolutionNumber },
      });
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * findHarnessesToDelete
   * @param whereClause
   * @returns
   */
  public async findHarnessesToDelete(whereClause: {
    adapDesignSolutionNumber?: string;
    adapDesignSolutionVersionNumber?: string;
  }): Promise<Harness3dDesignSolutionModel[]> {
    try {
      let harnesses: Harness3dDesignSolutionModel[];
      if (
        whereClause.adapDesignSolutionVersionNumber.toLocaleUpperCase() ===
        "LAST"
      ) {
        harnesses = [
          await this.model.findOne({
            where: {
              adapDesignSolutionNumber: whereClause.adapDesignSolutionNumber,
            },
            attributes: ["id"],
            include: [PartZoneController.nestedIncludeOptions],
            order: ["adap_ds_version", "DESC NULLS LAST"],
          }),
        ];
      } else {
        harnesses = await this.model.findAll({
          where: whereClause,
          attributes: ["id"],
          include: [PartZoneController.nestedIncludeOptions],
        });
      }
      return harnesses;
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /*
   * Create the where clause
   * @param adapDsNumber
   * @param adapDsVersionNumber
   * @returns
   */
  public createWhereClause(
    adapDsNumber?: string,
    adapDsVersionNumber?: string
  ) {
    const whereClause: {
      adapDesignSolutionNumber?: string;
      adapDesignSolutionVersionNumber?: string;
    } = {};
    if (adapDsNumber) {
      whereClause.adapDesignSolutionNumber = adapDsNumber;
    }
    if (adapDsVersionNumber) {
      whereClause.adapDesignSolutionVersionNumber = adapDsVersionNumber;
    }
    return whereClause;
  }

  /**
   * @desc Return an array containing a specific harness with partzone, Mp and finSol related.
   * @param {WhereOptions<Harness3dDesignSolutionModel>} whereClause
   * @returns {Promise<Harness3dDesignSolutionModel>} Promise<Harness3dDesignSolutionModel>
   * @memberof HarnessHelper
   */
  public async getHarnessWithoutPartZones(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>
  ): Promise<IHarness3dDesignSolutionModel[]> {
    try {
      return await Harness3dDesignSolutionModel.findAll({
        where: whereClause,
        include: [
          {
            model: AdapLoModel,
            attributes: ["number"],
            include: [
              {
                model: AdapItemModel,
                attributes: ["number"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @desc Return an array containing a specific harness with partzone, Mp and finSol related.
   * @param {WhereOptions<AdapItemModel>} whereClause
   * @returns {Promise<Harness3dDesignSolutionModel>}
   * @memberof HarnessHelper
   */
  public async getHarnessByAdapCi(
    whereClause: WhereOptions<AdapItemModel>
  ): Promise<IHarness3dDesignSolutionModel[]> {
    try {
      const adapDsData = await Harness3dDesignSolutionModel.findAll({
        include: [
          {
            model: FunctionalItemModel,
            attributes: ["sequence_number"],
            include: [
              {
                model: CircuitModel,
                required: true,
                where: { letters: ["VB", "VU"] },
                attributes: ["letters"],
              },
            ],
            required: true,
          },
          {
            model: AdapLoModel,
            attributes: ["number"],
            include: [
              {
                model: AdapItemModel,
                attributes: ["number"],
                where: whereClause,
                required: true,
              },
            ],
            required: true,
          },
        ],
      });
      return this.setVUVBValues(adapDsData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Select vuvb values which circuit and sequence are not null
   * @param adapDsData
   * @returns
   */
  public setVUVBValues(
    adapDsData: IHarness3dDesignSolutionModel[]
  ): IHarness3dDesignSolutionModel[] {
    adapDsData.forEach((ds) => {
      ds.fin.forEach((vu, i) => {
        if (vu.circuit === null || vu.circuit.letters === null) {
          ds.fin.splice(i, 1);
        }
      });
    });
    return adapDsData;
  }

  /**
   * Update Design Solution data based on the DS data type (2D or 3D)
   * @param harnessData harness data
   */
  public update2D3DDataForHarness(harnessData: IHarness3dDesignSolution) {
    const regex = regexJson.DATA_FORMAT["2D_format"];
    const checkIf2DDS = new RegExp(regex).test(
      harnessData.adapDesignSolutionNumber
    );
    if (checkIf2DDS) {
      harnessData.dataStatus = GlobalEnums.DataStatusEnum.TEMPORARY;
      harnessData.dataType = "2D";
    } else {
      harnessData.dataType = "3D";
    }
  }
}
