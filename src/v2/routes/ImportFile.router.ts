import { Request, Response, Router } from "express";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import CreationController from "../controllers/Creation.controller";
import HarnessDictionaryService from "../services/HarnessDictionnary.service";
import { ProptoolConfig } from "../ConfigurationFiles/proptool.config";
import PartZoneRelatedHarness from "../modelsControllers/Partzone/PartZoneRelatedHarness.controller";
import passport from "passport";
import { RoleGuard } from "@airbus/lib-auth-express";
import * as GlobalEnums from "../ConfigurationFiles/GlobalEnums";
import ValidatePartZoneService from "../services/ValidatePartZone.service";
import {
  IMappedData,
  IPartZoneManagerData,
} from "../interfaces/mapping.interface";
import PartzoneRouteContinutityChecker from "../modelsControllers/Partzone/PartZoneRouteContinutityChecker.controller";
import { Op, WhereOptions } from "sequelize";
import PartZoneModel from "../models/Partzone.model";
import { container } from "tsyringe";
const ImportFileRouter: Router = Router();
let relatedHarnessList: any[];
/**
 *  Will receive the proptool file
 *  Get all related harness of the current Partzone
 */
ImportFileRouter.post(
  "/catia-v5-protool",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-write"]),
  async (req: Request, res: Response) => {
    const validatePartZoneService = new ValidatePartZoneService();
    const apiResponseManager = new ApiResponseManager(res);

    if (!validatePartZoneService.validatePassword) {
      return apiResponseManager.forbiddenResponse(
        "You're not allowed to do that."
      );
    }
    try {
      const creationController = container.resolve(CreationController);
      const partzoneRouteContinutityChecker: PartzoneRouteContinutityChecker =
        new PartzoneRouteContinutityChecker();
      const harnessDictionary: HarnessDictionaryService =
        new HarnessDictionaryService();

      const data: any = [req.body];
      let proptoolFileValidated = true;
      let newRelatedHarnessList: any[] = [];
      ({ proptoolFileValidated, newRelatedHarnessList } =
        await validateProptoolFile(
          data,
          validatePartZoneService,
          apiResponseManager
        ));
      let changePsSynchroStatusFlag = false;
      if (proptoolFileValidated) {
        data[0].partZone.forEach(
          async (pz: { name: any; version: any; issue: string }) => {
            const partZoneDetails = await PartZoneModel.findOne({
              where: {
                name: pz.name,
              },
            });
            if (
              pz.issue !== undefined &&
              partZoneDetails.issue &&
              partZoneDetails.issue !== pz.issue
            ) {
              changePsSynchroStatusFlag = true;
            }
          }
        );
        await Promise.all(
          data.map(async (element: IMappedData | IPartZoneManagerData) => {
            const routeResponse =
              await validatePartZoneService.checkForMissingRoute(element);
            extractToDictionary(newRelatedHarnessList, harnessDictionary);
            addDesignSolutionNumber(element, newRelatedHarnessList);

            await creationController.createComponents(
              true,
              element,
              ProptoolConfig
            );

            buildFeedbackMessages(
              newRelatedHarnessList,
              element,
              apiResponseManager,
              routeResponse
            );
            await routeContunityCheck(element, partzoneRouteContinutityChecker);
            return Promise.resolve();
          })
        );
        await creationController.performConsistencyCheck(
          changePsSynchroStatusFlag,
          harnessDictionary
        );
      }
    } catch (error) {
      apiResponseManager.successResponse({
        status: false,
        message: error.message,
      });
    }
  }
);

export default ImportFileRouter;

async function routeContunityCheck(
  element: IMappedData | IPartZoneManagerData,
  partzoneRouteContinutityChecker: PartzoneRouteContinutityChecker
) {
  if (!element.partZone[0].origin) {
    const whereClausePz: WhereOptions<PartZoneModel> = {
      name: element.partZone[0].name,
    };
    if (element.partZone[0].version) {
      whereClausePz.version = element.partZone[0].version;
    }
    whereClausePz.dataStatus = { [Op.not]: "frozen" };

    const derivationRoutes: PartZoneModel =
      await partzoneRouteContinutityChecker.getRoutesForDerivation(
        whereClausePz
      );
    const branch3dRoutes =
      partzoneRouteContinutityChecker.getAllRoutes(derivationRoutes);
    const routeContinutiyMessage =
      partzoneRouteContinutityChecker.routeContinuityMessage(
        branch3dRoutes,
        element.partZone[0].name
      );
    await derivationRoutes.update(routeContinutiyMessage);
  }
}

/**
 * First check if the latest partzone data_status is frozen.If frozen forbid the upload.
 * Second check if the Frozen PZ version > Upload ProptoolFile Version
 * To validate the DS already created in frontend. If DS Exists raising an error Already Exist
 * @param data
 * @param apiResponseManager
 * @param validatePartZoneService
 */
