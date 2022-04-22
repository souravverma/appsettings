/**
 * PartZoneController, used to find create and updated partzones
 **/
import PartZoneModel from "../../models/Partzone.model";
import {
  IHarness3dDesignSolution,
  IPartZone,
} from "../../interfaces/mapping.interface";
import { IWhereClause } from "../../interfaces/WhereClause.interface";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import Harness3dDesignSolutionController from "../Harness/Harness3dDesignSolution.controller";
import UserAreaController from "../UserArea.controller";
import FunctionalItem3dSolutionController from "../FunctionalItem/FunctionalItem3dSolution.controller";
import Branch3dController from "../Branch/Branch3d.controller";
import DeletePartZone from "./DeletePartzone.controller";
import ManagePartZoneAssignment from "./ManagePartZoneAssignment.controller";
import PartZoneHelper from "./PartzoneHelper.controller";
import sequelize, { IncludeOptions } from "sequelize";
import { IWhereClauseParent } from "../../interfaces/Processing.interface";
import Harness3dDsPzRelationModel from "../../models/Harness3dDsPzRelation.model";
export default class PartZoneController {
  deletePartzone = new DeletePartZone();

  static nestedIncludeOptions: IncludeOptions = {
    model: PartZoneModel,
    attributes: ["id", "name", "version"],
    include: [
      FunctionalItem3dSolutionController.nestedIncludeOptions,
      Branch3dController.nestedIncludeOptions,
    ],
    paranoid: false,
  };

