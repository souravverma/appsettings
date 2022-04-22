import Branch3dSegmentModel from "../../models/Branch3dSegment.model";
import { isArray } from "util";
import Branch3dModel from "../../models/Branch3d.model";
import { IncludeOptions } from "sequelize";

export default class Branch3dSegmentController {
  static nestedIncludeOptions: IncludeOptions = {
    model: Branch3dSegmentModel,
    attributes: ["id"],
    paranoid: false,
  };

  public async createOrUpdate(
    data: string | string[],
    parent: Branch3dModel
  ): Promise<Branch3dSegmentModel> {
    if (!isArray(data)) data = [data];

    if (!data.length) Promise.resolve();
    try {
      await Promise.all(
        data.map(async (element) => {
          const result = await Branch3dSegmentModel.findOne({
            where: { name: element },
          });
          if (!result) {
            parent.$create("segment", { name: element });
          }
        })
      );
    } catch (error) {
      return await Promise.reject(error);
    }
  }
}