async function validateProptoolFile(
  data: any,
  validatePartZoneService: ValidatePartZoneService,
  apiResponseManager: ApiResponseManager
) {
  let proptoolFileValidated = true;
  let newRelatedHarnessList: any[] = [];
  const pzRelatedHarnessController = container.resolve(PartZoneRelatedHarness);
  await Promise.all(
    data.map(async (element: any) => {
      const response =
        await validatePartZoneService.checkFrozenStatusAndVersion(
          element.partZone[0].name,
          element.partZone[0].version
        );
      if (response === GlobalEnums.DataStatusEnum.FROZENLPZ) {
        apiResponseManager.successResponse({
          status: false,
          message: GlobalEnums.ConsistencyResponseEnum.OVERWRITEFORBIDDEN,
        });
        proptoolFileValidated = false;
      } else if (response === GlobalEnums.DataStatusEnum.INCORRECTVERSION) {
        apiResponseManager.successResponse({
          status: false,
          message: `Incorrect version for PZ: ${element.partZone[0].name}`,
        });
        proptoolFileValidated = false;
      } else {
        relatedHarnessList =
          await pzRelatedHarnessController.getPartzoneRelatedToHarness(
            element.partZone[0].name,
            element.partZone[0].userArea
          );
        newRelatedHarnessList = relatedHarnessList;
        const vuvbCheck = await validatePartZoneService.checkVUVB(
          relatedHarnessList[0].adapDesignSolutionNumber,
          element.functionalItem[0].sequenceNumber,
          element.functionalItem[0].circuit
        );
        if (
          vuvbCheck &&
          vuvbCheck[0] === GlobalEnums.HarnessStatus.DSALREADYEXIST
        ) {
          apiResponseManager.successResponse({
            status: false,
            message: `DS Already Exist in VUVB: ${vuvbCheck[1]}${vuvbCheck[2]}.
                    Please Correct the VUVB in Proptool File`,
          });
          proptoolFileValidated = false;
        }
      }
      return Promise.resolve();
    })
  );

  return { proptoolFileValidated, newRelatedHarnessList };
}

/**
 * Build and Send API Success Response
 * tempDSList = relatedHarnessList.map(v => v.adapDesignSolutionNumber + v.adapDesignSolutionVersionNumber).toString();
 * Build feedback message based on the rule
 * @param relatedHarnessList
 * @param data
 * @param apiResponseManager
 * @returns
 */
function buildFeedbackMessages(
  relatedHarnessList: any[],
  data: any,
  apiResponseManager: ApiResponseManager,
  routeResponse: any
) {
  let tempDSList: any = "";
  let impactedDsMsg: any = "";
  console.log(data.partZone[0].name, "Data PartZone");
  relatedHarnessList.forEach((v: any) => {
    console.log("v.adapDesignSolutionNumber " + v.adapDesignSolutionNumber);
    console.log("v.dataStatus " + v.dataStatus);
    if (
      v.dataStatus === null ||
      (!v.dataStatus.includes("frozen") &&
        data.partZone[0].name.includes(v.adapDesignSolutionNumber.slice(0, 12)))
    ) {
      tempDSList =
        v.adapDesignSolutionNumber +
        " Version " +
        v.adapDesignSolutionVersionNumber +
        " Issue " +
        v.adapDesignSolutionIssueNumber;
    }
  });
  if (routeResponse && routeResponse !== undefined) {
    impactedDsMsg = routeResponse;
    impactedDsMsg += ` - Harness related to ${data.partZone[0].name} : ${tempDSList}`;
  } else {
    impactedDsMsg = `Harness related to ${data.partZone[0].name} : ${tempDSList}`;
  }
  apiResponseManager.successResponse({ status: true, message: impactedDsMsg });
}

/**
 * We add the Design Solution number in the data (will be useful to attach entities)
 * @param data
 * @param relatedHarnessList
 */
function addDesignSolutionNumber(data: any, relatedHarnessList: any[]) {
  data.harness3dDesignSolution = {
    adapDesignSolutionNumber: relatedHarnessList[0].adapDesignSolutionNumber,
    adapDesignSolutionVersionNumber:
      relatedHarnessList[0].adapDesignSolutionVersionNumber,
    adapDesignSolutionIssueNumber:
      relatedHarnessList[0].adapDesignSolutionIssueNumber,
    dataStatus: relatedHarnessList[0].dataStatus,
  };
}

/**
 * Add entry to the dictionary
 * @param relatedHarnessList
 * @param harnessDictionary
 */
function extractToDictionary(
  relatedHarnessList: any[],
  harnessDictionary: HarnessDictionaryService
) {
  relatedHarnessList.forEach((harness) => {
    harnessDictionary.addEntry({
      adapDesignSolutionNumber: harness.adapDesignSolutionNumber,
      adapDesignSolutionVersionNumber: harness.adapDesignSolutionVersionNumber,
      adapDesignSolutionIssueNumber: harness.adapDesignSolutionIssueNumber,
      dataStatus: harness.dataStatus,
    });
  });
}
