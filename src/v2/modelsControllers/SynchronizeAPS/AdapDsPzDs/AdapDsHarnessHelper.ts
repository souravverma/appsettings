import {
  IPartZone,
  IPartZoneManagerData,
} from "../../../interfaces/mapping.interface";
import jsonData from "../../../ConfigurationFiles/Regex.json";
import Harness3dDesignSolutionModel from "../../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../../models/Partzone.model";
import Harness3dDsPzRelationModel from "../../../models/Harness3dDsPzRelation.model";
import CreationController from "../../../controllers/Creation.controller";
import { ProptoolConfig } from "../../../ConfigurationFiles/proptool.config";
import UserAreaModel from "../../../models/UserAreaPartZone.model";
import { ISpecifiedPzDs } from "./interface/AdapDsPzDs.interface";
import { container, injectable } from "tsyringe";
import FunctionalItemModel from "../../../models/FunctionalItem.model";
import CircuitModel from "../../../models/Circuit.model";

@injectable()
export default class AdapDsHarnessHelper {
  private creationController: CreationController;
  /**
   *
   */
  constructor() {
    this.creationController = container.resolve(CreationController);
  }
  /**
   * form adapDs json to save adpDs PzDs
   * @param adapId
   * @returns
   */
  public async createHarnessJson(
    pzData: any,
    sequenceNumber: string,
    circuit: string
  ): Promise<IPartZoneManagerData> {
    const harnessData: IPartZoneManagerData = pzData;
    //vuvb is harcoded for now should be getting from aps json in future
    harnessData.functionalItem = {
      sequenceNumber: sequenceNumber,
      circuit: circuit,
    };

    harnessData.harness3dDesignSolution.caccDsNumber =
      "D929" +
      harnessData.partZone[0].name.substr(4, 1) +
      harnessData.functionalItem.sequenceNumber +
      "000";
    harnessData.harness3dDesignSolution.caccDsSolution = "001";
    // Let's find out the major component assembly :AD / AF ... It is the 5th charactere on the DS number
    for (const iteration of Object.entries(jsonData.MAJOR_COMPONENT_ASSEMBLY)) {
      const name = iteration[0];
      const number = iteration[1];
      if (
        number.includes(
          harnessData.harness3dDesignSolution.adapDesignSolutionNumber.substr(
            4,
            1
          )
        )
      ) {
        harnessData.majorComponentAssembly = { name: name };
      }
    }

    // Same stuff  for the aircraft program. Here we the first letter of the DS number
    for (const iteration of Object.entries(jsonData.AIRCRAFT_PROGRAM)) {
      const name = iteration[0];
      const letters = iteration[1];

      if (
        letters.includes(
          harnessData.harness3dDesignSolution.adapDesignSolutionNumber.substr(
            0,
            1
          )
        )
      ) {
        harnessData.aircraftProgram = { familyName: name };
      }
    }
    await this.creationController.createComponents(
      false,
      harnessData,
      ProptoolConfig
    );
    return harnessData;
  }

  public async updateHarnessPartZoneRelationship(
    id: string,
    version: string,
    partZones: IPartZone[]
  ) {
    const newHArness = await Harness3dDesignSolutionModel.findOne({
      where: {
        adapDesignSolutionNumber: id,
        adapDesignSolutionVersionNumber: version,
      },
    });

    partZones.forEach(async (partzone) => {
      const pz = await PartZoneModel.findOne({
        attributes: ["id"],
        where: { name: partzone.name, version: partzone.version },
        order: [["version", "DESC NULLS LAST"]],
      });

      if (pz) {
        await Harness3dDsPzRelationModel.upsert({
          harness3dDesignSolutionId: newHArness.id,
          partZoneId: pz.id,
        });
      }
    });
  }

  /**
   * check vuvb for adpDs
   * @param adapId
   * @returns
   */
  public async chechIfVuvbExists(adapId: string) {
    const adapVuvb = await Harness3dDesignSolutionModel.findOne({
      where: {
        adapDesignSolutionNumber: adapId,
      },
      include: [
        {
          model: FunctionalItemModel,
          include: [
            {
              model: CircuitModel,
            },
          ],
        },
      ],
    });
    if (adapVuvb) {
      return {
        sequenceNumber: adapVuvb.fin[0].sequenceNumber,
        circuit: adapVuvb.fin[0].circuit.letters,
      };
    }
    return {
      sequenceNumber: "9999",
      circuit: "VB",
    };
  }

  /**
   * get all pz for adpDs
   * @param adapId
   * @param adapVersion
   * @returns
   */
  public async getAdapDsPzDsData(adapId: string, adapVersion: string) {
    return await Harness3dDesignSolutionModel.findOne({
      where: {
        adapDesignSolutionNumber: adapId,
        adapDesignSolutionVersionNumber: adapVersion,
      },
      include: [
        {
          attributes: ["name", "version", "issue", "dataStatus"],
          model: PartZoneModel,
          include: [
            {
              attributes: ["name"],
              model: UserAreaModel,
            },
          ],
        },
      ],
    });
  }

  /**
   * get all pz for adpDs
   * @param adapId
   * @param adapVersion
   * @returns
   */
  public async getAllAdapDsPzDsData(adapId: string, status = "frozen") {
    return await Harness3dDesignSolutionModel.findAll({
      where: {
        adapDesignSolutionNumber: adapId,
        dataStatus: status,
      },
      include: [
        {
          attributes: ["name", "version", "issue"],
          model: PartZoneModel,
          include: [
            {
              attributes: ["name"],
              model: UserAreaModel,
            },
          ],
        },
      ],
    });
  }

  /**
   * check if adapDs exists
   * @param adapId
   * @param adapVersion
   * @returns
   */
  public async findAdapDs(adapId: string, adapVersion: string) {
    return await Harness3dDesignSolutionModel.findOne({
      where: {
        adapDesignSolutionNumber: adapId,
        adapDesignSolutionVersionNumber: adapVersion,
      },
    });
  }

  public async updateHarnessWithNewStatus(adapId: number, status = "OK") {
    await Harness3dDesignSolutionModel.update(
      { psSynchroStatus: status, psSynchroDate: new Date() } as any,
      {
        where: {
          id: adapId,
        },
      }
    );
  }

  /**
   * update pzStatus as official in Harness3dDsPzRelationModel
   * @param specifiedPzDs
   * @param getAdapId
   */
  public async updatePZRelationWithHarness(
    specifiedPzDs: ISpecifiedPzDs[],
    getAdapId: number,
    status = "Official"
  ) {
    await Promise.all(
      specifiedPzDs.map(async (specifiedPz) => {
        const pzDs = await PartZoneModel.findOne({
          where: { name: specifiedPz.id, version: specifiedPz.version },
        });
        return await Harness3dDsPzRelationModel.update(
          { pzStatus: status } as any,
          {
            where: {
              harness3dDesignSolutionId: getAdapId,
              partZoneId: pzDs.id,
            },
          }
        );
      })
    );
  }
}
