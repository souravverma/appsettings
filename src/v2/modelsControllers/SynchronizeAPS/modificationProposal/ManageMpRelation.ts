import PartZoneModel from "../../../models/Partzone.model";
import {
  IDeltaMp,
  ISpecifiedPzDs,
} from "../AdapDsPzDs/interface/AdapDsPzDs.interface";
import ModificationProposalModel from "../../../models/ModificationProposal.model";
import ModificationProposalPzSolutionRelationModel from "../../../models/ModificationProposalPzSolutionRelation";
import ModificationProposal from "./ModificationProposal";
import { injectable } from "tsyringe";

@injectable()
export default class ManageMpRelation {
  /**
   * Find pz for the condition
   * @returns
   */
  public async findOnePz(whereCondition: { name: string }): Promise<any> {
    try {
      return await PartZoneModel.findOne({
        where: whereCondition,
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  reStructureMpArray(data: IDeltaMp[]) {
    const mpDelta: Object[] = [];
    data[0].added.forEach((mp) => {
      mpDelta.push({ type: "added", name: mp });
    });
    data[0].removed.forEach((mp) => {
      mpDelta.push({ type: "removed", name: mp });
    });
    return mpDelta;
  }

  /**
   * Creates new ModificationProposalPzSolutionRelation
   * @param data
   * @returns
   */
  public async createOrUpdate(
    data: IDeltaMp[],
    partzone: string
  ): Promise<any> {
    let mpDataRelation;
    try {
      const mpDelta = this.reStructureMpArray(data);
      const modificationProposal = new ModificationProposal();
      const pz = await this.findOnePz({
        name: partzone,
      });
      await ModificationProposalPzSolutionRelationModel.destroy({
        force: true,
        where: {
          partzone: pz.id,
        },
      });
      const model = async (item: any) => {
        if (!item) return;
        const mpData: ModificationProposalModel =
          await modificationProposal.createOrFetchMdProposal(item.name);
        mpDataRelation = {
          mpDeltaId: mpData.id,
          partzone: pz.id,
          mpDelta: item.type,
        };
        return await ModificationProposalPzSolutionRelationModel.create(
          mpDataRelation
        );
      };
      return await Promise.all(mpDelta.map((item) => model(item)));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * iterate specificDs array and save modificationproposal and link to pz in each object
   * @param specifiedDs
   * @returns
   */
  public async extractSpecificDs(specifiedDs: ISpecifiedPzDs[]) {
    try {
      const model = async (item: ISpecifiedPzDs) => {
        if (!item || !item.deltaMp || !item.deltaMp?.length) return;
        await this.createOrUpdate(item.deltaMp, item.id);
      };
      return await Promise.all(specifiedDs.map((item) => model(item)));
    } catch (error) {
      console.log(
        "APS synchronization error creating ModificationProposalPz: ",
        error
      );
      return Promise.reject(error);
    }
  }
}
