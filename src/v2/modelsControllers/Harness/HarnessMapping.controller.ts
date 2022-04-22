import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import { IHarnessConsistency } from "../../interfaces/HarnessConsistency.interface";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";

export default class HarnessMapping {
  partZoneDataExist: boolean;

  constructor() {}

  /*
   * @desc Map all harness data into an clean Array of all Cross Reference from this harness
   * @param {Harness3dDesignSolutionModel[]} harness3dDesignSolutionList
   * @returns {IHarnessConsistency.IHarness} IHarnessConsistency.IHarness
   * @memberof HarnessConsistencyController
   */
  public mappingHarnessDataForCrossReference(
    harness3dDesignSolutionList: Harness3dDesignSolutionModel[]
  ): IHarnessConsistency.IHarness {
    // We parse the Object to build a temporary list which help us to check crossRef
    const mappedHarness: IHarnessConsistency.IHarness = {};
    let firstDynamicPz, secondDynamicPz, lastToDigtPz;
    let crossRefElement: IHarnessConsistency.IHarnessCrossRef = {};
    for (const harness of harness3dDesignSolutionList) {
      // mappedHarness.adapDesignSolutionNumber = harness.adapDesignSolutionNumber;
      mappedHarness.crossRefList = [];
      mappedHarness.routeContinutyRef = {};
      crossRefElement = {};
      for (const partZone of harness.partZone) {
        // if a pz has waiting data or if it has userarea x we force to display consistancy as KO
        if (
          (partZone.b3d.length < 1 && partZone.name.charAt(12) !== "X") ||
          (harness.partZone.length === 1 && partZone.name.charAt(12) === "X")
        ) {
          mappedHarness.pzStatus = false;
          console.log(
            `PZ ${partZone.name} still in waiting data. Consistency KO.`
          );
          mappedHarness.crossRefList = [];
          this.partZoneDataExist = false;
          return mappedHarness;
        }
        for (const branch of partZone.b3d) {
          this.partZoneDataExist = true;
          mappedHarness.pzStatus = true;
          for (const branchExt of branch.b3dExt) {
            if (branchExt.type.name === "CROSSREF") {
              const crossRefName: string = branchExt.name;
              crossRefElement = {
                partZoneName: partZone.name,
                branch3DName: branch.name,
                branch3DExtremityType: branchExt.type.name,
                branch3DExtremityName: branchExt.name,
                branch3DExtremityCoordinate: {
                  electricalCoordinateX: branchExt.electricalCoordinateX,
                  electricalCoordinateY: branchExt.electricalCoordinateY,
                  electricalCoordinateZ: branchExt.electricalCoordinateZ,
                },
              };
              mappedHarness.crossRefList.push(crossRefElement);

              firstDynamicPz = crossRefName.substring(1, 3);
              secondDynamicPz = crossRefName.substring(3, 5);
              const pzName: string = partZone.name;
              lastToDigtPz = pzName.substring(12, 14);
              if (
                lastToDigtPz === firstDynamicPz ||
                lastToDigtPz === secondDynamicPz
              ) {
                if (!mappedHarness.routeContinutyRef[crossRefName]) {
                  mappedHarness.routeContinutyRef[crossRefName] = {};
                }
                if (!mappedHarness.routeContinutyRef[crossRefName][pzName]) {
                  mappedHarness.routeContinutyRef[crossRefName][pzName] = {
                    route: [],
                  };
                }
                branch.effectiveRoutes.forEach((route) => {
                  mappedHarness.routeContinutyRef[crossRefName][
                    pzName
                  ].route.push(route.name);
                });
                mappedHarness.routeContinutyRef[crossRefName][pzName].status =
                  partZone.consolidationStatus;
              }
            }
          }
        }
      }
    }
    return mappedHarness;
  }

  /**
   *
   * @param harnessList Check for duplicate FINs
   * @returns
   */
  public checkFinUnicity(
    harnessList: Harness3dDesignSolutionModel[],
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ) {
    harnessList.forEach((harness: Harness3dDesignSolutionModel) => {
      const completeFinDsList: string[] = [];
      harness.partZone.forEach((partZone: PartZoneModel) => {
        if (partZone.name.charAt(12) !== "X") {
          partZone.finDs.forEach((fin: FunctionalItem3dSolutionModel) => {
            completeFinDsList.push(fin.instanceName3d);
          });
        }
      });
      const duplicate: string[] = completeFinDsList.filter(
        (value, index, self) => {
          return self.indexOf(value) !== index;
        }
      );

      if (duplicate.length)
        consolidationMsg.error.push(`Fin unicity check failed :: ${duplicate}`);
    });
    return;
  }

  /**
   * @param Harness3dDesignSolutionModel[] harnessList
   * check if partzone has route discontinuty and assign the error message
   */
  public checkRouteContinutyFromPz(
    harnessList: Harness3dDesignSolutionModel[],
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ) {
    harnessList.forEach((harness) => {
      harness.partZone.forEach((partZone) => {
        if (
          partZone.consolidationStatus === "KO" &&
          partZone.name.charAt(12) !== "X"
        ) {
          /* S-422156 - ID39 - New check “Discontinuity route” - need information */
          // Get each lines of the consolidation message displayed at PartZone level
          const consolidationMessage = partZone.consolidationMessage.split(",");
          const failedRoutesSet = new Set();

          for (const line of consolidationMessage) {
            // Retrieve only the routes displayed after "failed for"
            const failedRoutes = line.split("failed for").pop();
            const failedRoutesArray = failedRoutes.trim().split(" ");
            // Add the routes to a set in order to have unique routes
            failedRoutesArray.forEach(failedRoutesSet.add, failedRoutesSet);
          }

          // Add the failed routes to the DS consolidation message
          let failedRoutes = "for route";
          failedRoutes += failedRoutesSet.size > 1 ? "s " : " ";
          failedRoutes += Array.from(failedRoutesSet).join(" ");

          consolidationMsg.error.push(`
            Route Discontunity at ${partZone.name} ${failedRoutes}
          `);
        }
      });
    });
  }

  /**
   * @param {IHarnessConsistency.IHarness} mappedHarness
   * check if Ds has route discontinuty at crossref and assign the error message if N/A show warning
   */
  public checkRouteContinuty(
    mappedHarness: IHarnessConsistency.IHarness,
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ) {
    let crosRef, pzObj, route, unique;
    for (const ref in mappedHarness.routeContinutyRef) {
      crosRef = mappedHarness.routeContinutyRef[ref];
      pzObj = Object.keys(crosRef);
      if (pzObj.length > 1) {
        const routesArray: string[] = [
          ...crosRef[pzObj[0]].route,
          ...crosRef[pzObj[1]].route,
        ];
        if (pzObj[0].charAt(12) !== "X" || pzObj[1].charAt(12) !== "X") {
          unique = routesArray.filter(
            (v: any) => routesArray.indexOf(v) === routesArray.lastIndexOf(v)
          );
          if (unique.length > 0) {
            route = unique.toString().replace(",", " ");
            if (
              ["N/A", null].includes(crosRef[pzObj[0]].status) ||
              ["N/A", null].includes(crosRef[pzObj[1]].status)
            ) {
              consolidationMsg.warning.push(
                `Warning Route Continuity check ${ref} failed for ${route}`
              );
            } else {
              consolidationMsg.error.push(
                `Error Route Continuity check ${ref} failed for ${route}`
              );
            }
          }
        }
      }
    }
  }
}
