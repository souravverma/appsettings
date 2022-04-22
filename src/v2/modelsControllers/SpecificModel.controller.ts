import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import PartZoneModel from "../models/Partzone.model";
import Branch3dModel from "../models/Branch3d.model";
import Branch3dExtremitySolutionModel from "../models/Branch3dExtremitySolution.model";
import Branch3dExtremityTypeModel from "../models/Branch3dExtremityType.model";
import { IHarnessConsistency } from "../interfaces/HarnessConsistency.interface";
import { WhereOptions, Op } from "sequelize";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import UserAreaModel from "../models/UserAreaPartZone.model";
import CircuitModel from "../models/Circuit.model";
import FunctionalItemModel from "../models/FunctionalItem.model";
import CapitalHX2MLGenerationService from "../services/CapitalHX2MLGeneration.service";
import RouteCategoryModel from "../models/RouteCategory.model";
import CoveringElement3dModel from "../models/CoveringElement3d.model";
import BranchPointDefinitionModel from "../models/BranchPointDefinition.model";
import ComponentModel from "../models/Component.model";
import Branch3dExtremityCoveringElementRelation from "../models/Branch3dExtremityCoveringElementRelation.model";
import CoveringElementTypeModel from "../models/CoveringElementType.model";
import Branch3dSegmentModel from "../models/Branch3dSegment.model";
import Backshell3dSolutionModel from "../models/Backshell3dSolution.model";
import Harness3dDsPzRelationModel from "../models/Harness3dDsPzRelation.model";
import { IHarness3dDesignSolutionModel } from "../interfaces/IHarness3dDesignSolutionModel.interface";

