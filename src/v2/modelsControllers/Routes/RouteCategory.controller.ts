import RouteCategoryModel from "../../models/RouteCategory.model";
import PrototypeModelController from "../PrototypeModel.controller";
import { isArray } from "util";
import { Model } from "sequelize-typescript";
import AircraftProgramModel from "../../models/AircraftProgram.model";
import { IAircraftProgram } from "../../interfaces/mapping.interface";
import RouteBranch3dRelationModel from "../../models/RouteBranch3dRelation.model";
import { Op } from "sequelize";
import Branch3dModel from "../../models/Branch3d.model";

export default class RouteCategoryController extends PrototypeModelController {
  protected model: typeof RouteCategoryModel = RouteCategoryModel;
  protected routeBranchRelationModel: typeof RouteBranch3dRelationModel =
    RouteBranch3dRelationModel;
  protected AircraftModel: typeof AircraftProgramModel = AircraftProgramModel;

  constructor() {
    super();
  }

  /**
   * Deletes the branch route in branch-route relationship table, in case there is a change in proptool xml file
   * @param data
   * @param parent
   * @param aircraftProgramName
   * @returns
   */
  public async cleanBranchRoutesforUpdates(
    data: string | string[],
    parent: Model<any>,
    aircraftProgramName: string
  ) {
    try {
      let isData = 0;
      if (!isArray(data)) {
        data = [data];
      }
      const routeCategoryData: RouteCategoryModel[] =
        await this.getRouteCategories(data, aircraftProgramName);
      if (routeCategoryData.length) {
        isData = await this.routeBranchRelationModel.count({
          where: { branch3dId: parent.id },
        });
        if (isData > 0) {
          await this.routeBranchRelationModel.destroy({
            where: { branch3dId: parent.id },
          });
        }
      }
    } catch (error) {
      console.error("Route category deletion error ");
      return Promise.reject(error);
    }
  }

  public async getAllRoutes(branch3d: Branch3dModel) {
    try {
      let routes: string[] = [];
      const routeList: number[] = [];
      const routesType: RouteBranch3dRelationModel[] =
        await RouteBranch3dRelationModel.findAll({
          attributes: ["routeCategoryId"],
          where: { branch3dId: branch3d.id },
        });

      if (routesType) {
        routesType.forEach((element) => {
          routeList.push(element.routeCategoryId);
        });

        routes = await RouteCategoryModel.findAll({
          attributes: ["name"],
          where: { id: { [Op.in]: routeList } },
          raw: true,
        }).then((routes) => routes.map((r) => r.name));
      }
      return routes;
    } catch (error) {
      console.error("Route category deletion error ");
      return Promise.reject(error);
    }
  }

  public async getRouteCategories(data: string[], aircraftProgramName: string) {
    data = data.filter((item) => item);
    const routeCategoryData: RouteCategoryModel[] = await this.model.findAll({
      where: { name: { [Op.or]: data } },
      include: [
        {
          model: AircraftProgramModel,
          where: {
            familyName: aircraftProgramName,
          },
          required: true,
        },
      ],
    });
    return routeCategoryData;
  }

  /**
   * Creates and Updates the Route information to Branch and Fin-Partzone
   * @param data
   * @param parent
   * @param aircraftProgramData
   * @param type
   * @returns
   */
  public async createOrUpdate(
    data: string | string[],
    parent: Model<any>,
    aircraftProgramData: IAircraftProgram,
    type: "effectiveRoute" | "admissibleRoute"
  ): Promise<void> {
    try {
      if (!isArray(data)) data = [data];

      const routeCategoryData: RouteCategoryModel[] =
        await this.getRouteCategories(data, aircraftProgramData.familyName);

      await Promise.all(
        routeCategoryData.map(async (routeCategory: RouteCategoryModel) => {
          if (!(await parent.$has(type, routeCategory))) {
            return parent.$add(type, routeCategory);
          } else parent.update(type as any, routeCategory);
        })
      );
      return;
    } catch (error) {
      console.error("Route category not found :: " + data);
      return Promise.reject(error);
    }
  }
}
