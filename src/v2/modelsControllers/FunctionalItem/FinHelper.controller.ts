import { logger } from "lib-central-logger";
import sequelize, { Op } from "sequelize";
import Branch3dModel from "../../models/Branch3d.model";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import { IFunctionalItem } from "../../interfaces/mapping.interface";
import AircraftProgramModel from "../../models/AircraftProgram.model";
import CircuitModel from "../../models/Circuit.model";
import FunctionalItemModel from "../../models/FunctionalItem.model";
import FunctionalItemHarness3dDesignSolutionRelationModel from "../../models/FunctionalItemHarness3dDsRelation.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import CircuitController from "../Circuit.controller";
import PrototypeModelController from "../PrototypeModel.controller";

export default class FinHelper extends PrototypeModelController {
  protected logger = logger;
  private circuitController: CircuitController;

  constructor() {
    super();
    this.circuitController = new CircuitController();
  }

  public async findFunctionalItem(
    sequenceNumber: any,
    circuit: any,
    suffix: any,
    appendedLetter: any
  ): Promise<FunctionalItemModel> {
    const whereClause: any = {
      sequenceNumber,
      appendedLetter,
    };
    if (suffix) {
      whereClause.suffix = suffix;
    }

    return await FunctionalItemModel.findOne({
      include: [
        {
          model: CircuitModel,
          attributes: ["id"],
          required: true,
          where: { letters: circuit },
        },
      ],
      where: whereClause,
    });
  }

  public async getFinSolutions(whereClause: { instanceName3d: string }) {
    let finSol: FunctionalItem3dSolutionModel | undefined = undefined;
    try {
      finSol = await FunctionalItem3dSolutionModel.findOne({
        include: [
          {
            model: Branch3dExtremitySolutionModel,
            attributes: ["id"],
            required: true,
            include: [
              {
                model: Branch3dModel,
                attributes: ["id"],
                required: true,
                include: [
                  {
                    model: PartZoneModel,
                    attributes: ["id"],
                    where: whereClause,
                  },
                ],
              },
            ],
          },
        ],
      });
      return finSol;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description Finds FunctionalItemModel
   * @param data
   * @returns FunctionalItemModel
   */
  public async findFin(data: any): Promise<FunctionalItemModel> {
    try {
      const circuit = await this.circuitController.findOne(
        data.circuit as string
      );
      delete data.circuit;
      data.fk_circuit_id = circuit.id;
      const circuitModelData: FunctionalItemModel[] =
        await FunctionalItemModel.findAll({
          include: [
            {
              model: CircuitModel,
            },
          ],
        });
      if (circuitModelData) {
        return circuitModelData.find((v: FunctionalItemModel) =>
          this.isObjectIncluded(data, v)
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * for updating DS to specific VUVB after modify ds button click
   * @param foundedFin
   * @param harnessData
   * @returns
   */
  public async updateFin(
    newFinId: number,
    oldFinId: number,
    harnessData: Harness3dDesignSolutionModel
  ): Promise<any> {
    try {
      const relation =
        await FunctionalItemHarness3dDesignSolutionRelationModel.findOne({
          where: {
            harness3dDesignSolutionId: harnessData.id,
            functionalItemId: oldFinId,
          },
        });

      const relationExists =
        await FunctionalItemHarness3dDesignSolutionRelationModel.findOne({
          where: {
            harness3dDesignSolutionId: harnessData.id,
            functionalItemId: newFinId,
          },
        });

      if (!relationExists)
        return await FunctionalItemHarness3dDesignSolutionRelationModel.update(
          {
            functionalItemId: newFinId,
          },
          {
            where: {
              harness3dDesignSolutionId: harnessData.id,
              // functionalItemId: oldFinId,
              id: relation.id,
            },
          }
        );
      else return;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * We try if Fin already exist **
   * @param item
   * @param currentCircuit
   * @param currentAircraftProgram
   * @param harnessData
   * @returns
   */
  public async findItemFin(
    item: IFunctionalItem,
    currentCircuit: CircuitModel,
    currentAircraftProgram: AircraftProgramModel
  ): Promise<{
    fin: FunctionalItemModel;
    newFinId: number | undefined;
    oldFinId: number | undefined;
  }> {
    try {
      let foundedFin: FunctionalItemModel | undefined;
      const currentFins: FunctionalItemModel[] =
        await FunctionalItemModel.findAll({
          where: {
            [Op.or]: {
              sequenceNumber: [item.sequenceNumber, item.newsequenceNumber],
            },
          },
          include: [
            {
              model: CircuitModel,
            },
          ],
        });

      let newSequenceExists = false;
      let oldSequenceExists = false;
      let newFinId: number | undefined;
      let oldFinId: number | undefined;

      currentFins.forEach((currentFin) => {
        // Prevent some empty value for the matching ... init to "null" if empty
        currentFin.sequenceNumber = currentFin.sequenceNumber
          ? currentFin.sequenceNumber
          : null;
        currentFin.circuit.letters = currentFin.circuit.letters
          ? currentFin.circuit.letters
          : null;
        currentFin.suffix = currentFin.suffix ? currentFin.suffix : null;
        currentFin.appendedLetter = currentFin.appendedLetter
          ? currentFin.appendedLetter
          : null;

        if (
          currentFin.sequenceNumber == item.newsequenceNumber &&
          currentFin.circuit.letters == item.newcircuit
        ) {
          newFinId = currentFin.id;
          newSequenceExists = true; // flag to be true when VUVB doesn't exist in the current list
        }

        if (
          currentFin.sequenceNumber == item.sequenceNumber &&
          currentFin.circuit.letters == item.circuit
        ) {
          oldFinId = currentFin.id;
          oldSequenceExists = true; // flag to be true when VUVB exist in the current list
        }

        if (
          currentFin.sequenceNumber == item.sequenceNumber &&
          currentFin.circuit.letters == item.circuit &&
          currentFin.suffix == item.suffix &&
          currentFin.appendedLetter == item.appendedLetter
        ) {
          foundedFin = currentFin;
        }
      });

      // code block for creating VUVB in Modify DS popup
      if (foundedFin && !newSequenceExists && item.fromFinListModal) {
        this.logger.info("fin found :: " + foundedFin.sequenceNumber);
        this.logger.info("my block fin not found ... We create it");
        item.sequenceNumber = item.newsequenceNumber;
        item.circuit = item.newcircuit;
        item.suffix = foundedFin.suffix;
        item.appendedLetter = foundedFin.appendedLetter;
        const newFin = await currentCircuit.$create("FIN", {
          ...item,
          fk_aircraft_program_id: currentAircraftProgram.id || null,
        });
        newFinId = newFin.id;
      }
      // code block for creating VUVB on click of Create DS
      else if (!foundedFin || (!item.fromFinListModal && !oldSequenceExists)) {
        this.logger.info("fin not found ... We create it");
        foundedFin = await currentCircuit.$create("FIN", {
          ...item,
          fk_aircraft_program_id: currentAircraftProgram.id || null,
        });
        newFinId = foundedFin.id;
      }
      return { fin: foundedFin, newFinId, oldFinId };
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * update the VBCODE as per the UI request
   * @param vbCode
   * @param functionalIitemId
   */
  public async updateVBCode(vbCode: string, functionalItemId?: string) {
    // await FunctionalItemModel.update(
    //   { sequenceNumber: vbCode },
    //   {
    //     where: {
    //       id: functionalItemId,
    //     },
    //   }
    // );
  }
}
