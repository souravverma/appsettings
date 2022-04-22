import AdapItemModel from "../../../models/AdapItem.model";
import PartzoneItemModel from "../../../models/PartzoneItem.model";
import AdapItemPartzoneItemRelationModel from "../../../models/AdapItemPartzoneItemRelation.model";
import { IAdapCi } from "./interface/AdapPzCi.interface";

export default class AdapPartzoneCIRelation {
  /**
   * Creates new relation
   * @param adapCi
   * @param pzCiList
   * @returns
   */
  public async createPartZoneCisRelation(
    adapCi: AdapItemModel,
    pzCiList: PartzoneItemModel[]
  ): Promise<any> {
    try {
      await AdapItemPartzoneItemRelationModel.destroy({
        force: true,
        where: {
          fk_adap_item_id: adapCi.id,
        },
      });
      const model = async (item: any) => {
        if (!item) return;
        return await adapCi.$add("pzItem", item);
      };
      return await Promise.all(pzCiList.map((item) => model(item)));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * get all pz ci associated to adap ci
   * @param adapCi
   * @returns
   */
  public async getPzCisRelation(adapCi: IAdapCi[]): Promise<any> {
    try {
      return await AdapItemModel.findOne({
        where: { number: adapCi[0].id },
        include: [
          {
            model: PartzoneItemModel,
          },
        ],
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * delete all non assosiated pz ci if it is not linked to any other adap ci
   * @param adapPzCi
   * @returns
   */
  public async deleteNonAssociatedPzCi(adapPzCi: AdapItemModel): Promise<any> {
    try {
      if (!adapPzCi) return;
      const model = async (item: any) => {
        if (!item) return;
        const pzCi = await AdapItemPartzoneItemRelationModel.findAll({
          where: {
            fk_pz_item_id: item.id,
          },
        });
        if (pzCi.length < 1) {
          await PartzoneItemModel.destroy({
            force: true,
            where: {
              id: item.id,
            },
          });
        }
      };
      return await Promise.all(adapPzCi.pzItem.map((item) => model(item)));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
