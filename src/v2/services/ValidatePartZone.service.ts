import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import PartZoneModel from "../models/Partzone.model";
import * as GlobalEnums from "../ConfigurationFiles/GlobalEnums";
import FunctionalItemModel from "../models/FunctionalItem.model";
import CircuitModel from "../models/Circuit.model";
import RouteCategoryController from "../modelsControllers/Routes/RouteCategory.controller";
import RouteCategoryModel from "../models/RouteCategory.model";
import AircraftProgramModel from "../models/AircraftProgram.model";

export default class ValidatePartZoneService {
  /**
   * currently this function blocks the upload if the LPZ is in frozen status.
   * Further modifications will be done acc to algo 2 for smart uplaod in this function code.
   *  directly forbid the upload of proptool file if the Frozen PZ version > proptool file version
   * @param partzoneName
   * @param partzoneVersion
   * @returns
   */
  public async checkFrozenStatusAndVersion(
    partzoneName: string,
    partzoneVersion: string
  ): Promise<string> {
    const partZoneList = await PartZoneModel.findAll({
      where: { name: partzoneName },
      order: [["version", "DESC NULLS LAST"]],
    });

    for (const partZone of partZoneList) {
      if (
        partZone.dataStatus === GlobalEnums.DataStatusEnum.FROZEN &&
        partZone.version >= partzoneVersion
      ) {
        return GlobalEnums.DataStatusEnum.INCORRECTVERSION;
      }
    }

    const latestPartzone = partZoneList[0];
    if (
      latestPartzone &&
      latestPartzone.dataStatus === GlobalEnums.DataStatusEnum.FROZEN
    ) {
      const temp = latestPartzone.name.substring(0, 12);
      let harness = await Harness3dDesignSolutionModel.findOne({
        where: {
          adapDesignSolutionNumber: temp + "00",
          dataStatus: GlobalEnums.DataStatusEnum.TEMPORARY,
        },
      });
      if (!harness) {
        harness = await Harness3dDesignSolutionModel.findOne({
          where: {
            adapDesignSolutionNumber: temp,
            dataStatus: GlobalEnums.DataStatusEnum.TEMPORARY,
          },
        });
      }
      if (!harness) {
        return GlobalEnums.DataStatusEnum.FROZENLPZ;
      }
    }
    return GlobalEnums.DataStatusEnum.SUCCESS;
  }

  /**
   * searching the DS in the hardenssdesignsolution table in particular VUVB if it exists
   * comparing VUVB of already created DS with VUVB of proptool file if not same raising an error
   * @param dsNumber
   * @param sequenceNumber
   * @param circuitLetter
   */
  public async checkVUVB(
    dsNumber: string,
    sequenceNumber: any,
    circuitLetter: any
  ): Promise<string[]> {
    const vuvbdata: string[] = [];
    const mergeFIN: string = sequenceNumber + circuitLetter;
    const harnessList = await Harness3dDesignSolutionModel.findOne({
      attributes: ["adapDesignSolutionNumber"],
      where: { adapDesignSolutionNumber: dsNumber },
      include: [
        {
          attributes: ["sequenceNumber"],
          model: FunctionalItemModel,
          include: [
            {
              attributes: ["letters"],
              where: { letters: ["VB", "VU"] },
              model: CircuitModel,
            },
          ],
        },
      ],
    });
    if (
      mergeFIN !==
      harnessList.fin[0].sequenceNumber + harnessList.fin[0].circuit.letters
    ) {
      vuvbdata.push(GlobalEnums.HarnessStatus.DSALREADYEXIST);
      vuvbdata.push(harnessList.fin[0].sequenceNumber);
      vuvbdata.push(harnessList.fin[0].circuit.letters);
      return vuvbdata;
    }
  }

  /**
   * To validate the proptool route exist in coreelec database
   * @param relatedHarnessList
   * @param element
   * @param apiResponseManager
   * @param validatePartZoneService
   */
  public async checkForMissingRoute(data: any): Promise<string> {
    try {
      const rc: RouteCategoryController = new RouteCategoryController();
      const branchRoutes: string[] = [];
      const finRoutes: string[] = [];
      let missingRoute = [];
      let routesList: any[] = [];
      let dbroutes = "";
      let message: string;
      const branch3droutes = data.branch3d;
      const functionalItem3d = data.functionalItem3dSolution;

      if (branch3droutes) {
        branch3droutes.forEach((item: any) => {
          branchRoutes.push(item.effectiveRoutes);
        });
      }

      if (functionalItem3d) {
        functionalItem3d.forEach((item: any) => {
          item.refParent.forEach((element: any) => {
            if (element.ref === "functionalItem") {
              finRoutes.push(element.whereClause.extra.effectiveRoutes);
            }
          });
        });
      }

      routesList = await RouteCategoryModel.findAll({
        attributes: ["name"],
        include: [
          {
            model: AircraftProgramModel,
            where: { id: 1 },
          },
        ],
      });
      routesList.forEach((ele) => {
        dbroutes += ele.name + ",";
      });
      const mergeRoutes: string =
        branchRoutes.toString() + "," + finRoutes.toString();
      const unique = [...new Set(mergeRoutes.split(","))];
      missingRoute = unique.filter((e) => !dbroutes.includes(e));
      if (missingRoute.toString().length > 0) {
        message =
          "These Routes " +
          missingRoute.toString() +
          " are missing in CoreElec Database";
      }
      return message;
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * If you want to post through swagger you need this password !
   * Historicly it was the password to destroy the database ...
   * @param password
   * @returns
   */
  public validatePassword(password: string): boolean {
    if (password && password !== "Armaguedon") return false;
    return true;
  }
}
