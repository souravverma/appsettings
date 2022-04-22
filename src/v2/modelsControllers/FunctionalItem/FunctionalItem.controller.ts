import FunctionalItemModel from "../../models/FunctionalItem.model";
import {
  IAircraftProgram,
  IFunctionalItem,
  IHarness3dDesignSolution,
} from "../../interfaces/mapping.interface";
import PrototypeModelController from "../PrototypeModel.controller";
import CircuitModel from "../../models/Circuit.model";
import CircuitController from "../Circuit.controller";
import Harness3dDesignSolutionController from "../Harness/Harness3dDesignSolution.controller";
import AircraftProgramModel from "../../models/AircraftProgram.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import sequelize from "sequelize";
import FinHelper from "./FinHelper.controller";
import { injectable } from "tsyringe";

@injectable()
export default class FunctionalItemController extends PrototypeModelController {
  protected model: typeof FunctionalItemModel = FunctionalItemModel;
  protected aircraftProgramModel: typeof AircraftProgramModel =
    AircraftProgramModel;
  protected circuitParent: CircuitController;
  private finHelper: FinHelper;

  constructor(
    parent: CircuitController,
    protected harness3dDesignsolutionController: Harness3dDesignSolutionController,
    finHelper: FinHelper
  ) {
    super();
    this.circuitParent = parent;
    this.finHelper = finHelper;
  }

  /**
   * @description create or update the FunctionalItem data
   * @param data
   * @param aircraftProgramData
   * @returns
   */
  async createOrUpdate(
    data: IFunctionalItem[],
    aircraftProgramData: IAircraftProgram,
    h3ds: IHarness3dDesignSolution,
    transaction: sequelize.Transaction
  ): Promise<any> {
    try {
      console.log("Creating Functionalitem ... ");
      delete aircraftProgramData.mainAircraftLetterCode;
      // We get aircraft Program
      const currentAircraftProgram: AircraftProgramModel =
        await this.aircraftProgramModel.findOne({
          where: aircraftProgramData as any,
        });
      if (!currentAircraftProgram) {
        this.logger.error(
          "aircraftProgram not found :: " + aircraftProgramData.familyName
        );
        return Promise.reject(
          `aircraftProgram not found :: ${aircraftProgramData.familyName}`
        );
      }

      const harnessData: Harness3dDesignSolutionModel =
        await this.harness3dDesignsolutionController.findHarness(h3ds);
      return await Promise.all(
        data.map((item: IFunctionalItem) =>
          this.processIFunctionalItem(item, currentAircraftProgram, harnessData)
        )
      );
    } catch (error) {
      console.log("Error creating Functionalitem :", error);
      transaction.rollback();
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param item
   * @param aircraftProgramData
   * @returns
   */
  async processIFunctionalItem(
    item: IFunctionalItem,
    currentAircraftProgram: AircraftProgramModel,
    harnessData: Harness3dDesignSolutionModel
  ): Promise<any> {
    const currentCircuit: CircuitModel = await this.circuitParent.findOne(
      (item.newcircuit || item.circuit).toString()
    );
    if (!currentCircuit) {
      this.logger.error("Circuit not found :: " + item.circuit);
      return Promise.reject(`Circuit not found :: ${item.circuit}`);
    }
    const finData = await this.finHelper.findItemFin(
      item,
      currentCircuit,
      currentAircraftProgram
    );

    if (finData) {
      const { fin, newFinId, oldFinId } = finData;
      await this.attach(fin, "fin", harnessData);

      if (item.fromFinListModal && newFinId !== undefined)
        await this.finHelper.updateFin(newFinId, oldFinId, harnessData);
    }

    return;
  }
}
