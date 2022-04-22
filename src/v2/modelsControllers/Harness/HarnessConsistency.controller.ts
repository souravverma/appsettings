import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import { IHarnessConsistency } from "../../interfaces/HarnessConsistency.interface";
import { IadapDsVersionIssue } from "../../interfaces/mapping.interface";
import HarnessForBranches from "./HarnessForBranches.controller";
import HarnessMapping from "./HarnessMapping.controller";
import CalculateHarnessConsistency from "./CalculateHarnessConsistency.controller";
import UpdateHarnessForDesignSolution from "./UpdateHarnessForDS.controller";
import { injectable } from "tsyringe";

@injectable()
export default class HarnessConsistencyController {
  /*
   * @desc Init the consistency check process for all crossref in a specific harness
   * @param {string} adapDesignSolutionNumber
   * @returns {Promise<void>} Promise<void>
   * @memberof HarnessConsistencyController
   */
  public async harnessConsistencyCheck(
    adapDsData: IadapDsVersionIssue
  ): Promise<void> {
    const consolidationMsg: IHarnessConsistency.IconsolidationMsg = {};
    consolidationMsg.error = [];
    consolidationMsg.warning = [];
    consolidationMsg.noError = [];
    const harnessForBranches = new HarnessForBranches();
    const harnessMapping = new HarnessMapping();
    const calculateHarnessConsistency = new CalculateHarnessConsistency();
    const updateHarness = new UpdateHarnessForDesignSolution();

    console.log(
      `Launching consistency check for ${adapDsData.adapDesignSolutionNumber} (${adapDsData.adapDesignSolutionVersionNumber}/${adapDsData.adapDesignSolutionIssueNumber})`
    );
    const crossefByHarnessList: Harness3dDesignSolutionModel[] =
      await harnessForBranches.getCrossRefByHarness(
        adapDsData.adapDesignSolutionNumber,
        adapDsData.adapDesignSolutionVersionNumber
      );
    const mappedHarness: IHarnessConsistency.IHarness =
      harnessMapping.mappingHarnessDataForCrossReference(crossefByHarnessList);
    harnessMapping.checkFinUnicity(crossefByHarnessList, consolidationMsg);
    harnessMapping.checkRouteContinuty(mappedHarness, consolidationMsg);
    harnessMapping.checkRouteContinutyFromPz(
      crossefByHarnessList,
      consolidationMsg
    );
    calculateHarnessConsistency.checkHarnessExtremityCoordinate(
      mappedHarness,
      consolidationMsg
    );

    if (!adapDsData.adapDesignSolutionVersionNumber) {
      const { adapDesignSolutionVersionNumber, adapDesignSolutionIssueNumber } =
        crossefByHarnessList[0];
      adapDsData.adapDesignSolutionVersionNumber =
        adapDesignSolutionVersionNumber;
      adapDsData.adapDesignSolutionIssueNumber = adapDesignSolutionIssueNumber;
    }
    const consistencyResponse: IHarnessConsistency.IResponse =
      calculateHarnessConsistency.getConsistencyResponse(
        adapDsData.adapDesignSolutionNumber,
        mappedHarness.pzStatus,
        mappedHarness.crossRefList,
        consolidationMsg
      );
    if (adapDsData.ChangePsSynchroStatus) {
      adapDsData.ChangePsSynchroStatus =
        crossefByHarnessList[0].psSynchroStatus;
      if (crossefByHarnessList[0].psSynchroStatus === "OK") {
        adapDsData.ChangePsSynchroStatus = "KO";
      }
    }
    await updateHarness.updateHarnessConsolidationStatus(
      adapDsData,
      consistencyResponse
    );
    console.log(
      `Harness :: ${adapDsData.adapDesignSolutionNumber} and version/issue ${adapDsData.adapDesignSolutionVersionNumber}/${adapDsData.adapDesignSolutionIssueNumber}: Consolidation finish with status: ${consistencyResponse.status}`
    );
    return;
  }
}
