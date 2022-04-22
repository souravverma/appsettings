import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import Branch3dModel from "../../models/Branch3d.model";
import PrototypeModelController from "../PrototypeModel.controller";
import { IBranch3d, IMappedData } from "../../interfaces/mapping.interface";
import PartZoneModel from "../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import Branch3dSegmentController from "./Segment.controller";
import EnvironmentTypeController from "../Environment.controller";
import BranchPointDefinitionController from "./BranchPointDefinition.controller";
import RouteCategoryController from "../Routes/RouteCategory.controller";
import CoveringElement3dController from "./CoveringElement3d.controller";
import Branch3dExtremitySolutionController from "./Branch3dExtremitySolution.controller";
import { isArray } from "util";
import sequelize, { Op, IncludeOptions } from "sequelize";
import DeleteBranchElements from "./DeleteBranchElements";
import { injectable } from "tsyringe";
import FunctionalItem3dSolutionController from "../FunctionalItem/FunctionalItem3dSolution.controller";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import DeleteFunctionalItem from "../FunctionalItem/DeleteFunctionalItem.controller";

@injectable()
export default class Branch3dController extends PrototypeModelController {
  static nestedIncludeOptions: IncludeOptions = {
    model: Branch3dModel,
    attributes: ["id"],
    include: [
      CoveringElement3dController.nestedIncludeOptions,
      Branch3dSegmentController.nestedIncludeOptions,
      BranchPointDefinitionController.nestedIncludeOptions,
      Branch3dExtremitySolutionController.nestedIncludeOptions,
    ],
    paranoid: false,
  };
  protected model: typeof Branch3dModel = Branch3dModel;
  // protected partZoneController: PartZoneController;
  protected partZoneModel: typeof PartZoneModel = PartZoneModel;
  protected whereClause: IWhereClauseParent;
  protected collection: Branch3dModel[];
  private routeCategoryController: RouteCategoryController;
  private branch3dSegmentController: Branch3dSegmentController;
  private environmentTypeController: EnvironmentTypeController;
  private branchPointDefinitionController: BranchPointDefinitionController;
  private deleteFunctionalItem = new DeleteFunctionalItem();

  constructor() {
    super();
    // this.partZoneController = new PartZoneController();
    this.routeCategoryController = new RouteCategoryController();
    this.branch3dSegmentController = new Branch3dSegmentController();
    this.environmentTypeController = new EnvironmentTypeController();
    this.branchPointDefinitionController =
      new BranchPointDefinitionController();
  }

  public async findAll(): Promise<Branch3dModel[]> {
    try {
      console.log("WhereClause PZ: ");
      for (const [key, value] of Object.entries(this.whereClause.partZone)) {
        console.log(`${key}: ${value}`);
      }
      console.log("WhereClause DS: ");
      for (const [key, value] of Object.entries(
        this.whereClause.harness3dDesignSolution
      )) {
        console.log(`${key}: ${value}`);
      }

      return await this.model.findAll({
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
      });
      // this.collection;
    } catch (error) {
      Promise.reject(error);
    }
  }

  public async findAllBranchAssociation(
    branchModel: Branch3dModel
  ): Promise<any> {
    return await Branch3dModel.findOne({
      where: { id: branchModel.id },
      include: [
        CoveringElement3dController.nestedIncludeOptions,
        Branch3dSegmentController.nestedIncludeOptions,
        BranchPointDefinitionController.nestedIncludeOptions,
        {
          model: Branch3dExtremitySolutionModel,
          attributes: ["id"],
          include: [FunctionalItem3dSolutionController.nestedIncludeOptions],
        },
      ],
    });
  }
  /**
   * Branch related updates
   * @param data
   * @returns
   */
  public async createOrUpdate(
    data: IMappedData,
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    try {
      console.log("Creating Branch3D ... ");
      this.whereClause = whereClause;
      const branches = data.branch3d;
      const partZone: PartZoneModel = await PartZoneModel.findOne({
        where: {
          name: data.partZone[0].name,
          dataStatus: {
            [Op.not]: "frozen",
          },
        },
      });
      this.collection = await this.findAll();
      const processdBranch = await Promise.all(
        branches.map((item) =>
          this.processBranch(JSON.parse(JSON.stringify(item)), partZone, data)
        )
      );
      await this.clean(branches, JSON.parse(JSON.stringify(this.collection)));
      return processdBranch;
    } catch (error) {
      console.log("Error creating Branch3D: ", error);
      transaction.rollback();
      return Promise.reject(error);
    }
  }

