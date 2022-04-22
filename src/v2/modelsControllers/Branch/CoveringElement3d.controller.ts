import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import CoveringElement3dModel from "../../models/CoveringElement3d.model";
import PrototypeModelController from "../PrototypeModel.controller";
import {
  IWhereClause,
  ICoveringElement3d,
} from "../../interfaces/mapping.interface";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import ComponentController from "../Component.controller";
import Branch3dController from "./Branch3d.controller";
import Branch3dExtremitySolutionController from "./Branch3dExtremitySolution.controller";
import sequelize, { IncludeOptions, Op } from "sequelize";

import Branch3dModel from "../../models/Branch3d.model";
import { isArray } from "util";
import Branch3dExtremityCoveringElementRelation from "../../models/Branch3dExtremityCoveringElementRelation.model";
import CoveringElementTypeModel from "../../models/CoveringElementType.model";
import ComponentModel from "../../models/Component.model";

export default class CoveringElement3dController extends PrototypeModelController {
  static nestedIncludeOptions: IncludeOptions = {
    model: CoveringElement3dModel,
    attributes: ["id"],
    paranoid: false,
  };
  protected model: typeof CoveringElement3dModel = CoveringElement3dModel;
  protected collection: CoveringElement3dModel[];
  protected collectionCoveringElement3dModel: CoveringElement3dModel[];
  protected branchController: Branch3dController;
  protected branchExtController: Branch3dExtremitySolutionController;
  protected componentController: ComponentController;
  protected whereClause: IWhereClauseParent;

  protected b3dExtCvrgElemRelationModel: typeof Branch3dExtremityCoveringElementRelation =
    Branch3dExtremityCoveringElementRelation;

  constructor(
    branchController: Branch3dController,
    branchExtController: Branch3dExtremitySolutionController,
    componentController: ComponentController
  ) {
    super();
    this.branchController = branchController;
    this.branchExtController = branchExtController;
    this.componentController = componentController;
  }

  public async findOneFromCoveringElement3D(
    data: sequelize.WhereOptions<any>,
    whereClauseBranch: IWhereClause[] | IWhereClause
  ): Promise<CoveringElement3dModel> {
    try {
      const whereClause = {};
      let whereClauseFinal: any;

      if (isArray(whereClauseBranch)) {
        whereClauseBranch.forEach((item) => {
          Object.assign(whereClause, item);
        });
        whereClauseFinal = { [Op.or]: whereClause };
      } else {
        whereClauseFinal = whereClauseBranch;
      }

      return await this.model.findOne({
        where: data as any,
        include: [
          {
            model: Branch3dModel,
            where: whereClauseFinal,
            include: [
              {
                model: PartZoneModel,
                where: this.whereClause.partZone,
                duplicating: true,
                include: [
                  {
                    model: Harness3dDesignSolutionModel,
                    where: this.whereClause.harness3dDesignSolution,
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * created and updates the component(sleeves and markers) data
   * @param data
   * @param transaction
   * @param whereClause
   */
  async createOrUpdate(
    data: ICoveringElement3d[],
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    this.whereClause = whereClause;
    await Promise.all(
      data.map(async (item) => {
        let whereClauseBranch: IWhereClause[] | IWhereClause =
          item.refParent.find((v) => v.ref === "branch3d").whereClause;
        let whereClausecomponent: IWhereClause[] | IWhereClause =
          item.refParent.find((v) => v.ref === "component").whereClause;
        let whereClauseBranchExt: IWhereClause[] | IWhereClause =
          item.refParent.find(
            (v) => v.ref === "branch3dExtremitySolution"
          ).whereClause;

        return await this.findOneFromCoveringElement3D(
          { name: item.name },
          whereClauseBranch
        )
          .then(async (result: CoveringElement3dModel) => {
            const coveringType = await CoveringElementTypeModel.findOne({
              where: { name: item.type },
            });
            if (result) {
              return result.update({
                ...item,
                fk_covering_element_type_id: coveringType.id,
              });
            } else {
              return this.model.create({
                ...item,
                fk_covering_element_type_id: coveringType.id,
              });
            }
          })
          .then(async (newCvrgElem: CoveringElement3dModel) => {
            this.addToCollection(newCvrgElem);
            if (!isArray(whereClausecomponent))
              whereClausecomponent = [whereClausecomponent];

            if (!isArray(whereClauseBranchExt))
              whereClauseBranchExt = [whereClauseBranchExt];

            if (!isArray(whereClauseBranch))
              whereClauseBranch = [whereClauseBranch];
            await Promise.all(
              whereClauseBranchExt.map((bExt) => {
                const branchExt = this.branchExtController.find({
                  name: bExt.name,
                });
                if (branchExt) {
                  return this.b3dExtCvrgElemRelationModel.upsert({
                    branch3dExtremityId: branchExt.id,
                    coveringElement3dId: newCvrgElem.id,
                    lengthMm: bExt.extra.lengthMm,
                  });
                }
                console.log("branch ext not found :: ", bExt.name);
                return Promise.resolve([{}, false]);
              })
            );
            await Promise.all(
              whereClauseBranch.map((b3d) => {
                const branch = this.branchController.find(b3d);
                if (branch) return this.attach(newCvrgElem, "cvrgElem", branch);
                console.log("branch not found :: ", b3d);
                return Promise.resolve();
              })
            );
            return await Promise.all(
              whereClausecomponent.map((cpnt) => {
                const component = this.componentController.find(cpnt);
                if (component)
                  return this.attach(newCvrgElem, "cvrgElem", component);
                console.log("branch not found :: ", cpnt);
                return Promise.resolve();
              })
            );
          });
      })
    );
  }

  clean(): Promise<void> {
    return new Promise((resolve, reject) => {});
  }
}