const capitalService = CapitalHX2MLGenerationService.getInstance();
export class SpecificModelController {
  /**
   * @desc Return the needed data for routing service. Harness, partzone, branch, branch extremities, fin
   * @param {WhereOptions<Harness3dDesignSolutionModel>} whereClause
   * @returns {Promise<Harness3dDesignSolutionModel>} Promise<Harness3dDesignSolutionModel>
   * @memberof SpecificModelController
   */
  public async getHarnessRoutingServiceInfo(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>
  ): Promise<Harness3dDesignSolutionModel[]> {
    try {
      return await Harness3dDesignSolutionModel.findAll({
        attributes: ["id", "adapDesignSolutionNumber"],
        where: whereClause,
        include: [
          {
            model: PartZoneModel,
            attributes: ["id"],
            include: [
              {
                model: Branch3dModel,
                attributes: [
                  "id",
                  "name",
                  "lengthMm",
                  "lengthForcedMm",
                  "notExtractible",
                ],
                where: { notExtractible: false },
                include: [
                  {
                    model: Branch3dExtremitySolutionModel,
                    attributes: [
                      "id",
                      "name",
                      "electricalCoordinateX",
                      "electricalCoordinateY",
                      "electricalCoordinateZ",
                    ],
                    include: [
                      {
                        model: FunctionalItem3dSolutionModel,
                        attributes: ["id", "instanceName3d"],
                      },
                      {
                        model: Branch3dExtremityTypeModel,
                        attributes: ["id", "name"],
                      },
                      {
                        model: Branch3dModel,
                        attributes: [
                          "id",
                          "name",
                          "lengthMm",
                          "lengthForcedMm",
                          "notExtractible",
                        ],
                        where: { notExtractible: false },
                      },
                    ],
                  },
                ],
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
   * DS List
   * @param whereClause
   * @returns
   */
  public async getHarnessPartZoneWithMp(
    whereClause: any
  ): Promise<IHarness3dDesignSolutionModel> {
    try {
      if (!whereClause.adapDesignSolutionVersionNumber) {
        const harnessPartzonesWithMp: Harness3dDesignSolutionModel[] =
          await Harness3dDesignSolutionModel.findAll({
            where: whereClause,
            include: [
              {
                model: PartZoneModel,
                include: [
                  {
                    model: FunctionalItem3dSolutionModel,
                  },
                  {
                    model: UserAreaModel,
                  },
                  {
                    model: Harness3dDsPzRelationModel,
                  },
                ],
              },
            ],
          });

        return harnessPartzonesWithMp.reduce(
          (maxAdapDesignSolutionVersionObj, currentObj) => {
            if (!maxAdapDesignSolutionVersionObj)
              maxAdapDesignSolutionVersionObj = currentObj;
            if (
              parseInt(currentObj.adapDesignSolutionVersionNumber) >
              parseInt(
                maxAdapDesignSolutionVersionObj.adapDesignSolutionVersionNumber
              )
            )
              maxAdapDesignSolutionVersionObj = currentObj;
            return maxAdapDesignSolutionVersionObj;
          },
          undefined
        );
      }
      return await Harness3dDesignSolutionModel.findOne({
        where: whereClause,
        include: [
          {
            model: PartZoneModel,
            include: [
              {
                model: FunctionalItem3dSolutionModel,
              },
              {
                model: UserAreaModel,
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
   *
   * @param whereClause
   * @returns
   */
  public async getHarnessPartZoneWithOrigin(
    whereClause: WhereOptions<IHarness3dDesignSolutionModel>
  ): Promise<Harness3dDesignSolutionModel> {
    try {
      return await Harness3dDesignSolutionModel.findOne({
        where: whereClause,
        include: [
          {
            model: PartZoneModel,
            include: [
              {
                model: UserAreaModel,
              },
              {
                model: PartZoneModel,
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
   *
   * @param whereClause
   * @returns
   */
  public async getHarnessVuvb(
    whereClause: WhereOptions<IHarness3dDesignSolutionModel>
  ): Promise<IHarness3dDesignSolutionModel> {
    try {
      const result: Harness3dDesignSolutionModel =
        await Harness3dDesignSolutionModel.findOne({
          where: whereClause,
          include: [
            {
              model: FunctionalItemModel,
              include: [
                {
                  model: CircuitModel,
                  required: false,
                  where: { letters: ["VB", "VU"] },
                  attributes: ["id", "letters"],
                },
              ],
            },
          ],
        });
      return this.setVUVBValues(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async getRoutes(
    whereClause: WhereOptions<IHarness3dDesignSolutionModel>
  ): Promise<string[]> {
    return await new Promise((resolve, reject) => {
      Harness3dDesignSolutionModel.findOne({
        attributes: [
          "id",
          "adapDesignSolutionNumber",
          "adapDesignSolutionVersionNumber",
          "adapDesignSolutionIssueNumber",
        ],
        where: whereClause,
        include: [
          {
            model: PartZoneModel,
            attributes: ["id", "name", "version", "issue"],
            include: [
              {
                model: Branch3dModel,
                attributes: ["id"],
                include: [
                  {
                    model: Branch3dExtremitySolutionModel,
                    attributes: ["id"],
                    include: [
                      {
                        model: FunctionalItem3dSolutionModel,
                        attributes: ["id"],
                      },
                    ],
                  },
                  {
                    model: RouteCategoryModel,
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      })
        .then((result) => {
          // results.map((harness3dDesignSolution: Harness3dDesignSolutionModel) => {
          const routes1: string[] = []; // to store routes
          result.partZone.forEach((pz: any) => {
            pz.b3d.forEach((b3d: any) => {
              b3d.effectiveRoutes.forEach((route: any) => {
                if (!routes1.length) routes1.push(route.name);
                else {
                  if (!routes1.includes(route.name)) routes1.push(route.name);
                }
              });
            });
          });
          console.log("routes", routes1);
          resolve(routes1);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Set new data for Vu VB
   * @param result
   * @returns
   */
  public setVUVBValues(
    result: IHarness3dDesignSolutionModel
  ): Promise<IHarness3dDesignSolutionModel> {
    const tempData: any = {};
    if (result.fin.length) {
      const data = result.fin.some((vu) => {
        if (vu.circuit !== null && vu.circuit.letters !== null) {
          if (vu.circuit.letters === "VB" || vu.circuit.letters === "VU") {
            tempData["circuit"] = vu.circuit.letters ? vu.circuit.letters : "";
            tempData["sequenceNumber"] = vu.sequenceNumber
              ? vu.sequenceNumber
              : "";
            return true;
          }
        }
        return false;
      });
    }
    return tempData;
  }

  public async generateCapitalXMLForHarness(
    adapDesignSolutionNumber: string,
    adapDSVersion: string,
    include_non_extractible: string,
    suppress_small_br: boolean,
    merge_protections: boolean,
    pzList: Object,
    routes: string[],
    // fetches list of center and normal vectors for topology translation
    moveTopVal: number[],
    branch_point: boolean
  ) {
    // setting supress_small br and include_non_extractible options
    capitalService.setOptions(
      include_non_extractible,
      suppress_small_br,
      merge_protections,
      moveTopVal,
      routes,
      branch_point
    );
    let pzList_filled = false; // to check pzList is empty or not
    let routeList_filled = false;
    console.log("in service", pzList);
    const xformatter = require("xml-formatter");
    const XMLWriter = require("xml-writer");
    const xw = new XMLWriter();
    xw.startDocument("1.0", "UTF-8");
    xw.endDocument();
    if (Object.keys(pzList).length != 0) {
      pzList_filled = true;
    }
    if (Object.keys(routes).length != 0) {
      routeList_filled = true;
    }
    console.log("thispzlist", pzList);
    console.log("adapdsver", adapDSVersion);
    let MyHarness: Harness3dDesignSolutionModel;

    await new Promise((resolve, reject) => {
      Harness3dDesignSolutionModel.findOne({
        attributes: [
          "id",
          "adapDesignSolutionNumber",
          "adapDesignSolutionVersionNumber",
          "adapDesignSolutionIssueNumber",
        ],
        where:
          adapDSVersion === null
            ? { adapDesignSolutionNumber: adapDesignSolutionNumber }
            : {
                adapDesignSolutionNumber: adapDesignSolutionNumber,
                adapDesignSolutionVersionNumber: adapDSVersion,
              },
        include: [
          {
            model: PartZoneModel,
            attributes: ["id", "name", "version", "issue"],
            // filter by selected partzone names
            where: pzList_filled === true ? { name: pzList } : {},
          },
        ],
      })
        .then((result) => {
          // results.map((harness3dDesignSolution: Harness3dDesignSolutionModel) => {
          MyHarness = result;
          console.log("resolved harness to pz");
          resolve(MyHarness);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
    const MyPartZones: PartZoneModel[] = []; // to store all pz info
    let MyPartZone: PartZoneModel; //to process each pz content
    try {
      await Promise.all(
        MyHarness.partZone.map(async (pz) => {
          MyPartZone = await this.GetPartZoneContent(
            pz,
            routes,
            routeList_filled
          );
          MyPartZones.push(MyPartZone);
        })
      );
    } catch (error) {
      console.log("Error Fetching Partzones:", error);
      return Promise.reject(error);
    }
    const list1: string[] = [];
    MyPartZones.forEach((pz) => {
      list1.push(pz.userArea.name);
    });
    console.log(list1);
    MyPartZones.sort(function (a, b) {
      const nameA = a.userArea.name;
      const nameB = b.userArea.name;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    const list2: string[] = [];
    MyPartZones.forEach((pz) => {
      list2.push(pz.userArea.name);
    });
    console.log(list2);
    const capitalXML =
      await CapitalHX2MLGenerationService.getInstance().createBaseHX2MLfile(
        MyHarness,
        MyPartZones
      );
    return Promise.resolve(xw.toString() + xformatter(capitalXML));
  }

  public async GetPartZoneContent(
    pz: PartZoneModel,
    routes: Object,
    routeList_filled: boolean
  ): Promise<PartZoneModel> {
    return await new Promise((resolve, reject) => {
      PartZoneModel.findOne({
        where: { id: pz.id },
        include: [
          {
            model: Branch3dModel,
            attributes: [
              "id",
              "name",
              "lengthMm",
              "lengthForcedMm",
              "notExtractible",
              "diameter3dMm",
              "bendRadius",
            ],
            /* where: { notExtractible: false }, */
            include: [
              {
                model: Branch3dExtremitySolutionModel,
                attributes: [
                  "id",
                  "name",
                  "electricalCoordinateX",
                  "electricalCoordinateY",
                  "electricalCoordinateZ",
                ],
                include: [
                  {
                    model: Branch3dExtremityCoveringElementRelation,
                  },
                  {
                    model: FunctionalItem3dSolutionModel,
                    attributes: [
                      "id",
                      "partNumber3d",
                      "longPartNumber",
                      "mountingPriority",
                      "instanceName3d",
                      "definitionZone",
                      "panel",
                    ],
                    include: [
                      {
                        model: FunctionalItemModel,
                        attributes: [
                          "sequenceNumber",
                          "suffix",
                          "appendedLetter",
                        ],
                        include: [
                          {
                            model: CircuitModel,
                            attributes: ["letters"],
                          },
                        ],
                      },
                      {
                        model: Backshell3dSolutionModel,
                        attributes: [
                          "backshellOrientation",
                          "backshellOrientationReference",
                          "partNumber3d",
                          "type",
                        ],
                      },
                    ],
                  },
                  {
                    model: Branch3dExtremityTypeModel,
                    attributes: ["name"],
                  },
                ],
              },
              {
                model: RouteCategoryModel,
                attributes: ["name"],
              },
              {
                model: BranchPointDefinitionModel,
                attributes: [
                  "id",
                  "coordinateX",
                  "coordinateY",
                  "coordinateZ",
                  "vectorX",
                  "vectorY",
                  "vectorZ",
                  "middle",
                ],
              },
              {
                model: Branch3dSegmentModel,
                attributes: ["name"],
              },
              {
                model: CoveringElement3dModel,
                attributes: [
                  "id",
                  "name",
                  "diameterMm",
                  "lengthMm",
                  "printedLabel1",
                  "printedLabel2",
                  "printedLabel3",
                ],
                include: [
                  {
                    model: ComponentModel,
                    attributes: ["id", "partNumber"],
                  },
                  {
                    model: Branch3dExtremityCoveringElementRelation,
                  },
                  {
                    model: CoveringElementTypeModel,
                    attributes: ["name"],
                  },
                  {
                    model: Branch3dModel,
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
          {
            model: UserAreaModel,
            attributes: ["name"],
          },
        ],
      })
        .then((result) => {
          // results.map((harness3dDesignSolution: Harness3dDesignSolutionModel) => {
          console.log("resolved all info");
          resolve(result);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
}
