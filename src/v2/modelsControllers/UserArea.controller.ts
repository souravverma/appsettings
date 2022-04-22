import UserAreaModel from "../models/UserAreaPartZone.model";
import PrototypeModelController from "./PrototypeModel.controller";
import PartZoneModel from "../models/Partzone.model";
import PartzoneItemModel from "../models/PartzoneItem.model";

export default class UserAreaController extends PrototypeModelController {
  constructor() {
    super();
  }

  /*
   * Searches for User Area
   * @param item
   * @param partZone
   * @returns
   */
  async createOrUpdate(userArea: string, partZone: PartZoneModel) {
    try {
      const userAreaFound = await UserAreaModel.findOne({
        where: { name: userArea },
      });
      if (userAreaFound && partZone) {
        await this.attach(partZone, "partZone", userAreaFound);
      } else {
        await partZone.$create("userArea", { name: userArea });
      }
    } catch (error) {
      return Promise.reject(`Error creating User Area :: ${userArea}`);
    }
  }

  /*
   * update relation for pz-ci
   * @param item
   * @param partZoneItem
   * @returns
   */
  async updateRelationForPzItemUserarea(
    userArea: string,
    partzoneItem: PartzoneItemModel
  ) {
    try {
      const userAreaFound = await UserAreaModel.findOne({
        where: { name: userArea },
      });
      if (userAreaFound && partzoneItem) {
        await this.attach(partzoneItem, "pzItem", userAreaFound);
      }
    } catch (error) {
      return Promise.reject(
        `Error Updating User Area :: ${userArea} for pz Item`
      );
    }
  }
}
