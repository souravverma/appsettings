import AircraftProgramModel from "../../../models/AircraftProgram.model";
import ModificationProposalModel from "../../../models/ModificationProposal.model";

export default class ModificationProposal {
  /**
   * Find all mdProposal for the condition
   * @returns
   */
  public async findOne(whereCondition: { name: string }): Promise<any> {
    try {
      return await ModificationProposalModel.findOne({
        where: whereCondition,
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Find all mdProposal for the condition
   * @returns
   */
  public async findOneAircraftProgram(whereCondition: {
    familyName: string;
  }): Promise<any> {
    try {
      return await AircraftProgramModel.findOne({
        where: whereCondition,
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * Find or creates new mdProposal
   * @param mpName
   * @returns
   */
  public async createOrFetchMdProposal(mpName: string): Promise<any> {
    try {
      const aircraftProgram: AircraftProgramModel =
        await this.findOneAircraftProgram({
          familyName: "A320",
        });
      const mdProposal: ModificationProposalModel = await this.findOne({
        name: mpName,
      });
      if (mdProposal) {
        return mdProposal;
      } else {
        return await ModificationProposalModel.create({
          name: mpName,
          fk_aircraft_program_id: aircraftProgram.id,
        });
      }
    } catch (error) {
      console.log("APS synchronization error creating mdProposal: ", error);
      return Promise.reject(error);
    }
  }
}
