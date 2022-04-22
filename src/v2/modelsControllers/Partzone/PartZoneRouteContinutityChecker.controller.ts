import PartZoneModel from "../../models/Partzone.model";
import Branch3dModel from "../../models/Branch3d.model";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import RouteCategoryModel from "../../models/RouteCategory.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import { WhereOptions } from "sequelize";
import FunctionalItemModel from "../../models/FunctionalItem.model";
import CircuitModel from "../../models/Circuit.model";
import Branch3dExtremityTypeModel from "../../models/Branch3dExtremityType.model";
import FunctionalItem3dSolutionPartZoneRelation from "../../models/FunctionalItem3dSolutionPartZoneRelation.model";

export interface IRouteContinuityResponse {
  consolidationStatus: "OK" | "KO" | "N/A";
  consolidationMessage: string;
}

export interface IContinuity {
  [key: string]: IContinuityFinRoute;
}

export interface IContinuityFinRoute {
  routes?: { branchRoutes: string[]; finRoutes: string[] };
  fin?: string;
  circuit?: string;
}
export default class PartzoneRouteContinutityChecker {
  /**
   * get all connector and derivation linked to specific partzone
   * @param whereClause
   */
  public async getRoutesForDerivation(
    whereClause: WhereOptions<PartZoneModel>
  ): Promise<PartZoneModel> {
    try {
      return await PartZoneModel.findOne({
        attributes: ["id", "name", "version", "issue"],
        where: whereClause,
        order: [["version", "DESC NULLS LAST"]],
        include: [
          {
            model: Branch3dModel,
            where: { notExtractible: false },
            attributes: ["name"],
            include: [
              {
                model: Branch3dExtremitySolutionModel,
                attributes: ["id", "name"],
                include: [
                  {
                    model: FunctionalItem3dSolutionModel,
                    attributes: ["instanceName3d"],
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
            ],
          },
        ],
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * filter all routes linked to specific connector and derivation
   * @param derivationRoutes
   */
  public getAllRoutes(derivationRoutes: PartZoneModel) {
    const continuityRoutes: IContinuity = {};
    let extName: string;
    if (derivationRoutes.b3d.length > 0) {
      derivationRoutes.b3d.forEach((br) => {
        br.b3dExt.forEach((br3dExt) => {
          extName = br3dExt.name;
          if (
            br3dExt.type.name === "DERIVATION" ||
            br3dExt.type.name === "CONNECTOR"
          ) {
            if (!continuityRoutes[extName]) {
              continuityRoutes[extName] = {
                routes: { branchRoutes: [], finRoutes: [] },
                fin: "",
                circuit: "",
              };
            }

            br3dExt.finDs.forEach((fin) => {
              fin.FinPzRelations.forEach((finPz) => {
                finPz.effectiveRoutes.forEach((routes) => {
                  continuityRoutes[extName]["routes"]["finRoutes"].push(
                    routes.name
                  );
                  continuityRoutes[extName]["fin"] = fin.instanceName3d;
                  continuityRoutes[extName]["circuit"] =
                    fin.fin.circuit.letters;
                });
              });
            });
            br.effectiveRoutes.forEach((element) => {
              continuityRoutes[extName]["routes"]["branchRoutes"].push(
                element.name
              );
            });
          }
        });
      });
    }
    return continuityRoutes;
  }

  /**
   * assign a specific message based on comparing branchRoutes and finroutes for VC fins check if all finroutes are present in branchRoutes
   */
  public routeContinuityMessage(
    continuityRoutes: IContinuity,
    partzone: string
  ): IRouteContinuityResponse {
    const message: string[] = [];
    const routeContinuityMessage: IRouteContinuityResponse = {
      consolidationStatus: "OK",
      consolidationMessage: "Route continuity check Ok!",
    };
    if (partzone.charAt(12) === "X") {
      routeContinuityMessage.consolidationStatus = "N/A";
      routeContinuityMessage.consolidationMessage =
        "Route continuity check not applicable!";
      return routeContinuityMessage;
    }
    let fin;
    let unique;
    let circuit;
    let routes: string[];
    for (const der in continuityRoutes) {
      const { branchRoutes, finRoutes } = continuityRoutes[der].routes;

      fin = continuityRoutes[der].fin;
      circuit = continuityRoutes[der].circuit;
      if (circuit === "VC") {
        unique = finRoutes.filter((v) => !branchRoutes.includes(v));
      } else {
        routes = branchRoutes.concat(finRoutes);
        unique = routes.filter(
          // eslint-disable-next-line no-loop-func
          (v: any) => routes.indexOf(v) === routes.lastIndexOf(v)
        );
      }
      if (unique.length > 0) {
        const route = unique.toString().replace(",", " ");
        if (fin) {
          message.push(
            `Route Continuity check ${der} (${fin}) failed for ${route}`
          );
        } else {
          message.push(`Route Continuity check ${der} failed for ${route}`);
        }
      }
    }
    if (message.length > 0) {
      routeContinuityMessage.consolidationStatus = "KO";
      routeContinuityMessage.consolidationMessage = message.toString();
    }
    return routeContinuityMessage;
  }
}