  private async processBranch(
    item: any,
    partZone: PartZoneModel,
    data: IMappedData
  ): Promise<any> {
    // we extract the needed information for linked objects
    // We first filter out all the partzones with the same name and then only find the partzone with data status not frozen
    // const partZones: PartZoneModel[] = this.partZoneController.filter(<IWhereClause>item.refParent.whereClause);
    // const partZone: PartZoneModel = partZones.find(partZone => partZone.dataStatus !== 'frozen');

    let routes: string[];
    let isBranchRouteUpdated = false;
    let effectiveRoutes = item.effectiveRoutes;
    const segments = item.segment;
    const branch3dPointDefinition = item.branch3dPointDefinition;
    const environmentType = item.environmentType;
    if (!isArray(effectiveRoutes)) effectiveRoutes = [effectiveRoutes];

    this.clearBranchInformation(item);

    // let branch3d1: Branch3dModel = await this.model.findOne({where:{ name: item.name }});
    let branch3d = this.findWithCollection<Branch3dModel>(
      { name: item.name },
      this.collection
    );

    if (branch3d) {
      routes = await this.routeCategoryController.getAllRoutes(branch3d);
    }

    if (branch3d && !this.compareRoute(effectiveRoutes, routes)) {
      console.log(
        `Updating existing branch ${branch3d.name} (linked to ${branch3d.partZone.version}/${branch3d.partZone.issue}) with new Route...`
      );
      isBranchRouteUpdated = true;
      branch3d = await branch3d.update(item);
    } else if (branch3d && !this.ObjectIncluded(item, branch3d)) {
      console.log(
        `Updating existing branch ${branch3d.name} (linked to ${branch3d.partZone.version}/${branch3d.partZone.issue})...`
      );
      branch3d = await branch3d.update(item);
    } else if (!branch3d && partZone) {
      console.log(
        `Creating branch ${item.name} for PZ ${partZone.name} (${partZone.version}/${partZone.issue})`
      );
      branch3d = await partZone.$create("b3d", item);
    } else if (!branch3d) {
      console.info("Branch without relation to PartZone :: ", item.name);
      branch3d = await this.model.create(item);
    }
    // else {
    //   console.log(`Branch ${branch3d.name} not updated.`);
    // }
    // we are setting up the partzone status to temporary now that we have 3d data
    if (!partZone.dataStatus || partZone.dataStatus === "waiting_data") {
      partZone.dataStatus = "temporary";
      await partZone.save();
    }
    this.addToCollection(branch3d);

    if (isBranchRouteUpdated) {
      await this.routeCategoryController.cleanBranchRoutesforUpdates(
        effectiveRoutes,
        branch3d,
        data.aircraftProgram.familyName
      );
    }
    await this.branch3dSegmentController.createOrUpdate(segments, branch3d);
    await this.environmentTypeController.createOrUpdate(
      environmentType,
      branch3d
    );
    await this.branchPointDefinitionController.createOrUpdate(
      branch3dPointDefinition,
      branch3d
    );
    await this.routeCategoryController.createOrUpdate(
      effectiveRoutes,
      branch3d,
      data.aircraftProgram,
      "effectiveRoute"
    );
  }

