import CircuitModel from "../models/Circuit.model";
import PrototypeModelController from "./PrototypeModel.controller";
import AircraftProgramModel from "../models/AircraftProgram.model";
import { FindOptions } from "sequelize";

export default class CircuitController extends PrototypeModelController {
  protected model: typeof CircuitModel = CircuitModel;
  protected aircraftProgramModel: typeof AircraftProgramModel =
    AircraftProgramModel;
  constructor() {
    super();
  }

  /**
   *  Find data in Circuit
   * @param value
   * @returns
   */
  public async findAllInCircuit(
    value: FindOptions<CircuitModel>
  ): Promise<CircuitModel[]> {
    try {
      return await this.model.findAll(value);
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * @description return specific circuit model value
   * @returns circuit model data
   */
  public async findOne(circuit: string): Promise<CircuitModel> {
    try {
      return await this.model.findOne({
        where: {
          letters: circuit,
        },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
