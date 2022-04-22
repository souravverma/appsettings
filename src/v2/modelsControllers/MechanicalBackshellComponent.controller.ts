import MechanicalBackshellComponentModel from "../models/MechanicalBackshellComponent.model";
import PrototypeModelController from "./PrototypeModel.controller";
import ComponentModel from "../models/Component.model";
import { IMechanicalBackshellComponent } from "../interfaces/mapping.interface";
import { isArray } from "util";

export default class MechanicalBackshellComponentController extends PrototypeModelController {
  protected model: typeof MechanicalBackshellComponentModel =
    MechanicalBackshellComponentModel;

  constructor() {
    super();
  }

  /**
   * @description creates or update the MechanicalBackshellComponent
   * @param item
   * @param parent
   * @returns
   */
  async createOrUpdate(
    item: IMechanicalBackshellComponent,
    parent: ComponentModel
  ): Promise<any> {
    try {
      const result:
        | MechanicalBackshellComponentModel
        | MechanicalBackshellComponentModel[] = await parent.$get(
        "mechaBackshellCpnts",
        {
          where: item as any,
        }
      );
      if (result) {
        console.log("update backshell component");
        if (isArray(result)) return await result[0].update(item);
        // else
        // return await result.update(item);
      } else {
        console.log("create backshell component");
        return await parent.$create("mechaBackshellCpnts", item);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
