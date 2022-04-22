import AdapCi from "./AdapCi";
import PartzoneCi from "./PartzoneCi";
import AdapPartzoneCIRelation from "./AdapPartzoneCiRelation";
import { IAdapCi } from "./interface/AdapPzCi.interface";
import { injectable } from "tsyringe";

@injectable()
export default class SyncAdapCIPzController {
  /**
   * store all adap ci pz ci data
   * @returns
   */
  public async storeAdapCiPzCiData(dataFromAps: IAdapCi[]): Promise<IAdapCi> {
    try {
      const adapCiController: AdapCi = new AdapCi();
      const partzoneCiController: PartzoneCi = new PartzoneCi();
      const adapPartzoneCIRelation: AdapPartzoneCIRelation =
        new AdapPartzoneCIRelation();
      const initialAdapPzCi = await adapPartzoneCIRelation.getPzCisRelation(
        dataFromAps
      );
      const adapCi = await adapCiController.createOrFetchAdapCi(dataFromAps);
      const partzoneCi = await partzoneCiController.createOrUpdate(
        dataFromAps[0].pz_ci
      );
      await adapPartzoneCIRelation.createPartZoneCisRelation(
        adapCi,
        partzoneCi
      );
      await adapPartzoneCIRelation.deleteNonAssociatedPzCi(initialAdapPzCi);
      return adapCi;
    } catch (error) {
      Promise.reject(error);
    }
  }
}
