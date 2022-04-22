import MajorComponentAssemblyModel from "../models/MajorComponentAssembly.model";
import PrototypeModelController from "./PrototypeModel.controller";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";

export default class MajorComponentAssemblyController extends PrototypeModelController {
  protected model: typeof MajorComponentAssemblyModel =
    MajorComponentAssemblyModel;

  constructor() {
    super();
  }

  /**
   * MajorComponentAssemblyController
   * @param item
   * @param parent
   * @returns
   */
  public async createOrUpdate(
    item: string,
    parent: Harness3dDesignSolutionModel
  ): Promise<any> {
    try {
      const result: MajorComponentAssemblyModel = await this.model.findOne({
        where: { name: item },
      });
      if (result) {
        return await this.attach(parent, "harness3d", result);
      } else {
        return await parent.$create("majorCA", { name: item });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
