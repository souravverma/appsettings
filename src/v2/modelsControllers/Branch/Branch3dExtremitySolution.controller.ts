import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import Branch3dExtremitySolutionModel from "../../models/Branch3dExtremitySolution.model";
import PrototypeModelController from "../PrototypeModel.controller";
import {
  IWhereClause,
  IBranch3dExtremitySolution,
} from "../../interfaces/mapping.interface";
import Branch3dModel from "../../models/Branch3d.model";
import PartZoneModel from "../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import Branch3dController from "./Branch3d.controller";
import Branch3dExtremityTypeModel from "../../models/Branch3dExtremityType.model";
import sequelize, { IncludeOptions } from "sequelize";
import { injectable } from "tsyringe";
import FunctionalItem3dSolutionController from "../FunctionalItem/FunctionalItem3dSolution.controller";
import DeleteBranchElements from "./DeleteBranchElements";
import Branch3dExtremityRelationModel from "../../models/Branch3dExtremityRelation.model";

@injectable()
export default class Branch3dExtremitySolutionController extends PrototypeModelController {
  static nestedIncludeOptions: IncludeOptions = {
    model: Branch3dExtremitySolutionModel,
    attributes: ["id"],
    paranoid: false,
  };
  protected b3dController: Branch3dController;
  protected model: typeof Branch3dExtremitySolutionModel =
    Branch3dExtremitySolutionModel;
  protected whereClause: IWhereClauseParent;
  protected collection: Branch3dExtremitySolutionModel[];
  protected branchExtTypeModel = Branch3dExtremityTypeModel;

  constructor(b3dController: Branch3dController) {
    super();
    this.b3dController = b3dController;
  }

