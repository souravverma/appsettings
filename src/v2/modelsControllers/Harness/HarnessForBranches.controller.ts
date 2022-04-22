import Branch3dModel from "../../models/Branch3d.model";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import Branch3dExtremityTypeModel from "../../models/Branch3dExtremityType.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import RouteCategoryModel from "../../models/RouteCategory.model";
import PartZoneModel from "../../models/Partzone.model";

export default class HarnessForBranches {
  /**
   * @desc Get all Branch 3D CrossRef of an Harness to check his consistency.
   * @param {string} adapDesignSolutionNumber
   * @returns {Promise<Harness3dDesignSolutionModel[]>} Promise<Harness3dDesignSolutionModel[]>
   * @memberof SpecificModelController
   */
  public async getCrossRefByHarness(
    adapDesignSolutionNumber: string,
    adapDesignSolutionVersionNumber: string
  ): Promise<Harness3dDesignSolutionModel[]> {
    try {
      const result = await Harness3dDesignSolutionModel.findAll({
        attributes: [
          "id",
          "adapDesignSolutionNumber",
          "caccDsNumber",
          "adapDesignSolutionVersionNumber",
          "adapDesignSolutionIssueNumber",
          "psSynchroStatus",
        ],
        // distinct: true,
        where: {
          adapDesignSolutionNumber: adapDesignSolutionNumber,
          adapDesignSolutionVersionNumber: adapDesignSolutionVersionNumber,
        },
        include: [
          {
            model: PartZoneModel,
            attributes: [
              "id",
              "name",
              "consolidationStatus",
              "consolidationMessage",
            ],
            include: [
              {
                model: Branch3dModel,
                attributes: ["id", "name"],
                include: [
                  {
                    model: RouteCategoryModel,
                    attributes: ["name"],
                  },
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
                        model: Branch3dExtremityTypeModel,
                        attributes: ["id", "name"],
                        where: { name: "CROSSREF" },
                      },
                    ],
                  },
                ],
              },
              {
                model: FunctionalItem3dSolutionModel,
                attributes: ["id", "instanceName3d"],
              },
            ],
          },
        ],
      });

      const distinctPz: any = [];
      const newResult: any = [];

      result.forEach((pz: any, i) => {
        if (distinctPz[pz.dataValues.adapDesignSolutionNumber]) {
          if (
            pz.dataValues.adapDesignSolutionVersionNumber >
            distinctPz[pz.dataValues.adapDesignSolutionNumber].highest
          ) {
            distinctPz[pz.dataValues.adapDesignSolutionNumber].highest =
              pz.dataValues.adapDesignSolutionVersionNumber;
          }
        } else {
          distinctPz[pz.dataValues.adapDesignSolutionNumber] = {
            highest: pz.dataValues.adapDesignSolutionVersionNumber,
          };
        }
      });

      result.forEach((pz: any, i) => {
        if (distinctPz[pz.dataValues.adapDesignSolutionNumber]) {
          if (
            pz.dataValues.adapDesignSolutionVersionNumber ===
            distinctPz[pz.dataValues.adapDesignSolutionNumber].highest
          ) {
            newResult.push(pz);
          }
        }
      });
      return newResult;
    } catch (error) {
      Promise.reject(error);
    }
  }
}
