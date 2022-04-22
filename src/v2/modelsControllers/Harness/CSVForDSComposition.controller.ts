import PartZoneModel from "../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import ComponentModel from "../../models/Component.model";
import CoveringElement3dModel from "../../models/CoveringElement3d.model";
import Branch3dModel from "../../models/Branch3d.model";
import CoveringElementTypeModel from "../../models/CoveringElementType.model";
import Branch3dExtremityCoveringElementRelation from "../../models/Branch3dExtremityCoveringElementRelation.model";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import RouteCategoryModel from "../../models/RouteCategory.model";
import Branch3dSegmentModel from "../../models/Branch3dSegment.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import { WhereOptions } from "sequelize";
import FunctionalItemModel from "../../models/FunctionalItem.model";
import CircuitModel from "../../models/Circuit.model";
import FunctionalItem3dSolutionPartZoneRelation from "../../models/FunctionalItem3dSolutionPartZoneRelation.model";
import AdapLoModel from "../../models/AdapLo.model";
import AdapItemModel from "../../models/AdapItem.model";
export default class CSVForDSComposition {
  constructor() {}

  /**
   * query for All Ds composition
   */
  public async generateCSVforAllDSComposition(
    manulaSyncCSV?: boolean
  ): Promise<{ dsallConstitution: [] }> {
    try {
      const harnessAttributes = [
        "adap_design_solution_number",
        "adap_ds_version",
        "adap_ds_issue",
        "consolidation_status",
        "release_status",
        "data_status",
        "updated_at",
      ];
      const whereCondition: { psSynchroStatus?: string } = {};
      if (manulaSyncCSV) {
        harnessAttributes.push(
          ...["ps_synchro_status", "pdm_release_status", "ps_synchro_date"]
        );
        whereCondition.psSynchroStatus = "KO";
      }
      const dsData = await Harness3dDesignSolutionModel.findAll({
        attributes: harnessAttributes,
        where: whereCondition,
        include: [
          {
            attributes: [
              "sequence_number",
              "suffix",
              "appended_letter",
              "updated_at",
            ],
            model: FunctionalItemModel,
            include: [
              {
                attributes: ["letters"],
                where: { letters: ["VB", "VU"] },
                model: CircuitModel,
                required: true,
              },
            ],
            required: true,
          },
        ],
        order: [
          ["adap_design_solution_number", "asc"],
          ["adap_ds_version", "asc"],
        ],
        raw: true,
      });
      const excelData: any = [];
      if (dsData.length > 0) {
        dsData.forEach((obj: any) => {
          // Assinging consolidation status NA for 922/928 data
          if (
            obj["adap_design_solution_number"].charAt(3) === "8" ||
            obj["adap_design_solution_number"].charAt(3) === "2"
          ) {
            obj["consolidation_status"] = "NA";
          }
          obj["data_status"] = obj["data_status"]
            ? obj["data_status"]
            : "temporary";
          // construct json model for excel export
          const element = {
            "AdapDs Number": obj["adap_design_solution_number"],
            "AdapDs Version": obj["adap_ds_version"],
            "AdapDs Issue": obj["adap_ds_issue"],
            "Consolidation Status": obj["consolidation_status"],
            "Release Status": obj["release_status"],
            VUVB: obj["fin.sequence_number"] + obj["fin.circuit.letters"],
            "Data Status": obj["data_status"],
            "Last Modified Date": obj["updated_at"],
            psSynchroStatus: obj["ps_synchro_status"],
            pdmReleaseStatus: obj["pdm_release_status"],
            ps_synchro_date: obj["ps_synchro_date"],
          };
          excelData.push(element);
        });
      }
      return Promise.resolve({ dsallConstitution: excelData });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * query for AdapCiLoDsStatus
   * @param whereClause
   */
  public async getAdapCiLoDsStatus(): Promise<Harness3dDesignSolutionModel[]> {
    try {
      return await Harness3dDesignSolutionModel.findAll({
        attributes: [
          "adap_design_solution_number",
          "adap_ds_version",
          "adap_ds_issue",
          "ps_synchro_status",
          "ps_synchro_date",
        ],
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
        raw: true,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to generate JSON data for AdapCiLoDsStatus to export in excel sheet
   * @param dsData
   */
  public JsonDataGeneratorforAdapCiLoDsStatus(dsData: any[]) {
    const excelData: any = [];
    if (dsData.length > 0) {
      dsData.forEach((obj: any) => {
        const element = {
          "AdapDs Number": obj["adap_design_solution_number"],
          "AdapDs Version": obj["adap_ds_version"],
          "AdapDs Issue": obj["adap_ds_issue"],
          "Adap Lo": obj["adapLo.number"],
          "Adap Ci": obj["adapLo.adapItem.number"],
          "PS Sync Status": obj["ps_synchro_status"],
          "DS Sync Date": obj["ps_synchro_date"],
        };
        excelData.push(element);
      });
    }
    return { adapCiLoDsStatus: excelData };
  }
  /**
   * Downloading Ds composition
   * @param whereClause
   * @param whereClausePz
   * @param hasDSConstitution : if tab required in report
   * @returns
   */
  public async generateCSVForDSComposition(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>,
    whereClausePz: WhereOptions<PartZoneModel>,
    hasDSConstitutionTab: boolean
  ): Promise<any> {
    let promiseArray: any = [
      this.getDesignSolutionConstitutionFin(whereClause, whereClausePz),
      this.getDesignSolutionConstitutionBranches(whereClause, whereClausePz),
      this.getDesignSolutionConstitutionMarkerSleeveLta(
        whereClause,
        whereClausePz
      ),
    ];
    if (hasDSConstitutionTab) {
      promiseArray = [
        this.getDesignSolutionConstitution(whereClause),
        ...promiseArray,
      ];
    }
    const result: { [key: string]: Object }[] = await Promise.all(promiseArray);
    let excelData: Object[];
    if (result) {
      if (hasDSConstitutionTab) {
        excelData = [
          result[0],
          result[1],
          result[2],
          { marker: result[3].marker },
          { sleeve: result[3].sleeve },
          { lta: result[3].lta },
        ];
      } else {
        excelData = [
          result[0],
          result[1],
          { marker: result[2].marker },
          { sleeve: result[2].sleeve },
          { lta: result[2].lta },
        ];
      }
    }
    return excelData;
  }

  /**
   * query for Ds constitution
   * @param whereClause
   */
  public async getDesignSolutionConstitution(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>
  ) {
    try {
      let excelData: any[] = [];
      const dsData = await Harness3dDesignSolutionModel.findAll({
        attributes: [
          "adap_design_solution_number",
          "adap_ds_version",
          "adap_ds_issue",
          "updated_at",
        ],
        where: whereClause,
        include: [
          {
            attributes: [
              "name",
              "version",
              "issue",
              "updated_at",
              "dataStatus",
            ],
            model: PartZoneModel,
            required: true,
          },
        ],
        order: [["partZone", "name", "asc"]],
        raw: true,
      });
      excelData = this.JsonDataGeneratorforexcelreport(dsData);
      return Promise.resolve({ dsConstitution: excelData });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to generate JSON data to export in excel sheet
   * @param dsData
   */
  public JsonDataGeneratorforexcelreport(dsData: any[]): any[] {
    const excelData: any = [];
    if (dsData.length > 0) {
      dsData.forEach((obj: any) => {
        // construct json model for excel export
        const element = {
          "AdapDs Number": obj["adap_design_solution_number"],
          "AdapDs Version": obj["adap_ds_version"],
          "AdapDs Issue": obj["adap_ds_issue"],
          "Ds Modified At": obj["updated_at"],
          "Pz Name": obj["partZone.name"],
          "Pz Version": obj["partZone.version"],
          "Pz Issue": obj["partZone.issue"],
          "Pz Modified At": obj["partZone.updated_at"],
          "PZ Status": obj["partZone.dataStatus"],
        };
        excelData.push(element);
      });
    }
    return excelData;
  }

  /**
   * query for Ds composition fin
   * @param whereClause
   * @param whereClausePz
   */
  public async getDesignSolutionConstitutionFin(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>,
    whereClausePz: any
  ) {
    try {
      const dsData = await Harness3dDesignSolutionModel.findAll({
        attributes: [
          "adap_design_solution_number",
          "adap_ds_version",
          "adap_ds_issue",
        ],
        where: whereClause,
        include: [
          {
            attributes: ["name", "version", "issue"],
            model: PartZoneModel,
            where: whereClausePz,
            include: [
              {
                attributes: [
                  "id",
                  "name",
                  "lengthMm",
                  "lengthForcedMm",
                  "notExtractible",
                  "diameter3dMm",
                  "bendRadius",
                ],
                model: Branch3dModel,
                include: [
                  {
                    attributes: [
                      "id",
                      "name",
                      "electricalCoordinateX",
                      "electricalCoordinateY",
                      "electricalCoordinateZ",
                    ],
                    model: Branch3dExtremitySolutionModel,
                    include: [
                      {
                        attributes: [
                          "id",
                          "partNumber3d",
                          "longPartNumber",
                          "mountingPriority",
                          "instanceName3d",
                          "definitionZone",
                          "panel",
                        ],
                        model: FunctionalItem3dSolutionModel,
                        include: [
                          {
                            model: FunctionalItem3dSolutionPartZoneRelation,
                            attributes: ["id"],
                            include: [
                              {
                                model: RouteCategoryModel,
                                attributes: ["name"],
                              },
                            ],
                          },
                        ],
                        required: true,
                      },
                    ],
                    required: true,
                  },
                ],
                required: true,
              },
            ],
          },
        ],
        order: [
          ["partZone", "b3d", "b3dExt", "finDs", "instanceName3d", "asc"],
        ],
        raw: true,
      });
      const excelData = this.jsonDataGeneratorforFin(dsData, whereClausePz);
      return Promise.resolve({ fin: excelData });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to generate JSON data for Fin
   * @param dsData
   * @param pzData
   */
  public jsonDataGeneratorforFin(dsData: any[], pzData: any): any[] {
    const excelData: any = [];
    if (dsData.length > 0) {
      dsData.forEach((obj: any) => {
        // construct json model for excel export
        let element = {
          "Pz Name": obj["partZone.name"],
          "Pz Version": obj["partZone.version"],
          "Pz Issue": obj["partZone.issue"],
          "B3d Ext": obj["partZone.b3d.b3dExt.name"],
          EffectiveRoute:
            obj[
              "partZone.b3d.b3dExt.finDs.FinPzRelations.effectiveRoutes.name"
            ],
          Fin: obj["partZone.b3d.b3dExt.finDs.instanceName3d"],
          Component: obj["partZone.b3d.b3dExt.finDs.partNumber3d"],
        };
        // we check if pz excel is not requested we add ds attributes for excel
        if (!pzData.name) {
          const adapData = {
            "AdapDs Number": obj["adap_design_solution_number"],
            "AdapDs Version": obj["adap_ds_version"],
            "AdapDs Issue": obj["adap_ds_issue"],
          };
          element = { ...adapData, ...element };
        }
        excelData.push(element);
      });
    }
    return excelData;
  }

  /**
   * query for Ds composition branches
   * @param whereClause
   * @param whereClausePz
   */
  public async getDesignSolutionConstitutionBranches(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>,
    whereClausePz: any
  ) {
    try {
      const dsData = await Harness3dDesignSolutionModel.findAll({
        attributes: [
          "adap_design_solution_number",
          "adap_ds_version",
          "adap_ds_issue",
        ],
        where: whereClause,
        include: [
          {
            attributes: ["name", "version", "issue"],
            model: PartZoneModel,
            where: whereClausePz,
            include: [
              {
                attributes: [
                  "id",
                  "name",
                  "lengthMm",
                  "lengthForcedMm",
                  "notExtractible",
                  "diameter3dMm",
                  "bendRadius",
                ],
                model: Branch3dModel,
                include: [
                  {
                    attributes: [
                      "id",
                      "name",
                      "electricalCoordinateX",
                      "electricalCoordinateY",
                      "electricalCoordinateZ",
                    ],
                    model: Branch3dExtremitySolutionModel,
                  },
                  {
                    attributes: ["name"],
                    model: RouteCategoryModel,
                  },
                  {
                    model: Branch3dSegmentModel,
                  },
                ],
              },
            ],
          },
        ],
        order: [["partZone", "b3d", "name", "asc"]],
        raw: true,
      });
      const excelData = this.jsonDataGeneratorforBranches(
        dsData,
        whereClausePz
      );
      return Promise.resolve({ branches: excelData });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to generate JSON data for Branches
   * @param dsData
   * @param pzData
   */
  public jsonDataGeneratorforBranches(dsData: any[], pzData: any): any[] {
    const excelData: any = [];
    if (dsData.length > 0) {
      dsData.forEach((obj: any) => {
        // construct json model for excel export
        let element = {
          "Pz Name": obj["partZone.name"],
          "Pz Version": obj["partZone.version"],
          "Pz Issue": obj["partZone.issue"],
          "B3d Name": obj["partZone.b3d.name"],
          "B3dExt Name": obj["partZone.b3d.b3dExt.name"],
          Route: obj["partZone.b3d.effectiveRoutes.name"],
          "Length Mm": obj["partZone.b3d.lengthMm"],
          "LengthForced Mm": obj["partZone.b3d.lengthForcedMm"],
          "Segments Name": obj["partZone.b3d.segments.name"],
        };
        // we check if pz excel is not requested we add ds attributes for excel
        if (!pzData.name) {
          const adapData = {
            "AdapDs Number": obj["adap_design_solution_number"],
            "AdapDs Version": obj["adap_ds_version"],
            "AdapDs Issue": obj["adap_ds_issue"],
          };
          element = { ...adapData, ...element };
        }
        excelData.push(element);
      });
    }
    return excelData;
  }

  /**
   * query for Ds composition Marker sleeves lta
   * @param whereClause
   * @param whereClausePz
   */
  public async getDesignSolutionConstitutionMarkerSleeveLta(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>,
    whereClausePz: any
  ) {
    try {
      const dsData = await Harness3dDesignSolutionModel.findAll({
        attributes: [
          "adap_design_solution_number",
          "adap_ds_version",
          "adap_ds_issue",
        ],
        where: whereClause,
        include: [
          {
            attributes: ["id", "name", "version", "issue"],
            model: PartZoneModel,
            where: whereClausePz,
            include: [
              {
                attributes: [
                  "id",
                  "name",
                  "lengthMm",
                  "lengthForcedMm",
                  "diameter3dMm",
                ],
                model: Branch3dModel,
                include: [
                  {
                    attributes: ["id", "name"],
                    model: Branch3dExtremitySolutionModel,
                    required: true,
                  },

                  {
                    attributes: ["id", "name", "lengthMm"],
                    model: CoveringElement3dModel,
                    include: [
                      {
                        attributes: ["id", "partNumber"],
                        model: ComponentModel,
                        required: true,
                      },
                      {
                        model: Branch3dExtremityCoveringElementRelation,
                        required: true,
                      },
                      {
                        attributes: ["name"],
                        model: CoveringElementTypeModel,
                        required: true,
                      },
                    ],
                  },
                ],
                required: true,
              },
            ],
          },
        ],
        order: [["partZone", "b3d", "cvrgElem", "name", "asc"]],
        raw: true,
      });
      const excelData = this.jsonDataGeneratorforMarkersSleeveLta(
        dsData,
        whereClausePz
      );
      return Promise.resolve(excelData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to generate JSON data for Markers Sleeve Lta
   * @param dsData
   * @param pzData
   */
  public jsonDataGeneratorforMarkersSleeveLta(
    dsData: any[],
    pzData: any
  ): any[] {
    const excelData: any = { marker: [], sleeve: [], lta: [] };
    if (dsData.length > 0) {
      dsData.forEach((obj: any) => {
        if (
          obj["partZone.b3d.cvrgElem.b3dExt.branch3dExtremityId"] ===
          obj["partZone.b3d.b3dExt.id"]
        ) {
          // construct json model for excel export

          let element = {
            "Pz Name": obj["partZone.name"],
            "Pz Version": obj["partZone.version"],
            "Pz Issue": obj["partZone.issue"],
          };

          // we check if pz excel is not requested we add ds attributes for excel
          if (!pzData.name) {
            const adapData = {
              "AdapDs Number": obj["adap_design_solution_number"],
              "AdapDs Version": obj["adap_ds_version"],
              "AdapDs Issue": obj["adap_ds_issue"],
            };
            element = { ...adapData, ...element };
          }

          if (obj["partZone.b3d.cvrgElem.cvrgElemType.name"] === "MARKER") {
            const markerData = {
              "Marker Id": obj["partZone.b3d.cvrgElem.name"],
              Component: obj["partZone.b3d.cvrgElem.component.partNumber"],
              "Branch Id": obj["partZone.b3d.name"],
            };
            element = { ...element, ...markerData };
            excelData.marker.push(element);
          } else if (
            obj["partZone.b3d.cvrgElem.cvrgElemType.name"] === "LACING_TAPE"
          ) {
            const lacingData = {
              "Lta Id": obj["partZone.b3d.cvrgElem.name"],
              Component: obj["partZone.b3d.cvrgElem.component.partNumber"],
              Branch: obj["partZone.b3d.name"],
              "Ext of branch": obj["partZone.b3d.b3dExt.name"],
              "LTA Length": obj["partZone.b3d.cvrgElem.lengthMm"],
              "LTA to EXT/DER length":
                obj["partZone.b3d.cvrgElem.b3dExt.lengthMm"],
            };

            element = { ...element, ...lacingData };
            excelData.lta.push(element);
          } else if (
            obj["partZone.b3d.cvrgElem.cvrgElemType.name"] === "SLEEVE"
          ) {
            const sleeveData = {
              "Sleeve Id": obj["partZone.b3d.cvrgElem.name"],
              "Length Sleeve": obj["partZone.b3d.cvrgElem.lengthMm"],
              "ext of branch": obj["partZone.b3d.b3dExt.name"],
              Component: obj["partZone.b3d.cvrgElem.component.partNumber"],
              "branch to sleeve ext length":
                obj["partZone.b3d.cvrgElem.b3dExt.lengthMm"],
            };
            element = { ...element, ...sleeveData };
            excelData.sleeve.push(element);
          }
        }
      });
    }
    return excelData;
  }

  /**
   *
   * @param whereClause
   * @returns
   */
  public async generateCSVforDSautoForHarness(
    whereClause: WhereOptions<Harness3dDesignSolutionModel>
  ) {
    try {
      console.log("whereClause : " + whereClause);
      return await Harness3dDesignSolutionModel.findOne({
        attributes: ["id", "adapDesignSolutionNumber"],
        where: whereClause,
        include: [
          {
            model: PartZoneModel,
            include: [
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
}