  /**
   * Branch related updates
   * @param data
   * @returns
   */
  public createOrUpdate2(
    data: IMappedData,
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    this.whereClause = whereClause;
    return this.findAll()
      .then(async () => {
        const branches = data.branch3d;
        const partZone: PartZoneModel = await PartZoneModel.findOne({
          where: {
            name: data.partZone[0].name,
            dataStatus: {
              [Op.not]: "frozen",
            },
          },
        });

        return (
          branches
            .reduce((previousPromise, item): Promise<any> => {
              return previousPromise.then(async () => {
                // we extract the needed information for linked objects
                // We first filter out all the partzones with the same name and then only find the partzone with data status not frozen
                // const partZones: PartZoneModel[] = this.partZoneController.filter(<IWhereClause>item.refParent.whereClause);
                // const partZone: PartZoneModel = partZones.find(partZone => partZone.dataStatus !== 'frozen');

                const branch3dPointDefinition = item.branch3dPointDefinition;
                const environmentType = item.environmentType;
                const segments = item.segment;
                let routes: string[];
                let isBranchRouteUpdated = false;
                let effectiveRoutes = item.effectiveRoutes;
                if (!isArray(effectiveRoutes))
                  effectiveRoutes = [effectiveRoutes];

                this.clearBranchInformation(item);

                const branch3d = this.findWithCollection<Branch3dModel>(
                  { name: item.name },
                  this.collection
                );
                if (branch3d) {
                  routes = await this.routeCategoryController.getAllRoutes(
                    branch3d
                  );
                }

                return Promise.resolve()
                  .then(() => {
                    if (
                      branch3d &&
                      !this.compareRoute(effectiveRoutes, routes)
                    ) {
                      console.log(
                        `Updating existing branch ${branch3d.name} (linked to ${branch3d.partZone.version}/${branch3d.partZone.issue}) with new Route...`
                      );
                      isBranchRouteUpdated = true;
                      return branch3d.update(item);
                    } else if (
                      branch3d &&
                      !this.ObjectIncluded(item, branch3d)
                    ) {
                      console.log(
                        `Updating existing branch ${branch3d.name} (linked to ${branch3d.partZone.version}/${branch3d.partZone.issue})...`
                      );
                      return branch3d.update(item);
                    } else if (!branch3d && partZone) {
                      console.log(
                        `Creating branch ${item.name} for PZ ${partZone.name} (${partZone.version}/${partZone.issue})`
                      );
                      return partZone.$create("b3d", item);
                    } else if (!branch3d) {
                      console.info(
                        "Branch without relation to PartZone :: ",
                        item.name
                      );
                      return this.model.create(item);
                    } else {
                      // console.log(`Branch ${branch3d.name} not updated.`);
                      return branch3d;
                    }
                  })
                  .then(async (newBranch: Branch3dModel) => {
                    // we are setting up the partzone status to temporary now that we have 3d data
                    if (
                      !partZone.dataStatus ||
                      partZone.dataStatus === "waiting_data"
                    ) {
                      partZone.dataStatus = "temporary";
                      await partZone.save();
                    }
                    this.addToCollection(newBranch);

                    if (isBranchRouteUpdated)
                      await this.routeCategoryController.cleanBranchRoutesforUpdates(
                        effectiveRoutes,
                        newBranch,
                        data.aircraftProgram.familyName
                      );

                    return await Promise.all([
                      this.branch3dSegmentController.createOrUpdate(
                        segments,
                        newBranch
                      ),
                      this.environmentTypeController.createOrUpdate(
                        environmentType,
                        newBranch
                      ),
                      this.branchPointDefinitionController.createOrUpdate(
                        branch3dPointDefinition,
                        newBranch
                      ),
                      this.routeCategoryController.createOrUpdate(
                        effectiveRoutes,
                        newBranch,
                        data.aircraftProgram,
                        "effectiveRoute"
                      ),
                    ]);
                  })
                  .catch((err: Error) => {
                    console.error(err);
                    return Promise.reject(err);
                  });
              });
            }, Promise.resolve())
            // We dont call clean here because brancExt is dependt on branch3d so we shld call delete simultaneously
            .then(() => {
              return { after: branches, before: this.collection };
            })
            .catch((err: Error) => Promise.reject(err))
        );
      })
      .catch((err: Error) => Promise.reject(err));
  }

  /**
   * we delete the extra information for following match check
   * @param item
   */
  private clearBranchInformation(item: IBranch3d) {
    delete item.refParent;
    delete item.branch3dPointDefinition;
    delete item.environmentType;
    delete item.effectiveRoutes;
    delete item.segment;
  }

  /**
   * Check to similar route in branch obj
   * @param effectiveRoutes
   * @param route Introduced
   * @returns the comparison
   */
  private compareRoute(
    effectiveRoutes: string | string[],
    routes: string[]
  ): boolean {
    return JSON.stringify(effectiveRoutes) == JSON.stringify(routes);
  }

