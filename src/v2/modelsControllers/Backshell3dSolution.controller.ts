import { IWhereClauseParent } from "../interfaces/Processing.interface";
import Backshell3dSolutionModel from "../models/Backshell3dSolution.model";
import PrototypeModelController from "./PrototypeModel.controller";
import {
  IWhereClause,
  IBackshell3dSolution,
  IWhereClauseExtra,
} from "../interfaces/mapping.interface";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";
import FunctionalItem3dSolutionModel from "../models/FunctionalItem3dSolution.model";
import FunctionalItem3dSolutionController from "./FunctionalItem/FunctionalItem3dSolution.controller";
import PartZoneModel from "../models/Partzone.model";
import ComponentController from "./Component.controller";
import MechanicalBackshellComponentController from "./MechanicalBackshellComponent.controller";
import ComponentModel from "../models/Component.model";
import { IncludeOptions } from "sequelize";
import { isArray, isString } from "util";
import sequelize, { Op } from "sequelize";
import { injectable } from "tsyringe";

@injectable()
export default class Backshell3dSolutionController extends PrototypeModelController {
  static nestedIncludeOptions: IncludeOptions = {
    model: Backshell3dSolutionModel,
    attributes: ["id"],
    paranoid: false,
  };
  protected model: typeof Backshell3dSolutionModel = Backshell3dSolutionModel;
  protected finSolController: FunctionalItem3dSolutionController;
  protected mechaBackshellController: MechanicalBackshellComponentController =
    new MechanicalBackshellComponentController();
  protected componentController: ComponentController;
  protected whereClause: IWhereClauseParent;
  protected collection: Backshell3dSolutionModel[];
  protected usedBackshells: string[];

  constructor(finSolController: FunctionalItem3dSolutionController) {
    super();

    this.finSolController = finSolController;
  }

