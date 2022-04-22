import ConnectionStatusModel from "../../models/ConnectionStatus.model";
import PrototypeModelController from "../PrototypeModel.controller";
import { isArray } from "util";
import FunctionalItemSolutionPartZoneRelation from "../../models/FunctionalItem3dSolutionPartZoneRelation.model";

export default class ConnectionStatusController extends PrototypeModelController {
  protected model: typeof ConnectionStatusModel = ConnectionStatusModel;

  constructor() {
    super();
  }

  /**
   * Connection between Partzone and fins
   * @param data
   * @param parent
   * @returns
   */
  async createOrUpdate(
    data: string | string[],
    parent: FunctionalItemSolutionPartZoneRelation
  ): Promise<any> {
    if (!isArray(data)) data = [data];

    if (!data.length) return;
    try {
      return await Promise.all(
        data.map(async (item) => {
          const [result, created] = await this.model.findOrCreate({
            where: { name: item },
          });

          if (created || !(await result.$has("finSolPartZone", parent)))
            return result.$add("finSolPartZone", parent);

          return Promise.resolve();
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
