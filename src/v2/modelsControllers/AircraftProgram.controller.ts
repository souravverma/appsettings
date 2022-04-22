import AircraftProgramModel from "../models/AircraftProgram.model";
import { IAircraftProgram, IDomain } from "../interfaces/mapping.interface";
import AircraftLetterRelationModel from "../models/AircraftLetterRelation.model";
import DomainModel from "../models/Domain.model";

export default class AircraftProgramController {
  public async createOrUpdate(
    data: IAircraftProgram,
    domainData: IDomain
  ): Promise<AircraftProgramModel> {
    return await new Promise((resolve, reject) => {
      const aircraftProgram = data.mainAircraftLetterCode;
      delete data.mainAircraftLetterCode;
      return AircraftProgramModel.findOne({
        where: { familyName: data.familyName },
      })
        .then(async (result: AircraftProgramModel) => {
          if (!result) reject(new Error("Aircraft program not found."));
          const domain = await DomainModel.findOne({
            where: domainData as any,
          });
          await AircraftLetterRelationModel.upsert({
            aircraftLetter: aircraftProgram,
            aircraftProgramId: result.id,
            domainId: domain.id,
          }).then(() => {
            resolve(result);
          });
        })
        .catch((err: Error) => reject(err));
    });
  }
}