  /**
   * @description to fetch Backshell3dSolution list
   * @returns
   */
  async findAll(): Promise<Backshell3dSolutionModel[]> {
    try {
      this.collection = await this.model.findAll({
        include: [
          {
            model: FunctionalItem3dSolutionModel,
            attributes: ["id", "instanceName3d", "partNumber3d"],
            required: true,
            include: [
              {
                model: PartZoneModel,
                where: this.whereClause.partZone,
                attributes: ["id"],
                include: [
                  {
                    model: Harness3dDesignSolutionModel,
                    where: this.whereClause.harness3dDesignSolution,
                    attributes: ["id"],
                  },
                ],
              },
            ],
          },
        ],
      });
      return;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /*
   * @description To create or update the backshell3dSolution data
   * @param data
   * @returns
   */
  async createOrUpdate(
    data: IBackshell3dSolution[],
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    try {
      this.whereClause = whereClause;
      console.log("Creating Backshell3Dsolution ... ");
      const fINlist: FunctionalItem3dSolutionModel[] =
        await this.finSolController.getAllFins();
      this.usedBackshells = [];
      await this.findAll();
      const fkFinSolIds: number[] = [];

      data.forEach((item: IBackshell3dSolution) => {
        const { parent } = this.findBackshellItemDetails(item, fINlist);
        if (parent) {
          fkFinSolIds.push(parent.id);
        }
      });

      const backshellSolutionList: Backshell3dSolutionModel[] =
        await Backshell3dSolutionModel.findAll({
          where: { fkFinSol: { [Op.or]: fkFinSolIds } },
        });

      await Promise.all(
        data.map((item: IBackshell3dSolution) => {
          return this.processBackshellItem(
            item,
            fINlist,
            backshellSolutionList
          );
        })
      );

      return await this.clean(data);
    } catch (error) {
      console.log("Error creating Backshell3Dsolution :", error);
      transaction.rollback();
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param data
   * @returns
   */
  async clean(data: IBackshell3dSolution[]): Promise<any> {
    // parse all backshells in DB for this PZ
    return await this.collection.reduce((previous, backshell, index) => {
      return previous.then(async () => {
        // search for the parent FINSol
        const parent: FunctionalItem3dSolutionModel =
          this.finSolController.find<FunctionalItem3dSolutionModel>({
            id: backshell.fkFinSol,
          });
        if (parent) {
          // if the backshell is no more used after the update, it should be deleted
          if (!this.usedBackshells.includes(parent.instanceName3d)) {
            console.log(
              "Backshell for fin sol  :  " +
                parent.instanceName3d +
                " has been destroyed."
            );
            this.collection.splice(index, 1);
            await backshell.destroy();
          }
        } else {
          // if the backshell is not linked to a FINSol it should be deleted
          // console.log("Backshell : " + backshell.id + "  has been destroyed.");
          this.collection.splice(index, 1);
          await backshell.destroy();
        }
      });
    }, Promise.resolve());
  }

  /**
   * function to delete backshells
   * @param backshells
   * @param destroyForce
   */
  static async deleteBackshell(
    backshells: Backshell3dSolutionModel,
    destroyForce: boolean
  ) {
    await backshells.destroy({ force: destroyForce });
    // console.log("deleted backshells for backshells.id = " + backshells.id);
  }

  /**
   * according the FIN name on the backshell item, we search for the FINSOl in the PZ that has this instance name
   * The FINSOL found is the father of the backshell
   * @param item
   * @param fINlist
   * @returns
   */
  private findBackshellItemDetails(
    item: IBackshell3dSolution,
    fINlist: FunctionalItem3dSolutionModel[]
  ) {
    let whereClauseFIN: IWhereClause | IWhereClause[] = item.refParent.find(
      (v) => v.ref === "functionalItem3dSolution"
    )?.whereClause;
    if (!isArray(whereClauseFIN)) {
      whereClauseFIN = [whereClauseFIN];
    }

    // we retrieve the good FINSOL parent from the list already stored during FINSOL creation for this PZ.
    const fIN: string | IWhereClauseExtra = whereClauseFIN[0].instanceName3d;
    const parent: FunctionalItem3dSolutionModel = fINlist.find(
      (f) => f.instanceName3d === fIN
    );

    // we also retrieve the component PartNumber from the backshell item
    let whereClauseComponent: IWhereClause | IWhereClause[] =
      item.refParent.find((v) => v.ref === "component")?.whereClause;
    if (!isArray(whereClauseComponent))
      whereClauseComponent = [whereClauseComponent];

    return { parent, fIN, whereClauseComponent };
  }

  /**
   *  We create the backshell only if we find the parent FINSOL- and we store the FIN to avoid deleting the backshell during the cleaning
   * @param item
   * @param fINlist
   * @param backshellSolutionList
   * @returns
   */
  private async processBackshellItem(
    item: IBackshell3dSolution,
    fINlist: FunctionalItem3dSolutionModel[],
    backshellSolutionList: Backshell3dSolutionModel[]
  ): Promise<void> {
    const { parent, fIN, whereClauseComponent } = this.findBackshellItemDetails(
      item,
      fINlist
    );

    if (parent) {
      if (isString(fIN)) this.usedBackshells.push(fIN);
      // search if the parent ( here a FinSol) has already a backshell
      let backshellSolution: Backshell3dSolutionModel =
        backshellSolutionList.find(
          (backShell) => backShell.fkFinSol === parent.id
        );

      // if a backshell already exists on the FINSOL, we update it
      if (backshellSolution) {
        // console.log("start updating backshell for:" + parent.instanceName3d);
        backshellSolution = await backshellSolution.update(item);
      } else {
        // if no backshell exists on the FINSOl,  we create it
        // console.log("start creating backshell for:" + parent.instanceName3d);
        backshellSolution = await parent.$create("backshell", item);
      }
      this.addToCollection(backshellSolution);
      await Promise.all(
        whereClauseComponent.map(async (cpnt) => {
          // search for the component related to the backshell
          // const component: ComponentModel = await this.componentController.findOne(cpnt);
          const component: ComponentModel = await ComponentModel.findOne({
            where: { partNumber: cpnt.partNumber },
          });
          if (component) {
            return this.attach(backshellSolution, "backshell", component);
          } else {
            console.log("component not found :: ", cpnt);
            return Promise.resolve();
          }
        })
      );
    }
    return;
  }
}
