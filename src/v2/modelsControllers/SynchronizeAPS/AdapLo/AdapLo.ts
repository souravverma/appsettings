import AdapLoModel from "../../../models/AdapLo.model";

export default class AdapLo {
  /**
   * Find all adapLo for the condition
   * @returns
   */
  public async findOne(whereCondition: { number: string }): Promise<any> {
    try {
      return await AdapLoModel.findOne({
        where: whereCondition,
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Creates new adapLo
   * create adap lo and with forign key relation
   * @param data
   * @returns
   */
  public async createOrFetchAdapLo(data: any): Promise<any> {
    try {
      await AdapLoModel.destroy({
        force: true,
        where: {
          fk_harness_3d_ds_id: data.fk_harness_3d_ds_id,
        },
      });
      return await AdapLoModel.create(data);
    } catch (error) {
      console.log("APS synchronization error creating adapLo: ", error);
      return Promise.reject(error);
    }
  }

  /**
   * delete adap Lo and adap ds link
   * @param adapId
   * @returns
   */
  public async unlinkAdapLoDs(
    adapId: number,
    destroyForce: boolean
  ): Promise<number> {
    return await AdapLoModel.destroy({
      force: destroyForce,
      where: {
        fk_harness_3d_ds_id: adapId,
      },
    });
  }
}
