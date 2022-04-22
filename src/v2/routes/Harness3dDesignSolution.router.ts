import { Request, Response, Router } from "express";
import { GenericModelController } from "../modelsControllers/GenericModel.controller";
import { ApiResponseManager } from "../services/ApiResponseManager.service";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import FunctionalItemModel from "../models/FunctionalItem.model";
import DeliverableAssemblySolutionModel from "../models/DeliverableAssemblySolution.model";
import MajorComponentAssemblyModel from "../models/MajorComponentAssembly.model";
import PartZoneModel from "../models/Partzone.model";
import { SpecificModelController } from "../modelsControllers/SpecificModel.controller";
import { ProptoolConfig } from "../ConfigurationFiles/proptool.config";
import jsonData from "../ConfigurationFiles/Regex.json";
import { IPartZoneManagerData } from "../interfaces/mapping.interface";
import CreationController from "../controllers/Creation.controller";
import ValidatorService from "../services/Validator.service";
import HarnessDictionnaryService from "../services/HarnessDictionnary.service";
import passport from "passport";
import { RoleGuard, TokenService } from "@airbus/lib-auth-express";
import { IWhereClause } from "../interfaces/WhereClause.interface";
import UpdateHarnessForDesignSolution from "../modelsControllers/Harness/UpdateHarnessForDS.controller";
import HarnessCSVForDownload from "../modelsControllers/Harness/HarnessCSVForDownload.controller";
import axios from "axios";
import { config } from "../ConfigurationFiles/config";
import CSVForDSComposition from "../modelsControllers/Harness/CSVForDSComposition.controller";
import HarnessFunctionalItem from "../modelsControllers/Harness/HarnessFunctionalItem.controller";
import HarnessUserarea from "../modelsControllers/Harness/HarnessUserarea.controller";
import HarnessHelper from "../modelsControllers/Harness/HarnessHelper.controller";
import { container } from "tsyringe";

const harness3dDesignSolutionRouter: Router = Router();
const controller = GenericModelController.getInstance();
// const specificModel = SpecificModelController.getInstance();

harness3dDesignSolutionRouter.get(
  "/partZone",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Harness3dDesignSolutionModel,
        PartZoneModel,
        req.query as IWhereClause
      )
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