  /**
   * function to delete fins that are assosiated to branches
   * @param b3d
   * @returns the promise
   */
  public async cleanAssosiatedFins(b3d: Branch3dExtremitySolutionModel[]) {
    return await Promise.all(
      b3d.map(async (fin: Branch3dExtremitySolutionModel) => {
        if (fin.finDs.length) {
          return await this.deleteFunctionalItem.deleteFinOfPartZone(
            fin.finDs[0],
            false
          );
        }
        return Promise.resolve();
      })
    );
  }
  /**
   * function to to get all B3d id and compare with to be deleated if assosiated with non deleated B3d we will not delete B3DExt
   * @param data
   * @param initialData
   * @returns array of B3d
   */
  private async getAllNonDeleateB3dId(
    data: IBranch3d[],
    initialData: Branch3dModel[]
  ) {
    const allB3dExt: number[] = [];
    await Promise.all(
      initialData.map(async (branch: Branch3dModel) => {
        const branchToDelete = await this.findAllBranchAssociation(branch);
        if (data.find((usedBranch) => usedBranch.name === branch.name)) {
          branchToDelete.b3dExt.forEach((b3d: any) => {
            if (!allB3dExt.includes(b3d.id)) {
              allB3dExt.push(b3d.id);
            }
          });
        }
      })
    );
    return allB3dExt;
  }

  /**
   * function to to compare branches added before and after and call to be deleated branches
   * @param data
   * @param initialData
   * @returns the promise once all branches and aasosiation are deleated
   */
  public async clean(
    data: IBranch3d[],
    initialData: Branch3dModel[]
  ): Promise<any> {
    const assosiatedB3ds = await this.getAllNonDeleateB3dId(data, initialData);
    return await Promise.all(
      initialData.map(async (branch) => {
        const branchToDelete = await this.findAllBranchAssociation(branch);

        if (!data.find((usedBranch) => usedBranch.name === branch.name)) {
          branchToDelete.b3dExt.forEach(
            (bExt: Branch3dExtremitySolutionModel, i: number) => {
              if (assosiatedB3ds.includes(bExt.id)) {
                delete branchToDelete.b3dExt[i];
              }
            }
          );
          await Branch3dController.deleteBranch(branchToDelete, false);
          console.log("Branch " + branch.name + " has been destroyed.");
          return await this.cleanAssosiatedFins(branchToDelete.b3dExt);
        }
        return Promise.resolve();
      })
    );
  }

  /*-- function to delete branches
         delete branch3dCoveringElementSolutionRelation
         delete all covering element
         delete branch3dExtremityRelation
         delete all BranchExtremity
         delete RouteBranch3dRelation
         delete Branch3dEnvironmentRelationModel
         delete all  BranchPointDefinition
         delete all Branch3dSegmentModel
         delete branches
     */
  static async deleteBranch(b3d: Branch3dModel, destroyForce: boolean) {
    const b3dCovElement: DeleteBranchElements = new DeleteBranchElements();
    await b3dCovElement.deleteBranch3dCoveringElementSolutionRelationModel(
      b3d,
      destroyForce
    );
    await Promise.all(
      b3d.cvrgElem.map((coveringElement) => {
        return b3dCovElement.deleteCoveringElement(
          coveringElement,
          destroyForce
        );
      })
    );
    await b3dCovElement.deleteBranch3dExtremityRelationModel(b3d, destroyForce);
    await Promise.all(
      b3d.b3dExt.map((branch3DExtremity) => {
        return b3dCovElement.deleteBranchExtremity(
          branch3DExtremity,
          destroyForce
        );
      })
    );
    await b3dCovElement.deleteRouteBranch3dRelationModel(b3d, destroyForce);
    await b3dCovElement.deleteBranch3dEnvironmentRelationModel(
      b3d,
      destroyForce
    );
    await Promise.all(
      b3d.b3dpointDef.map((b3dpointDef) => {
        return b3dCovElement.deleteBranchPointDefinitionModel(
          b3dpointDef,
          destroyForce
        );
      })
    );
    await b3dCovElement.deleteBranch3dSegmentModel(b3d.segments, destroyForce);
    await b3d.destroy({ force: destroyForce });
    console.log("deleted b3d for b3d.id = " + b3d.id);
    return;
  }
}
