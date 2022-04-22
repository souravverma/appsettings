import PartZoneModel from "../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import sequelize from "sequelize";
import FunctionalItemModel from "../../models/FunctionalItem.model";
import CircuitModel from "../../models/Circuit.model";
import { IApiResponseComparativeFin } from "../../interfaces/ApiResponseManager.interface";
import UserAreaModel from "../../models/UserAreaPartZone.model";
import AdapLoModel from "../../models/AdapLo.model";
import AdapItemModel from "../../models/AdapItem.model";
import { IPartZoneModel } from "../../interfaces/IPartZoneModel.interface";

export default class PartzoneswithFunctionalItem {
  /**
   * Fetching all the partzones which are created under VU/VB
   * @param finList
   * @param filteredVB
   * @returns
   */
  public async getPartZoneWithIncludedFin(
    filteredVB?: number | number[]
  ): Promise<PartZoneModel[]> {
    try {
      if (filteredVB && !Array.isArray(filteredVB)) filteredVB = [filteredVB];

      const whereClauseVB = filteredVB
        ? { id: { [sequelize.Op.in]: filteredVB } }
        : {};
      return await PartZoneModel.findAll({
        where: {
          version: {
            [sequelize.Op.not]: null,
          },
        },
        include: [
          {
            model: FunctionalItem3dSolutionModel,
          },
          {
            model: Harness3dDesignSolutionModel,
            attributes: ["id"],
            required: true,
            include: [
              {
                model: FunctionalItemModel,
                where: whereClauseVB,
                include: [
                  {
                    model: CircuitModel,
                    where: { letters: ["VU", "VB"] },
                    required: true,
                  },
                ],
              },
              {
                model: AdapLoModel,
                attributes: ["id"],
                include: [
                  {
                    model: AdapItemModel,
                    attributes: ["number"],
                  },
                ],
              },
            ],
          },
          {
            model: UserAreaModel,
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * formating the partzone results
   * @param results
   * @param finList
   * @returns
   */
  public getFinResponse(
    results: IPartZoneModel[],
    finList: string[]
  ): IApiResponseComparativeFin[] {
    finList = finList.filter((fin) =>
      new RegExp(
        "^([0-9]{0,3}[0-9zZ]{1})([a-zA-Z]{2})([0-9a-zA-Z]{0,3})_?([0-9a-zA-Z]{0,3})$"
      ).test(fin)
    );
    const formatedResponse: IApiResponseComparativeFin[] = results.map(
      (partzone: any) => {
        const finMatched = partzone.finDs
          ?.filter((fin: FunctionalItem3dSolutionModel) =>
            finList.includes(fin.instanceName3d)
          )
          .map((v: FunctionalItem3dSolutionModel) => v.instanceName3d);
        return {
          id: partzone.id,
          name: partzone.name,
          partZoneVersion: partzone.partZoneVersion,
          userArea: partzone.userArea?.name,
          VBs: [].concat(
            ...partzone.harness3d?.map(
              (harness: Harness3dDesignSolutionModel) =>
                harness.fin?.map(
                  (finVb: FunctionalItemModel) =>
                    finVb.sequenceNumber + finVb.circuit?.letters
                )
            )
          ),
          adapCi: [].concat(
            ...partzone.harness3d?.map(
              (harness: Harness3dDesignSolutionModel) =>
                harness.adapLo?.map(
                  (adapLo: AdapLoModel) => adapLo.adapItem?.number
                )
            )
          ),
          finMatched,
          deltaP: partzone.finDs
            ?.filter(
              (fin: FunctionalItem3dSolutionModel) =>
                !finList.includes(fin.instanceName3d)
            )
            .map((v: FunctionalItem3dSolutionModel) => v.instanceName3d),
          nbFinMatched: finMatched?.length,
          nbFinAsked: finList?.length,
          purcentageFinMatched: Math.round(
            (finMatched?.length / partzone.finDs?.length) * 100
          ),
          origin: partzone.fk_origin_id,
          reuse: partzone.fk_origin_id,
          date: new Date(partzone.updatedAt || partzone.updated_at),
          pzType: partzone.pzType,
          status: partzone.dataStatus,
          version: partzone.version,
          issue: partzone.issue,
        };
      }
    );
    return formatedResponse;
  }
}
