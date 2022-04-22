/* eslint-disable complexity */
import { IconfigFile } from "../interfaces/Processing.interface";
import {
  IMappedData,
  TTablesName,
  IPartZone,
  IHarness3dDesignSolution,
  IPartZoneManagerData,
} from "../interfaces/mapping.interface";
import Harness3dDesignSolutionController from "./Harness/Harness3dDesignSolution.controller";
import PartZoneController from "./Partzone/PartZone.controller";
import FunctionalItemController from "./FunctionalItem/FunctionalItem.controller";
import AircraftProgramController from "./AircraftProgram.controller";
import Branch3dController from "./Branch/Branch3d.controller";
import Branch3dExtremitysolutionController from "./Branch/Branch3dExtremitySolution.controller";
import FunctionalItem3dSolutionController from "./FunctionalItem/FunctionalItem3dSolution.controller";
import ComponentController from "./Component.controller";
import Backshell3dSolutionController from "./Backshell3dSolution.controller";
import CoveringElement3dController from "./Branch/CoveringElement3d.controller";
import { ComponentsEnum } from "../ConfigurationFiles/GlobalEnums";
import DeletePartZone from "./Partzone/DeletePartzone.controller";
import { container } from "tsyringe";
import DeleteCoveringElements from "./Branch/DeleteCoveringElements.controller";

export default class ModelsFactoryController {
  private _aircraftProgramController: AircraftProgramController;

  private _componentController: ComponentController;
  // private _harness3dDesignSolutionController: Harness3dDesignSolutionController;
  // private _functionalItemController: FunctionalItemController;
  private _partZoneController: PartZoneController;
  private _destroyPartZone: DeletePartZone;
  private _branch3dController: Branch3dController;
  private _branch3dExtremitySolutionController: Branch3dExtremitysolutionController;
  private _functionalItem3dSolutionController: FunctionalItem3dSolutionController;
  private _backshell3dSolutionController: Backshell3dSolutionController;
  private _coveringElement3dController: CoveringElement3dController;
  private _deleteCoveringElement3dController: DeleteCoveringElements;
  private _whereClause = {
    partZone: {},
    harness3dDesignSolution: { adapDesignSolutionNumber: "" },
  };
  private _partzoneDeletionList?: string[];
  toDeleteBranch3d: any;
  toDeleteBranch3dExt: any;

  /**
   * Creates the components
   * @param type
   * @param mappedData
   * @param transaction
   */
  public async createComponent(
    isProptoolData: boolean,
    type: ComponentsEnum,
    mappedData: IMappedData | IPartZoneManagerData,
    transaction: any
  ) {
    try {
      switch (type) {
        case ComponentsEnum.FUNCTIONALITEM:
          if (mappedData.functionalItem && mappedData.aircraftProgram) {
            if (!Array.isArray(mappedData.functionalItem))
              mappedData.functionalItem = [mappedData.functionalItem];
            await container
              .resolve(FunctionalItemController)
              .createOrUpdate(
                mappedData.functionalItem,
                mappedData.aircraftProgram,
                mappedData.harness3dDesignSolution,
                transaction
              );
          }
          break;
        case ComponentsEnum.HARNESS3DDESIGNSOLUTION:
          if (mappedData.harness3dDesignSolution) {
            await container
              .resolve(Harness3dDesignSolutionController)
              .createOrUpdate(
                mappedData.harness3dDesignSolution,
                mappedData.majorComponentAssembly,
                transaction
              );
          }
          break;
        case ComponentsEnum.PARTZONE:
          if (mappedData.partZone) {
            await container
              .resolve(PartZoneController)
              .createOrUpdate(
                isProptoolData,
                mappedData.partZone,
                mappedData.harness3dDesignSolution,
                transaction,
                this._whereClause
              );
          }
          break;
        case ComponentsEnum.BRANCH3D:
          if (!this.isFromPZM(mappedData) && mappedData.branch3d) {
            this._branch3dController = container.resolve(Branch3dController);
            this.toDeleteBranch3d =
              await this._branch3dController.createOrUpdate(
                mappedData,
                transaction,
                this._whereClause
              );
          }
          break;
        case ComponentsEnum.BRANCH3DEXTREMITYSOLUTION:
          if (
            !this.isFromPZM(mappedData) &&
            mappedData.branch3dExtremitySolution
          ) {
            this._branch3dExtremitySolutionController =
              new Branch3dExtremitysolutionController(this._branch3dController);
            // this._branch3dExtremitySolutionController = container.resolve(Branch3dExtremitysolutionController);
            this.toDeleteBranch3dExt =
              await this._branch3dExtremitySolutionController.createOrUpdate(
                mappedData.branch3dExtremitySolution,
                transaction,
                this._whereClause
              );
          }
          break;
        case ComponentsEnum.FUNCTIONALITEM3DSOLUTION:
          if (
            !this.isFromPZM(mappedData) &&
            mappedData.functionalItem3dSolution
          ) {
            // this._functionalItem3dSolutionController = container.resolve(FunctionalItem3dSolutionController);
            this._functionalItem3dSolutionController =
              new FunctionalItem3dSolutionController(
                this._branch3dExtremitySolutionController
              );
            await this._functionalItem3dSolutionController.createOrUpdate(
              mappedData,
              transaction,
              this._whereClause
            );
          }
          break;
        case ComponentsEnum.COMPONENT:
          if (!this.isFromPZM(mappedData) && mappedData.component) {
            this._componentController = await container.resolve(
              ComponentController
            );
            await this._componentController.createOrUpdate(
              mappedData.component,
              transaction
            );
          }
          break;
        case ComponentsEnum.BACKSHELL3DSOLUTION:
          if (!this.isFromPZM(mappedData) && mappedData.backshell3dSolution) {
            this._backshell3dSolutionController =
              new Backshell3dSolutionController(
                this._functionalItem3dSolutionController
              );
            await this._backshell3dSolutionController.createOrUpdate(
              mappedData.backshell3dSolution,
              transaction,
              this._whereClause
            );
          }
          break;
        case ComponentsEnum.COVERINGELEMENT3D:
          if (!this.isFromPZM(mappedData)) {
            this._coveringElement3dController = new CoveringElement3dController(
              this._branch3dController,
              this._branch3dExtremitySolutionController,
              this._componentController
            );
            this._deleteCoveringElement3dController =
              new DeleteCoveringElements();
            await this._deleteCoveringElement3dController.destroyExistingCoveringElement3dModelData(
              mappedData.branch3d,
              transaction,
              this._whereClause
            );

            if (mappedData.coveringElement3d?.length)
              await this._coveringElement3dController.createOrUpdate(
                mappedData.coveringElement3d,
                transaction,
                this._whereClause
              );
          }
          break;
        default:
          break;
      }
    } catch (error) {
      transaction.rollback();
    }
  }

