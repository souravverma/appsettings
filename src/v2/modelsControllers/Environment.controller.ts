import EnvironmentTypeModel from "../models/EnvironmentType.model";
import PrototypeModelController from "./PrototypeModel.controller";
import { isArray } from "util";
import Branch3dModel from "../models/Branch3d.model";

export default class EnvironmentTypeController extends PrototypeModelController {
  protected model: typeof EnvironmentTypeModel = EnvironmentTypeModel;
  constructor() {
    super();
  }

  /**
   * Creates the Environment type Component
   * @param data
   * @param parent
   * @returns
   */
  public async createOrUpdate(
    data: string | string[],
    parent: Branch3dModel
  ): Promise<any> {
    try {
      if (!isArray(data)) data = [data];

      if (!data.length) return Promise.resolve();

      return await Promise.all(
        data.map(async (item: any) => {
          try {
            if (!item) return Promise.resolve();

            const result: EnvironmentTypeModel = await this.model.findOne({
              where: { name: item },
            });
            if (result) {
              if (!(await parent.$has("environment", result))) {
                return parent.$add("environment", result);
              } else return Promise.resolve();
            } else {
              this.logger.error("Environment type not found :: " + item);
              return Promise.resolve();
            }
          } catch (err) {
            return Promise.reject(err);
          }
        })
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
