import PartzoneItemModel from "../../../models/PartzoneItem.model";
import UserAreaController from "../../UserArea.controller";
import { IPartzoneCi } from "./interface/AdapPzCi.interface";

export default class PartzoneCi {
  /**
   * Find all PartzoneCi for the condition
   * @returns
   */
  public async findOne(whereCondition: { number: string }): Promise<any> {
    try {
      return await PartzoneItemModel.findOne({
        where: whereCondition,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Creates new PartzoneCi
   * @param data
   * @returns
   */
  public async createOrUpdate(data: IPartzoneCi[]): Promise<any> {
    let pzCidata;
    let pzItem;
    const userAreaController: UserAreaController = new UserAreaController();
    try {
      const model = async (item: IPartzoneCi) => {
        if (!item) return;
        const partzoneCi: PartzoneItemModel = await this.findOne({
          number: item.pz_ci_id,
        });
        if (partzoneCi) {
          return partzoneCi;
        } else {
          pzCidata = { number: item.pz_ci_id };
          pzItem = await PartzoneItemModel.create(pzCidata);
          await userAreaController.updateRelationForPzItemUserarea(
            item.pz_ci_id.slice(-2),
            pzItem
          );
          return pzItem;
        }
      };
      return await Promise.all(data.map((item) => model(item)));
    } catch (error) {
      console.log("APS synchronization error creating partzoneCi: ", error);
      return Promise.reject(error);
    }
  }
}
