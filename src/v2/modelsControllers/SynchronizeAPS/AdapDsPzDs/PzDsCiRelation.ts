import PartzoneItemModel from "../../../models/PartzoneItem.model";
import PartZoneModel from "../../../models/Partzone.model";
import PrototypeModelController from "../../PrototypeModel.controller";
import { ISpecifiedPzDs } from "./interface/AdapDsPzDs.interface";

export default class PzDsCiRelation extends PrototypeModelController {
  /**
   *
   */
  constructor() {
    super();
  }
  /**
   * Creates new relation
   * create pzDs and pz Ci relation
   * @param adapCi
   * @param pzCiList
   * @returns
   */
  public async createPartZoneCisRelation(
    specifiedDs: ISpecifiedPzDs[]
  ): Promise<any> {
    try {
      const model = async (item: any) => {
        if (!item) return;
        const pzDs = await PartZoneModel.findOne({
          where: { name: item.id, version: item.version },
        });
        const partzoneCi: PartzoneItemModel = await PartzoneItemModel.findOne({
          where: { number: item.pzCiId },
        });
        if (pzDs && partzoneCi) {
          await this.attach(partzoneCi, "pzItem", pzDs);
        }
      };
      return await Promise.all(specifiedDs.map((item) => model(item)));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
