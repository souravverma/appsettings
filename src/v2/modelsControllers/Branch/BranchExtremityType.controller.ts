import Branch3dExtremityTypeModel from "../../models/Branch3dExtremityType.model";

export default class Branch3dExtremityTypeController {
  /**
   * @description list all the data for Branch3dExtremity
   * @returns Branch3dExtremity list
   */
  async findAll(): Promise<Branch3dExtremityTypeModel[]> {
    try {
      return await Branch3dExtremityTypeModel.findAll();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
