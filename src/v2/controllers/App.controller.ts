import { Request, Response } from "express";
import mappingKbl from "./MappingKbl.controller";
import { ResponseManager } from "../services/responseManager.service";

class AppController {
  constructor() {}

  /**
   * @description receive a kbl file formated and send it to the data model mapping function
   * @param {Request} req must countain a kbl file formated by ce-import-kbl
   * @param {Response} res
   */
  public async importfile(req: Request): Promise<any> {
    try {
      return await mappingKbl.buildData(req);
    } catch (err) {
      return Promise.reject({ status: false, message: err.message });
    }
  }
}

/**
 * @description Singleton
 */
const appController = new AppController();

export default appController;
