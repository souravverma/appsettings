import PrototypeModelController from "../PrototypeModel.controller";
import PartZoneModel from "../../models/Partzone.model";
import RouteCategoryController from "../Routes/RouteCategory.controller";
import ConnectionStatusController from "./ConnectionStatus.controller";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import FunctionalItemSolutionPartZoneRelation from "../../models/FunctionalItem3dSolutionPartZoneRelation.model";
import sequelize from "sequelize";
import { IAircraftProgram } from "../../interfaces/mapping.interface";
import FinPartZoneRouteRelation from "../../models/FinPartZoneRouteRelation.model";

export default class FunctionalItemSolutionPartZoneRelationController extends PrototypeModelController {
  protected model: typeof FunctionalItemSolutionPartZoneRelation =
    FunctionalItemSolutionPartZoneRelation;
  protected routeCategoryController: RouteCategoryController =
    new RouteCategoryController();
  protected connectionStatus: ConnectionStatusController =
    new ConnectionStatusController();
  protected collection: FunctionalItemSolutionPartZoneRelation[];

  constructor() {
    super();
  }

  /**
   * @description to find FunctionalItemSolutionPartZoneRelation
   * @param whereClause
   * @returns FunctionalItemSolutionPartZoneRelation
   */
  async findOne(
    whereClause: sequelize.WhereOptions<any>
  ): Promise<FunctionalItemSolutionPartZoneRelation> {
    try {
      return await this.model.findOne({ where: whereClause });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description To create or update the FunctionalItemSolutionPartZoneRelation
   * @param functionItemSolution
   * @param partZone
   * @param data
   * @param aircraftProgramData
   * @returns
   */
  async createOrUpdate(
    functionItemSolution: FunctionalItem3dSolutionModel,
    partZone: PartZoneModel,
    data: any,
    aircraftProgramData: IAircraftProgram
  ): Promise<any> {
    try {
      if (!(await functionItemSolution.$has("partZone", partZone))) {
        await functionItemSolution.$add("partZone", partZone, {
          through: { mountingPriority: data.mountingPriority },
        });
      }

      const functionalItemSolutionPartZoneRelation: FunctionalItemSolutionPartZoneRelation =
        await this.findOne({
          functionalItem3dSolutionId: functionItemSolution.id,
          partZoneId: partZone.id,
        });
      if (functionalItemSolutionPartZoneRelation) {
        await FinPartZoneRouteRelation.destroy({
          where: {
            finPartZoneRouteId: functionalItemSolutionPartZoneRelation.id,
          },
        });
        return await Promise.all([
          await this.routeCategoryController.createOrUpdate(
            data.effectiveRoutes,
            functionalItemSolutionPartZoneRelation,
            aircraftProgramData,
            "effectiveRoute"
          ),
          await this.connectionStatus.createOrUpdate(
            data.connectionStatus,
            functionalItemSolutionPartZoneRelation
          ),
        ]);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
