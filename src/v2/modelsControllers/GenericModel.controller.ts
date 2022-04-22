import { Model } from "sequelize-typescript";
import { IWhereClause } from "../interfaces/WhereClause.interface";

export class GenericModelController {
  static instance: GenericModelController;

  private constructor() {}

  /**
   * NEEDS TO REMOVE ON REFACTORINTODO
   * @returns
   */
  static getInstance(): GenericModelController {
    if (GenericModelController.instance) {
      return GenericModelController.instance;
    } else {
      GenericModelController.instance = new GenericModelController();
      return GenericModelController.instance;
    }
  }

  /*
   * @description to get all generic model values based on provided filter
   * @param model
   * @param whereClause
   * @returns list of generic model
   */
  async getAll<T extends Model<T>>(
    model: any,
    whereClause?: IWhereClause
  ): Promise<Array<T>> {
    try {
      const limit = whereClause.pageLength;
      const offset = whereClause.startIndex;

      delete whereClause.pageLength;
      delete whereClause.startIndex;

      return await model.findAll({ where: whereClause, limit, offset });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * to get all generic model values based on provided filter and with model values
   * @param model
   * @param withModel
   * @param whereClause
   * @returns
   */
  async getAllWith<T extends Model<T>>(
    model: any,
    withModel: any | any[],
    whereClause?: IWhereClause
  ): Promise<Array<T>> {
    try {
      const limit = whereClause.pageLength;
      const offset = whereClause.startIndex;

      delete whereClause.pageLength;
      delete whereClause.startIndex;

      let includeAcc: {};
      if (Array.isArray(withModel)) {
        includeAcc = withModel.reduceRight((acc, cur) => {
          return [
            {
              model: cur,
              include: acc,
            },
          ];
        }, []);
      } else {
        includeAcc = [{ model: withModel }];
      }

      return await model.findAll({
        where: whereClause,
        limit,
        offset,
        include: includeAcc,
        subQuery: false,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
