import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import PrototypeModelController from "../PrototypeModel.controller";
import {
  IFunctionalItem3dSolution,
  IMappedData,
  IWhereClause,
} from "../../interfaces/mapping.interface";
import PartZoneModel from "../../models/Partzone.model";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import Branch3dModel from "../../models/Branch3d.model";
import Branch3dExtremitysolutionController from "../Branch/Branch3dExtremitySolution.controller";
import FunctionalItemSolutionPartZoneRelationController from "./FunctionalItemSolutionPartZoneRelation.controller";
import FunctionalItemController from "./FunctionalItem.controller";
import Backshell3dSolutionController from "../Backshell3dSolution.controller";
import sequelize, { Op, IncludeOptions } from "sequelize";
import PartZoneHelper from "../Partzone/PartzoneHelper.controller";
import FinHelper from "./FinHelper.controller";

export default class FunctionalItem3dSolutionController extends PrototypeModelController {
  static nestedIncludeOptions: IncludeOptions = {
    model: FunctionalItem3dSolutionModel,
    attributes: ["id"],
    include: [Backshell3dSolutionController.nestedIncludeOptions],
    paranoid: false,
  };
  protected model: typeof FunctionalItem3dSolutionModel =
    FunctionalItem3dSolutionModel;
  protected parent: Branch3dExtremitysolutionController;
  protected pzHelper: PartZoneHelper;
  protected finPz: FunctionalItemSolutionPartZoneRelationController;
  protected fin: FunctionalItemController;
  protected whereClause: IWhereClauseParent;
  protected collection: FunctionalItem3dSolutionModel[];
  private finHelper: FinHelper;

  constructor(parent: Branch3dExtremitysolutionController) {
    super();
    this.parent = parent;
    this.finPz = new FunctionalItemSolutionPartZoneRelationController();
    this.pzHelper = new PartZoneHelper();
    this.finHelper = new FinHelper();
  }

  async getAllFins(): Promise<FunctionalItem3dSolutionModel[]> {
    return await this.findWhere(this.whereClause.partZone);
  }

  async findAllExceptInFrozenPartZones(): Promise<
    FunctionalItem3dSolutionModel[]
  > {
    const whereClause = {
      dataStatus: {
        [Op.not]: "frozen",
      },
      ...this.whereClause.partZone,
    };
    return await this.findWhere(whereClause);
  }

  async findWhere(whereClause: any): Promise<FunctionalItem3dSolutionModel[]> {
    return await this.model.findAll({
      include: [
        {
          model: PartZoneModel,
          attributes: ["id"],
          where: whereClause,
        },
      ],
    });
  }

  /**
   * Clean the Fin data from previous uploads
   * @param data
   */
  async clean(data: IFunctionalItem3dSolution[]): Promise<any> {
    try {
      const usedFinSol: string[] = [];
      data.forEach((v) => {
        for (const instance of v.instanceName3d.split("|")) {
          if (!usedFinSol.includes(instance)) usedFinSol.push(instance);
        }
      });
      if (usedFinSol.length > 0) {
        await this.findAllExceptInFrozenPartZones();
        await Promise.all(
          this.collection.map(async (finSol, index) => {
            if (!usedFinSol.includes(finSol.instanceName3d)) {
              console.log(
                "functional Item Solution " +
                  finSol.instanceName3d +
                  " has been destroyed."
              );
              await finSol.destroy();
              this.collection.splice(index, 1);
            }
          })
        );
      }
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Creates or updates new FINs and associates them with the related part zones.
   * @param data The input data parsed from the .xml file.
   */
  async createOrUpdate(
    data: IMappedData,
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    try {
      this.whereClause = whereClause;
      console.log("Creating Functionalitem3Dsolution ... ");
      this.collection = await this.getAllFins();
      await Promise.all(
        data.functionalItem3dSolution.map((item: IFunctionalItem3dSolution) =>
          this.processFunctionalItem3d(item, data)
        )
      );
      return this.clean(data.functionalItem3dSolution);
    } catch (error) {
      console.log("Error creating Functionalitem3Dsolution :", error);
      transaction.rollback();
      Promise.reject(error);
    }
  }

  async processFunctionalItem3d(
    item: IFunctionalItem3dSolution,
    data: IMappedData
  ): Promise<any> {
    const whereClauseBranch3dExtremitySolution: any = <IWhereClause>(
      item.refParent.find((v) => v.ref === "branch3dExtremitySolution")
        .whereClause
    );
    const whereClausePartZone: IWhereClause = <IWhereClause>(
      item.refParent.find((v) => v.ref === "partZone").whereClause
    );
    const whereClauseFunctionalItem: IWhereClause = <IWhereClause>(
      item.refParent.find((v) => v.ref === "functionalItem").whereClause
    );
    delete item.refParent;

    const parent: Branch3dExtremitySolutionModel = this.parent.find(
      <IWhereClause>whereClauseBranch3dExtremitySolution
    );
    const instances = item.instanceName3d.split("|");
    return await Promise.all(
      instances.map((instance: string) =>
        this.processInstances(
          instance,
          item,
          whereClausePartZone,
          whereClauseFunctionalItem,
          parent,
          data
        )
      )
    );
  }

  async processInstances(
    instance: string,
    item: IFunctionalItem3dSolution,
    whereClausePartZone: IWhereClause,
    whereClauseFunctionalItem: IWhereClause,
    parent: Branch3dExtremitySolutionModel,
    data: IMappedData
  ): Promise<any> {
    const whereClause = { instanceName3d: instance };
    let functionalItem;
    functionalItem = await this.finHelper.findFunctionalItem(
      whereClauseFunctionalItem.sequenceNumber,
      whereClauseFunctionalItem.circuit,
      whereClauseFunctionalItem.suffix,
      whereClauseFunctionalItem.appendedLetter
    );

    if (!functionalItem) {
      functionalItem = await this.finHelper.findFunctionalItem(
        whereClauseFunctionalItem.sequenceNumber,
        whereClauseFunctionalItem.circuit,
        "",
        ""
      );
      if (!functionalItem) {
        console.log("functional Item reference not found :: " + instance);
        return;
      }
      // else {
      //   console.log("functional Item reference found :: " + instance);
      // }
    }
    // else {
    //   console.log("functional Item reference found :: " + instance);
    // }

    let finSol: any = this.find<FunctionalItem3dSolutionModel>(whereClause);

    if (finSol && !this.ObjectIncluded(item, finSol)) {
      finSol = await finSol.update(item);
    } else if (!finSol) {
      finSol = await functionalItem.$create("finSol", {
        ...item,
        instanceName3d: instance,
        masterSourceId: "proptool",
      });
    }
    if (parent) {
      // console.log(
      //   `Attaching FIN ${finSol.instanceName3d} to branch ${parent.name} (ID: ${parent.id}) `
      // );
      await finSol.$set("b3dExt", parent);
    } else {
      console.info(
        "functional Item 3d Solution without relation to Branch Extremity :: ",
        item.instanceName3d
      );
    }

    await this.attach(finSol, "finSol", functionalItem);

    const partZones: PartZoneModel[] = await this.pzHelper.retrievePartZones(
      data
    );
    // We now associate all part zones with the FINs
    return await Promise.all(
      partZones.map((partZone: PartZoneModel) =>
        this.finPz.createOrUpdate(
          finSol,
          partZone,
          whereClausePartZone.extra,
          data.aircraftProgram
        )
      )
    );
  }
}