// TODO: NEED TO UNDERSTAND THE CALL
harness3dDesignSolutionRouter.post(
  "/partZone",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-write"]),
  async (req: Request, res: Response) => {
    let modifyVUVB = false;
    let newSequenceNumber: any = null;
    let newCircuit: any = null;
    const apiResponseManager = new ApiResponseManager(res);
    const harnessData: IPartZoneManagerData = req.body;
    const harnessDictionnary: HarnessDictionnaryService =
      new HarnessDictionnaryService(); // the disctonary is use to know wich harness is on going

    modifyVUVB = harnessData.functionalItem.fromFinListModal;
    newSequenceNumber = harnessData.functionalItem.newsequenceNumber;
    newCircuit = harnessData.functionalItem.newcircuit;

    // we generate the CA and it version for now. Will be depreciate soon
    if (modifyVUVB) {
      harnessData.harness3dDesignSolution.caccDsNumber =
        "D929" +
        harnessData.partZone[0].name.substr(4, 1) +
        newSequenceNumber +
        "000";
      harnessData.harness3dDesignSolution.caccDsSolution = "001";
    } else {
      harnessData.harness3dDesignSolution.caccDsNumber =
        "D929" +
        harnessData.partZone[0].name.substr(4, 1) +
        harnessData.functionalItem.sequenceNumber +
        "000";
      harnessData.harness3dDesignSolution.caccDsSolution = "001";
    }

    // Validator service that we use to validate the fields of the req.body -- return and array of errors
    const validator =
      ValidatorService.getInstance().validatePartZoneManagerData(harnessData);

    // if errors found, we throw an error
    // if (validator.length)
    //   return apiResponseManager.errorResponse(Object.assign(validator[0], { status: 400 }));

    if (validator.length) {
      const circuitError = validator.find(
        (error) => error.message === "circuit is missing"
      );
      if (circuitError) {
        circuitError.message =
          "Cannot store design solution: VUVB Code is missing";
        return apiResponseManager.errorResponse(
          Object.assign(circuitError, { status: 409 })
        );
      }
      return apiResponseManager.errorResponse(
        Object.assign(validator[0], { status: 400 })
      );
    }
    // Let's find out the major component assembly :AD / AF ... It is the 5th charactere on the DS number
    for (const iteration of Object.entries(jsonData.MAJOR_COMPONENT_ASSEMBLY)) {
      const name = iteration[0];
      const number = iteration[1];
      if (
        number.includes(
          harnessData.harness3dDesignSolution.adapDesignSolutionNumber.substr(
            4,
            1
          )
        )
      ) {
        harnessData.majorComponentAssembly = { name: name };
      }
    }

    // Same stuff  for the aircraft program. Here we the first letter of the DS number
    for (const iteration of Object.entries(jsonData.AIRCRAFT_PROGRAM)) {
      const name = iteration[0];
      const letters = iteration[1];

      if (
        letters.includes(
          harnessData.harness3dDesignSolution.adapDesignSolutionNumber.substr(
            0,
            1
          )
        )
      ) {
        harnessData.aircraftProgram = { familyName: name };
      }
    }

    try {
      const adapDSData = {
        adapDesignSolutionNumber:
          harnessData.harness3dDesignSolution.adapDesignSolutionNumber,
        adapDesignSolutionVersionNumber:
          harnessData.harness3dDesignSolution.adapDesignSolutionVersionNumber,
        adapDesignSolutionIssueNumber:
          harnessData.harness3dDesignSolution.adapDesignSolutionIssueNumber,
      };
      await harnessDictionnary.addEntry(adapDSData);
    } catch (err) {
      console.log(err);
      console.log("err harnessDictionnary.addEntry", err);
    }

    // set to true will allow to remove associated PZ if not needed anymore.
    // TODO: NEED TO MODIFY, CURRENTLY THIS FLAG DELETES THE PARTZONE ON HARNESS UPDATE
    // harnessData.harness3dDesignSolution.fromPZM = true;
    // we've got everything, we can create all the stuff !
    // MAYBE HERE !!!
    const creationController = container.resolve(CreationController);
    creationController
      .createComponents(
        false,
        harnessData,
        ProptoolConfig,
        req.body.partZoneList
      )
      .then(() => {
        if (modifyVUVB) {
          return apiResponseManager.successResponse([
            `VUVB ${newSequenceNumber}${newCircuit} Modified with success`,
          ]);
        }
        return apiResponseManager.successResponse([
          `Design Solution ${harnessData.harness3dDesignSolution.adapDesignSolutionNumber} is saved with success`,
        ]);
      })
      .catch((err: Error) => {
        console.log("CreationController.getInstance().create Error", err);

        return apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/majorComponentAssembly",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Harness3dDesignSolutionModel,
        MajorComponentAssemblyModel,
        req.query as IWhereClause
      )
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/deliverableAssemblySolution",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Harness3dDesignSolutionModel,
        DeliverableAssemblySolutionModel,
        req.query as IWhereClause
      )
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/functionalItem",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    controller
      .getAllWith(
        Harness3dDesignSolutionModel,
        FunctionalItemModel,
        req.query as IWhereClause
      )
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

/**
 * freezeDS
 */
harness3dDesignSolutionRouter.post(
  "/freezeDS",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-write"]),
  (req: Request, res: Response) => {
    const updateHarnessForDesignSolution = new UpdateHarnessForDesignSolution();
    const apiResponseManager = new ApiResponseManager(res);
    updateHarnessForDesignSolution
      .freezeDesignSolution(req.body)
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.post(
  "/unfreezeDS",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const updateHarnessForDesignSolution = new UpdateHarnessForDesignSolution();
    updateHarnessForDesignSolution
      .unfreezeDesignSolution(req.body.adapDesignSolutionNumber)
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.post(
  "/CSVforDSauto",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const harnessCSVForDownload = new HarnessCSVForDownload();
    harnessCSVForDownload
      .CSVforDesignSolution(req.body.adapDsNumber, req.body.adapDSVersion)
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/APSData",
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const tokenService = new TokenService();
      const authToken = await tokenService.getToken();
      console.log("authURL", config.authUrl);
      const result = await axios.get(config.authUrl, {
        headers: { Authorization: "Bearer " + authToken },
      });
      const token = result.data.access_token;
      console.log(result.data.access_token, "bearerToken");
      console.log("APSurl", config.apsUrl);
      const apsUrl = `${config.apsUrl}/${req.query.adapDesignSolutionNumber}?program=${req.query.program}&source=${req.query.source}`;
      // getting APS data after getting auth token
      const APSData = await axios.get(apsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      apiResponseManager.successResponse(APSData.data);
    } catch (error) {
      apiResponseManager.errorResponse({
        name: "Error",
        message: error,
      });
    }
  }
);

/**
 * Router is used from  the GUI to generate the downloadable XML
 */
harness3dDesignSolutionRouter.get(
  "/CapitalXML/:adapDesignSolutionNumber",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    specificModel
      .getRoutes({
        adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
      })
      .then((result) => {
        if (result) {
          apiResponseManager.successResponse(result);
        } else
          apiResponseManager.errorResponse({
            name: "Error",
            message: "Harness not found",
            code: "Harness not found with the given adapDsNumber.",
            status: 404,
          });
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);
harness3dDesignSolutionRouter.post(
  "/CapitalXML/:adapDesignSolutionNumber",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    let include_non_extractible = "noNE";
    let suppress_small_br = false;
    let merge_protections = false;
    let branch_point = false;
    let pzList = [];
    let routes = [];
    let moveTopVal: number[] = []; // to have values for topology movement
    routes = req.body.routes;
    console.log("this routesList", routes);
    pzList = req.body.pzList;
    console.log("this pzlist", pzList);
    moveTopVal = req.body.moveTopVal;
    console.log("center&normal values", moveTopVal);
    let adapDSVersion = "";
    adapDSVersion = req.body.adapDSVersion;
    switch (req.query.include_non_extractible) {
      case "allNE":
        include_non_extractible = "allNE";
        break;
      case "finNE":
        include_non_extractible = "finNE";
        break;
      case "finVTNE":
        include_non_extractible = "finVTNE";
        break;
      default:
        include_non_extractible = "noNE";
    }
    if (
      req.query.suppress_small_br != null &&
      req.query.suppress_small_br === "true"
    )
      suppress_small_br = true;
    if (
      req.query.merge_protections != null &&
      req.query.merge_protections === "true"
    )
      merge_protections = true;
    if (req.query.branch_point != null && req.query.branch_point === "true")
      branch_point = true;
    console.log(" **** Options 1 ", include_non_extractible);
    console.log(" **** Options 2 ", suppress_small_br);
    console.log(" **** Options 3 ", merge_protections);
    specificModel
      .generateCapitalXMLForHarness(
        req.params.adapDesignSolutionNumber,
        req.body.adapDSVersion,
        include_non_extractible,
        suppress_small_br,
        merge_protections,
        pzList,
        routes,
        moveTopVal,
        branch_point
      )
      .then((result) => {
        if (result) {
          // console.log('Results ::: ' + result);
          apiResponseManager.successResponse(result);
          // apiResponseManager.successResponseXML(result);
        } else
          apiResponseManager.errorResponse({
            name: "Error",
            message: "Harness not found",
            code: "Harness not found with the given adapDsNumber.",
            status: 404,
          });
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

/**
 * router is used from the swagger to get the XML as a text
 */

harness3dDesignSolutionRouter.post(
  "/CapitalXMLAPI/:adapDesignSolutionNumber",
  (req: Request, res: Response) => {
    const specificModel = new SpecificModelController();
    const apiResponseManager = new ApiResponseManager(res);
    let include_non_extractible = "noNE";
    let suppress_small_br = false;
    let merge_protections = false;
    let branch_point = false;
    let pzList = [];
    let routes = [];
    let moveTopVal: number[] = [];
    routes = req.body.routes;
    pzList = req.body.partzoneList;
    moveTopVal = req.body.moveTopVal;
    let adapDSVersion = "";
    adapDSVersion = req.body.adapDSVersion;
    switch (req.query.include_non_extractible) {
      case "allNE":
        include_non_extractible = "allNE";
        break;
      case "finNE":
        include_non_extractible = "finNE";
        break;
      case "finVTNE":
        include_non_extractible = "finVTNE";
        break;
      default:
        include_non_extractible = "noNE";
    }
    if (
      req.query.suppress_small_br != null &&
      req.query.suppress_small_br === "true"
    )
      suppress_small_br = true;
    if (
      req.query.merge_protections != null &&
      req.query.merge_protections === "true"
    )
      merge_protections = true;
    if (req.query.branch_point != null && req.query.branch_point === "true")
      branch_point = true;
    console.log(
      "************** OPTIONS include_non_extractible:",
      include_non_extractible
    );
    console.log("************** OPTIONS suppress_small_br:", suppress_small_br);
    // passing the two options value from the interface before generating CapialXML
    specificModel
      .generateCapitalXMLForHarness(
        req.params.adapDesignSolutionNumber,
        req.body.adapDSVersion,
        include_non_extractible,
        suppress_small_br,
        merge_protections,
        pzList,
        routes,
        moveTopVal,
        branch_point
      )
      .then((result) => {
        if (result) {
          apiResponseManager.successResponseXML(result);
        } else
          apiResponseManager.errorResponse({
            name: "Error",
            message: "Harness not found",
            code: "Harness not found with the given adapDsNumber.",
            status: 404,
          });
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

/**
 * Router has been used from GUI to Download DSAutoCSV
 */
harness3dDesignSolutionRouter.get(
  "/CSVforDSauto/:adapDesignSolutionNumber",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const whereClause: {
      adapDesignSolutionNumber?: string;
      adapDesignSolutionVersionNumber?: any;
    } = {};
    whereClause.adapDesignSolutionNumber = req.params.adapDesignSolutionNumber;
    whereClause.adapDesignSolutionVersionNumber = req.query.dsversion;
    const generateCSVForDSComposition = new CSVForDSComposition();
    generateCSVForDSComposition
      .generateCSVforDSautoForHarness(whereClause)
      .then((result) => {
        if (result) {
          apiResponseManager.successResponse(result);
        } else
          apiResponseManager.errorResponse({
            name: "Error",
            message: "Harness not found",
            code: "Harness not found with the given adapDsNumber.",
            status: 404,
          });
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

/**
 * router is used from  the GUI to download CSV for Manual sync DS
 */
harness3dDesignSolutionRouter.get(
  "/getAllManualSyncDsList",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const generateCSVForDSComposition = new CSVForDSComposition();
      const result =
        await generateCSVForDSComposition.generateCSVforAllDSComposition(true);
      if (result) {
        apiResponseManager.successResponse(result);
      } else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Unable to fetch DS Data",
          code: "Unable to fetch DS Data.",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse(error);
    }
  }
);

/**
 * router is used from  the GUI to download CSV for getAdapCiLoDsStatus
 */
harness3dDesignSolutionRouter.get(
  "/getAdapCiLoDsStatusList",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const generateCSVForDSComposition = new CSVForDSComposition();
      const dsData = await generateCSVForDSComposition.getAdapCiLoDsStatus();
      const result =
        generateCSVForDSComposition.JsonDataGeneratorforAdapCiLoDsStatus(
          dsData
        );

      if (result) {
        apiResponseManager.successResponse(result);
      } else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Unable to fetch Data",
          code: "Unable to fetch Data.",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse(error);
    }
  }
);

/**
 * router is used from  the GUI to download CSV for DS constitution
 */
harness3dDesignSolutionRouter.get(
  "/CSVforDSConstitution/:adapDesignSolutionNumber/:adapDesignSolutionVersionNumber",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    if (req.params.adapDesignSolutionVersionNumber === "null") {
      delete req.params["adapDesignSolutionVersionNumber"];
    }
    // handling null in version request
    if (req.query.version === "null") {
      delete req.query["version"];
    }
    try {
      const generateCSVForDSComposition = new CSVForDSComposition();
      let hasDSConstitutionTab = true;
      if (req.query.name) {
        hasDSConstitutionTab = false;
      }

      const result =
        await generateCSVForDSComposition.generateCSVForDSComposition(
          req.params,
          req.query,
          hasDSConstitutionTab
        );
      if (result) {
        apiResponseManager.successResponse(result);
      } else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Unable to fetch DS Data",
          code: "Unable to fetch DS Data.",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse(error);
    }
  }
);

/**
 * Router is used from  the GUI to download CSV for All DS constitution
 */
harness3dDesignSolutionRouter.get(
  "/CSVforAllDSConstitution",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  async (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    try {
      const generateCSVForDSComposition = new CSVForDSComposition();
      const result =
        await generateCSVForDSComposition.generateCSVforAllDSComposition();
      if (result) {
        apiResponseManager.successResponse(result);
      } else
        apiResponseManager.errorResponse({
          name: "Error",
          message: "Unable to fetch DS Data",
          code: "Unable to fetch DS Data.",
          status: 404,
        });
    } catch (error) {
      apiResponseManager.errorResponse(error);
    }
  }
);

harness3dDesignSolutionRouter.head(
  "/:adapDesignSolutionNumber/hasPartZoneOn/:UserAreaName",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const harnessUserarea = new HarnessUserarea();
    harnessUserarea
      .checkHarnessHasPartZoneOnUserArea(
        { adapDesignSolutionNumber: req.params.adapDesignSolutionNumber },
        req.params.UserAreaName
      )
      .then((result: boolean) => {
        if (result) res.sendStatus(200);
        else res.sendStatus(404);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber/:adapDesignSolutionVersionNumber/routingInfo",
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    const query = req.params;
    if (query.adapDesignSolutionVersionNumber === "null") {
      delete query["adapDesignSolutionVersionNumber"];
    }
    specificModel
      .getHarnessRoutingServiceInfo(query)
      .then((result) => {
        if (result) apiResponseManager.successResponse(result);
        else
          apiResponseManager.errorResponse({
            name: "Error",
            message: "Harness not found",
            code: "Harness not found with the given adapDsNumber.",
            status: 404,
          });
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapCi/getAdapDsByAdapId",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const harnessHelper = new HarnessHelper();
    if (!req.params.adapCi)
      return apiResponseManager.errorResponse({
        ...new Error("adapCi attribute is needed"),
        status: 422,
      });

    harnessHelper
      .getHarnessByAdapCi({
        number: req.params.adapCi,
      })
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber/partZones/mp-fin",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const harnessHelper = new HarnessHelper();
    if (!req.params.adapDesignSolutionNumber)
      return apiResponseManager.errorResponse({
        ...new Error("adapDesignSolutionNumber attribute is needed"),
        status: 422,
      });

    harnessHelper
      .getHarnessWithoutPartZones({
        adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
      })
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber/partZones/mp-pz",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    if (!req.params.adapDesignSolutionNumber)
      return apiResponseManager.errorResponse({
        ...new Error("adapDesignSolutionNumber attribute is needed"),
        status: 422,
      });
    const query: any = {
      adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
    };
    if (req.query.issue && req.query.issue !== "null") {
      query["adapDesignSolutionIssueNumber"] = req.query.issue;
    }
    if (req.query.version && req.query.version !== "null") {
      query["adapDesignSolutionVersionNumber"] = req.query.version;
    }
    specificModel
      .getHarnessPartZoneWithMp(query)
      .then((result) => {
        // console.log(result);
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber/partZones/mp-pz-origin",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    if (!req.params.adapDesignSolutionNumber)
      return apiResponseManager.errorResponse({
        ...new Error("adapDesignSolutionNumber attribute is needed"),
        status: 422,
      });
    const query: any = {
      adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
    };
    if (req.query.issue && req.query.issue !== "null") {
      query["adapDesignSolutionIssueNumber"] = req.query.issue;
    }
    if (req.query.version && req.query.version !== "null") {
      query["adapDesignSolutionVersionNumber"] = req.query.version;
    }
    specificModel
      .getHarnessPartZoneWithOrigin(query)
      .then((result) => {
        // console.log(result);
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber/getvuvb",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    const specificModel = new SpecificModelController();
    if (!req.params.adapDesignSolutionNumber)
      return apiResponseManager.errorResponse({
        ...new Error("adapDesignSolutionNumber attribute is needed"),
        status: 422,
      });
    specificModel
      .getHarnessVuvb({
        adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
      })
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber/fin",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    if (!req.params.adapDesignSolutionNumber)
      return apiResponseManager.errorResponse({
        ...new Error("adapDesignSolutionNumber attribute is needed"),
        status: 422,
      });

    const harnessFunctionalItem = new HarnessFunctionalItem();
    harnessFunctionalItem
      .getHarnessPartZoneWithFin({
        adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
      })
      .then((result) => {
        apiResponseManager.successResponse(result);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);

harness3dDesignSolutionRouter.get(
  "/:adapDesignSolutionNumber",
  passport.authenticate("jwt", { session: false }),
  new RoleGuard().requireAuth(["partzone_manager-ds-read"]),
  (req: Request, res: Response) => {
    const apiResponseManager = new ApiResponseManager(res);
    if (!req.params.adapDesignSolutionNumber)
      return apiResponseManager.errorResponse({
        ...new Error("adapDesignSolutionNumber attribute is needed"),
        status: 422,
      });
    const query: any = {
      adapDesignSolutionNumber: req.params.adapDesignSolutionNumber,
    };
    if (req.query.issue && req.query.issue !== "null") {
      query["adapDesignSolutionIssueNumber"] = req.query.issue;
    }
    if (req.query.version && req.query.version !== "null") {
      query["adapDesignSolutionVersionNumber"] = req.query.version;
    }
    controller
      .getAll(Harness3dDesignSolutionModel, query)
      .then((result) => {
        if (result.length) apiResponseManager.successResponse(result);
        else res.sendStatus(404);
      })
      .catch((err: Error) => {
        apiResponseManager.errorResponse(err);
      });
  }
);
harness3dDesignSolutionRouter.head("", (req: Request, res: Response) => {
  const apiResponseManager = new ApiResponseManager(res);
  if (!req.query.adapDesignSolutionNumber)
    return apiResponseManager.errorResponse({
      ...new Error("adap design solution number attribute is needed"),
      status: 422,
    });

  controller
    .getAll(Harness3dDesignSolutionModel, req.query as IWhereClause)
    .then((result) => {
      if (result.length) res.sendStatus(200);
      else res.sendStatus(404);
    })
    .catch((err: Error) => {
      apiResponseManager.errorResponse(err);
    });
});

harness3dDesignSolutionRouter.get("", (req: Request, res: Response) => {
  const query: any = req.query;
  const getHighestVer = query["getHighestVer"];
  if (getHighestVer) {
    delete query["getHighestVer"];
  }
  const apiResponseManager = new ApiResponseManager(res);
  controller
    .getAll(Harness3dDesignSolutionModel, query)
    .then((result) => {
      if (getHighestVer) {
        let highestVersion = "0";
        result.forEach((ds: Harness3dDesignSolutionModel) => {
          // tslint:disable-next-line: radix
          if (
            typeof parseInt(ds.adapDesignSolutionVersionNumber) === "number"
          ) {
            if (
              parseInt(highestVersion) <
              parseInt(ds.adapDesignSolutionVersionNumber)
            ) {
              highestVersion = ds.adapDesignSolutionVersionNumber;
            }
          }
        });
        apiResponseManager.successResponse({ highestVersion: highestVersion });
      } else {
        apiResponseManager.successResponse(result);
      }
    })
    .catch((err: Error) => {
      apiResponseManager.errorResponse(err);
    });
});
export default harness3dDesignSolutionRouter;