  /**
   * Updates Partzones
   * @param partZoneDeletionList
   */
  public updatePartZoneDeletionList(partZoneDeletionList?: string[]) {
    this._partzoneDeletionList = partZoneDeletionList;
  }

  /**
   * cleanup
   * @param type
   * @returns
   */
  public async delete(type: TTablesName) {
    return await new Promise((resolve, reject) => {
      // switch (type) {
      //   case ComponentsEnum.PARTZONE:
      // await this._destroyPartZone.destroyPartzoneList(this._partzoneDeletionList);
      //     break;
      // }
    });
  }

  /**
   *  whereClause here is use to know what is the unicity on particular table. Because it can change between proptool and KBL.
   * If we want to change the unicity, please check under ../ConfigurationFiles/
   */
  public setWhereClause(
    _configFile: IconfigFile,
    mappedData: IMappedData | IPartZoneManagerData
  ) {
    console.log(
      "Pz :",
      mappedData.partZone.map((v) => v.name)
    );

    if (_configFile.unicities.some((v) => v.name === ComponentsEnum.PARTZONE)) {
      _configFile.unicities
        .find((v) => v.name === ComponentsEnum.PARTZONE)
        .fields.forEach((f: keyof IPartZone) => {
          if (mappedData.partZone[0]) {
            if (mappedData.partZone[0][f]) {
              Object.assign(this._whereClause.partZone, {
                [f]: String(mappedData.partZone[0][f]),
              });
            } else {
              Object.assign(this._whereClause.partZone, {
                name: mappedData.partZone[0].name,
              });
            }
          }
        });
    }

    if (
      _configFile.unicities.some(
        (v) => v.name === ComponentsEnum.HARNESS3DDESIGNSOLUTION
      ) &&
      mappedData.harness3dDesignSolution
    ) {
      _configFile.unicities
        .find((v) => v.name === ComponentsEnum.HARNESS3DDESIGNSOLUTION)
        .fields.forEach((f: keyof IHarness3dDesignSolution) => {
          if (mappedData.harness3dDesignSolution[f])
            Object.assign(this._whereClause.harness3dDesignSolution, {
              [f]: mappedData.harness3dDesignSolution[f],
            });
        });
    }
  }

  /**
   *
   * @param arg
   * @returns
   */
  public isFromPZM(arg: any): arg is IPartZoneManagerData {
    return arg.branch3d === undefined;
  }
}
