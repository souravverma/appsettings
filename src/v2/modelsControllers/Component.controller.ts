import ComponentModel from "../models/Component.model";
import { IComponent } from "../interfaces/mapping.interface";
import sequelize from "sequelize";
import PrototypeModelController from "./PrototypeModel.controller";
export default class ComponentController extends PrototypeModelController {
  protected model: typeof ComponentModel = ComponentModel;
  protected collection: ComponentModel[];

  constructor() {
    super();
  }

  /**
   * @description Finds all existing ComponentModel model
   * @returns All domain model list
   */
  public async findOne(item: any) {
    return await ComponentModel.findOne({
      where: { partNumber: item.partNumber },
      order: [["created_at", "DESC"]],
    });
  }

  /**
   * Creates new components
   * @param data
   * @returns
   */
  async createOrUpdate(
    data: IComponent[],
    transaction: sequelize.Transaction
  ): Promise<any> {
    try {
      console.log("Creating Component ... ");
      const model = async (item: any) => {
        if (!item) return;
        let component = await this.findOne(item);

        if (component) {
          console.log("Component found: " + component.partNumber);
          this.addToCollection(component);
          return component;
        } else {
          console.log("Component created: " + item);
          await ComponentModel.create(item);
          component = await this.findOne(item);
          this.addToCollection(component);
        }
      };
      return await Promise.all(data.map((item) => model(item)));
    } catch (error) {
      console.log("Error creating Component :", error);
      transaction.rollback();
      return Promise.reject(error);
    }
  }
}