  public async findAll(): Promise<Branch3dExtremitySolutionModel[]> {
    try {
      this.collection = await this.model.findAll({
        subQuery: false,
        include: [
          {
            model: Branch3dModel,
            attributes: ["id", "name"],
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
      return this.collection;
    } catch (error) {
      Promise.reject(error);
    }
  }

  async createOrUpdate(
    branchExt: IBranch3dExtremitySolution[],
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    this.whereClause = whereClause;
    await this.findAll();
    await Promise.all(
      branchExt.map(async (item) => {
        const refParent = <IWhereClause[]>item.refParent.whereClause;
        delete item.refParent;
        const parents: any[] = [];
        const whereClause = { name: item.name };
        let branch3dExtSolution: Branch3dExtremitySolutionModel;
        branch3dExtSolution = this.find(whereClause);
        const type = await this.branchExtTypeModel.findOne({
          where: { name: item.type },
        });
        if (item.type && !type) {
          this.logger.error("type not found :: " + item.type);
          return;
        }
        delete item.type;
        return await refParent
          .reduce((previousPromiseItem, whereClauseItem): Promise<any> => {
            return previousPromiseItem.then(() => {
              parents.push({
                b3d: this.b3dController.find({ name: whereClauseItem.name }),
                extra: whereClauseItem.extra,
              });
              // If the type isn't found we skip the row because type is read only

              return Promise.resolve()
                .then(async () => {
                  if (
                    branch3dExtSolution &&
                    !this.ObjectIncluded(
                      {
                        ...item,
                        fk_branch_3d_extremity_type_id: type.id || null,
                      },
                      branch3dExtSolution
                    )
                  ) {
                    return branch3dExtSolution.update({
                      ...item,
                      fk_branch_3d_extremity_type_id: type.id || null,
                    });
                  } else if (!branch3dExtSolution) {
                    return await this.model.create({
                      ...item,
                      fk_branch_3d_extremity_type_id: type.id || null,
                    });
                  } else {
                    return branch3dExtSolution;
                  }
                })
                .then((newBranchExt: Branch3dExtremitySolutionModel) => {
                  branch3dExtSolution = newBranchExt;
                  this.addToCollection(newBranchExt);
                })
                .catch((err: Error) => Promise.reject(err));
            });
          }, Promise.resolve())
          .then(async () => {
            if (parents.length && branch3dExtSolution) {
              const firstParent = parents.shift();
              await branch3dExtSolution.$set("b3d", firstParent.b3d, {
                through: firstParent.extra,
              });

              // await branch3dExtSolution.$set('b3d', parents.splice(0, 1).b3d.id, { through: parentsItem.extra });
              return await parents.reduce(async (previous, parentsItem) => {
                await previous;

                return await this.attach(
                  parentsItem.b3d,
                  "b3d",
                  branch3dExtSolution,
                  parentsItem.extra
                );
              }, Promise.resolve());
            }
            // else {
            //   console.info("Branch Ext without branch :: ", item.name);
            // }
          })
          .catch((err: Error) => Promise.reject(err));
      })
    );
    await this.clean(branchExt, this.collection);
  }

  public async findAllFinsBranchExtAssociation(
    b3dExt: Branch3dExtremitySolutionModel
  ): Promise<any> {
    return await Branch3dExtremitySolutionModel.findOne({
      where: { id: b3dExt.id },
      include: [FunctionalItem3dSolutionController.nestedIncludeOptions],
    });
  }

  public async createOrUpdateR(
    branchExt: IBranch3dExtremitySolution[],
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    try {
      this.whereClause = whereClause;
      console.log("Creating Branch3Dextremitysolution ... ");
      // const branchExt = data.branch3dExtremitySolution;
      await this.findAll();
      await Promise.all(
        branchExt.map(async (item) => {
          const type = await Branch3dExtremityTypeModel.findOne({
            where: { name: item.type },
          });
          if (item.type && !type) {
            this.logger.error("type not found :: " + item.type);
            return;
          }

          const refParent = <IWhereClause[]>item.refParent.whereClause;
          delete item.refParent;
          const parents: any[] = [];
          // let branch3dExtSolution: Branch3dExtremitySolutionModel;
          // refactor, remove collection dependency

          let branch3dExtSolution: Branch3dExtremitySolutionModel = this.find({
            name: item.name,
          });
          // let branch3dExtSolution: Branch3dExtremitySolutionModel = await Branch3dExtremitySolutionModel.findOne({where : {name: item.name } });

          await Promise.all(
            refParent.map(async (element) => {
              parents.push({
                b3d: this.b3dController.find({ name: element.name }),
                extra: element.extra,
              });
              // parents.push({ b3d: await Branch3dModel.findOne({ where : {name: element.name }}), extra: element.extra });
              // If the type isn't found we skip the row because type is read only

              if (
                branch3dExtSolution &&
                !this.ObjectIncluded(
                  { ...item, fk_branch_3d_extremity_type_id: type.id || null },
                  branch3dExtSolution
                )
              ) {
                await branch3dExtSolution.update({
                  ...item,
                  fk_branch_3d_extremity_type_id: type.id || null,
                });
              } else if (!branch3dExtSolution) {
                branch3dExtSolution = await this.model.create({
                  ...item,
                  fk_branch_3d_extremity_type_id: type.id || null,
                });
              }
              this.addToCollection(branch3dExtSolution);
            })
          );

          if (parents.length && branch3dExtSolution) {
            const firstParent = parents.shift();
            await branch3dExtSolution.$set("b3d", firstParent.b3d, {
              through: firstParent.extra,
            });
            // await branch3dExtSolution.$set('b3d', parents.splice(0, 1).b3d.id, { through: parentsItem.extra });
            return await parents.reduce(async (previous, parentsItem) => {
              await previous;
              return await this.attach(
                parentsItem.b3d,
                "b3d",
                branch3dExtSolution,
                parentsItem.extra
              );
            }, Promise.resolve());
          }
          // else {
          //   console.info("Branch Ext without branch :: ", item.name);
          // }
        })
      );
      return { after: branchExt, before: this.collection };
    } catch (error) {
      console.log("Error creating Branch3Dextremitysolution :", error);
      transaction.rollback();
      Promise.reject(error);
    }
  }

  /**
   * function to to compare branches added before and after and call to be deleated Branche3d and fins
   * @param data
   * @param initialData
   * @returns the promise once all Branche3d and aasosiation are deleated
   */
  public async clean(
    data: IBranch3dExtremitySolution[],
    initialData: Branch3dExtremitySolutionModel[]
  ): Promise<any> {
    const b3dCovElement: DeleteBranchElements = new DeleteBranchElements();
    return await Promise.all(
      initialData.map(async (branchExt) => {
        if (!data.find((usedBranch) => usedBranch.name === branchExt.name)) {
          console.log(
            "Branch Extremitiy " + branchExt.name + " has been destroyed."
          );
          const b3dAssociation = await this.findAllFinsBranchExtAssociation(
            branchExt
          );

          await Branch3dExtremityRelationModel.destroy({
            force: false,
            where: {
              fk_branch_3d_extremity_id: branchExt.id,
            },
          });
          if (b3dAssociation) {
            await b3dCovElement.deleteBranchExtremity(b3dAssociation, false);
            await this.b3dController.cleanAssosiatedFins([b3dAssociation]);
          }
        }
        return Promise.resolve();
      })
    );
  }
}
