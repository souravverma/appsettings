import AdapItemModel from "../../../models/AdapItem.model";
import { IAdapCi } from "./interface/AdapPzCi.interface";
import { Op } from "sequelize";
export default class AdapCi {
  /**
   * Find all adapCi for the condition
   * @returns
   */
  public async findOne(whereCondition: { number: string }): Promise<any> {
    try {
      return await AdapItemModel.findOne({
        where: whereCondition,
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Creates new adapCi
   * @param data
   * @returns
   */
  public async createOrFetchAdapCi(data: IAdapCi[]): Promise<any> {
    try {
      const adapCi: AdapItemModel = await this.findOne({ number: data[0].id });
      if (adapCi) {
        return adapCi;
      } else {
        return await AdapItemModel.create({ number: data[0].id });
      }
    } catch (error) {
      console.log("APS synchronization error creating adapCi: ", error);
      return Promise.reject(error);
    }
  }

  /**
   * get adapCi list
   * @param data
   * @returns
   */
  public async getAdapCiList(id: string): Promise<any> {
    try {
      const searchName = "%" + id + "%";
      const adapCi = await AdapItemModel.findAll({
        where: {
          number: {
            [Op.like]: searchName,
          },
        },
      });
      return adapCi;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