  /**
   * Find all Partzones for the condition
   * @returns all Partzones for the condition
   */
  public async findPartZone(
    whereCondition: sequelize.WhereOptions<any>
  ): Promise<PartZoneModel> {
    try {
      return await PartZoneModel.findOne({
        where: whereCondition,
        include: [
          {
            model: Harness3dDesignSolutionModel,
            attributes: ["id"],
          },
        ],
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * createOrUpdate Partzone
   * @param isProptoolData flag to check proptool
   * @param data partzone data from proptool for creational
   * @param harnessdata harness data from proptool for creational
   * @param transaction sequlize flag to maintain transactions - still to implement
   * @param whereClause conditional clause
   */
  public async createOrUpdate(
    isProptoolData: boolean,
    data: IPartZone[],
    harnessdata: IHarness3dDesignSolution,
    transaction: sequelize.Transaction,
    whereClause: IWhereClauseParent
  ): Promise<any> {
    try {
      console.log("Creating Partzone ... ");
      const managePartZone = new ManagePartZoneAssignment();
      const partZoneHelper: PartZoneHelper = new PartZoneHelper();
      const harnessController = new Harness3dDesignSolutionController();
      const userAreaController: UserAreaController = new UserAreaController();
      if (!Array.isArray(data)) data = [data];
      let newPartZone: PartZoneModel;
      const partZones: any[] = [];
      const parentHarness = await harnessController.findHarness(harnessdata);
      await Promise.all(
        data.map(async (partZone: IPartZone) => {
          const whereCondition: any = partZoneHelper.setWhereCondition(
            isProptoolData,
            partZone,
            data
          );
          const existingPartZone: PartZoneModel = await this.findPartZone(
            whereCondition
          );

          if (existingPartZone) {
            await partZoneHelper.updatePartZoneonProptoolLoad(existingPartZone);
            if (partZone.pzStatus === "Official") {
              await Harness3dDsPzRelationModel.upsert({
                harness3dDesignSolutionId: parentHarness.id,
                partZoneId: existingPartZone.id,
                pzStatus: "Official",
              });
            }
            if (partZone.origin) {
              newPartZone = await partZoneHelper.updatePartZone(
                partZone,
                existingPartZone,
                parentHarness.id
              );
              partZones.push(newPartZone);
            } else {
              const pz = await partZoneHelper.getAllPartZonesWithName(partZone);
              const latestPartZone = pz[0];
              let secondLastPartzone = null;
              if (pz.length > 1) {
                secondLastPartzone = pz[1];
              }
              // smart upload update version only if latest Partzone is in temporary or waiting_data
              partZoneHelper.updatePartzoneVersionNumber(
                partZone,
                latestPartZone,
                whereClause
              );
              if (
                latestPartZone.dataStatus === "temporary" ||
                latestPartZone.dataStatus === "waiting_data"
              ) {
                if (
                  secondLastPartzone !== null &&
                  secondLastPartzone.dataStatus === "frozen"
                ) {
                  await partZoneHelper.smartUploadTemporaryOrWaiting(
                    partZone,
                    secondLastPartzone,
                    latestPartZone
                  );
                }
                // latest partzone is the only partzone with waiting_data or temporary status
                else if (secondLastPartzone === null) {
                  await partZoneHelper.updateLatestPartzone(
                    partZone,
                    latestPartZone
                  );
                }
                newPartZone = latestPartZone;
                partZones.push(newPartZone);
              }
              // COMMENTED THE LINE OF CODE AS SMARTUPLOAD IS GOING OUT.
              // IF UNCOMMENTED, THESE LINES BREAKS THE IMPLEMANTATION OF APS ADAP 6A AND 6B USE CASES
              // block of code for implementing second algo for smart upload if the LPZ is in frozen state and DS in temporary status
              // else if (latestPartZone.dataStatus === "frozen") {
              //   const harness = await partZoneHelper.getHarness(latestPartZone);
              //   if (harness) {
              //     parentHarness = harness;
              //     // newPartZone = await PartZoneModel.create(partZone);
              //     newPartZone = latestPartZone;
              //     partZones.push(newPartZone);
              //   }
              // }
            }
          } else {
            if (partZone.userArea[0] === "X" && partZone.origin) {
              partZone.dataStatus = "waiting_syncro";
            }
            partZoneHelper.update2D3DDataForPartzone(partZone);
            newPartZone = await PartZoneModel.create(partZone);
            partZones.push(newPartZone);
          }
          if (newPartZone) {
            if (partZone.pzStatus === "Official") {
              await Harness3dDsPzRelationModel.upsert({
                harness3dDesignSolutionId: parentHarness.id,
                partZoneId: newPartZone.id,
                pzStatus: "Official",
              });
            }

            await partZoneHelper.updateNewPartzone(newPartZone);
            await partZoneHelper.newPartzoneSetOriginId(
              partZone,
              newPartZone,
              JSON.parse(JSON.stringify(existingPartZone))
            );
          }
          return Promise.resolve();
        })
      );

      await Promise.all(
        partZones.map(async (partzone) => {
          await userAreaController.createOrUpdate(
            partzone.name.slice(-2),
            partzone
          );
        })
      );

      await Promise.all(
        partZones.map((partZone) =>
          managePartZone.managePartZoneAssignment(partZone, parentHarness)
        )
      );
    } catch (error) {
      console.log("Error creating Partzone :", error);
      transaction.rollback();
      Promise.reject(error);
    }
  }

  /**
   * Find and remove all orphan Partzones for the condition
   * @returns
   */
  public async removeOrphanPartZoneAndFindAllPartZone(
    whereClause?: IWhereClause
  ): Promise<PartZoneModel[]> {
    const limit = whereClause.pageLength;
    const offset = whereClause.startIndex;

    delete whereClause.pageLength;
    delete whereClause.startIndex;
    const whereCondition: any = {
      where: whereClause,
      include: [
        {
          model: Harness3dDesignSolutionModel,
          attributes: ["id"],
        },
      ],
    };
    if (limit) whereCondition.limit = Number(limit);
    if (offset) whereCondition.offset = Number(offset);

    const partzoneList = await PartZoneModel.findAll(whereCondition);
    const orphanPzs: PartZoneModel[] = partzoneList?.filter(
      (pz: PartZoneModel) => {
        return (
          (!pz.harness3d || !pz.harness3d.length) &&
          partzoneList.filter((partZone) => partZone.name === pz.name)
            .length === 1
        );
      }
    );
    if (orphanPzs.length) {
      try {
        const deletePartZoneController = new DeletePartZone();

        await Promise.all(
          orphanPzs.map(async (pz) => {
            await deletePartZoneController.deleteAdapDsRelation(
              orphanPzs[0],
              true
            );
            return deletePartZoneController.deletePartZone(pz, true);
          })
        );
      } catch (error) {
        console.log("deleting orphan pz error", error);
        // return list of original pzs if there is any error while deleting the orphan pzs
        return partzoneList;
      }
    }

    return partzoneList?.filter((pz: PartZoneModel) => pz.harness3d?.length);
  }
}
