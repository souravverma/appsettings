import { IHarnessConsistency } from "../../interfaces/HarnessConsistency.interface";
import * as GlobalEnums from "../../ConfigurationFiles/GlobalEnums";
import regexJson from "../../ConfigurationFiles/Regex.json";

export default class CalculateHarnessConsistency {
  warning: any[] = [];
  error: any[] = [];
  noError: any[] = [];

  /*
   * @description to get the consistency response
   * @param crossRefList
   * @returns IHarnessConsistency.IResponse
   */
  public getConsistencyResponse(
    adapDesignSolutionNumber: string,
    pzStatus: boolean,
    crossRefList: IHarnessConsistency.IHarnessCrossRef[],
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ): IHarnessConsistency.IResponse {
    let consistencyResponse: IHarnessConsistency.IResponse;
    consistencyResponse = {
      status: GlobalEnums.ConsistencyStatus.KO,
      message: GlobalEnums.ConsistencyResponseEnum.KOSTATUS,
    };

    const regex = regexJson.DATA_FORMAT["2D_format"];
    const checkIf2DDS = new RegExp(regex).test(adapDesignSolutionNumber);
    if (checkIf2DDS) {
      consistencyResponse = {
        status: GlobalEnums.ConsistencyStatus.WARNING,
        message: GlobalEnums.ConsistencyResponseEnum.NONCONTENT2DDATA,
      };
    }

    const regexToCheck924DS = regexJson.CharAt4thIndex.valueEquals4;
    const checkIf924DS = new RegExp(regexToCheck924DS).test(
      adapDesignSolutionNumber
    );

    if (pzStatus && (consolidationMsg.error || consolidationMsg.warning)) {
      if (
        !consolidationMsg.warning.length &&
        !consolidationMsg.error.length &&
        !crossRefList.length
      ) {
        consistencyResponse = {
          status: GlobalEnums.ConsistencyStatus.OK,
          message: GlobalEnums.ConsistencyResponseEnum.CONSOLIDATIONSTATUS,
        };
      } else if (
        !consolidationMsg.warning.length &&
        !consolidationMsg.error.length &&
        crossRefList.length
      ) {
        consistencyResponse = {
          status: GlobalEnums.ConsistencyStatus.SUCCESS,
          message:
            GlobalEnums.ConsistencyResponseEnum.HARNESSCONSOLIDATIONSTATUS,
        };
      } else if (
        consolidationMsg.warning.length &&
        !consolidationMsg.error.length
      ) {
        consistencyResponse = {
          status: GlobalEnums.ConsistencyStatus.WARNING,
          message: consolidationMsg.warning.join(","),
        };
      } else if (consolidationMsg.error.length) {
        consistencyResponse = {
          status: GlobalEnums.ConsistencyStatus.ERROR,
          message: [
            ...consolidationMsg.warning,
            ...consolidationMsg.error,
          ].join(","),
        };
      }
    } else if (checkIf924DS) {
      consistencyResponse = {
        status: GlobalEnums.ConsistencyStatus.WARNING,
        message:
          GlobalEnums.ConsistencyResponseEnum.NOCONTENTCONSOLIDATIONSTATUS,
      };
    }
    return consistencyResponse;
  }

  /*
   * @desc Check the correspondence of each Cross Reference from an Mapped Harness data
   * @param {IHarnessConsistency.IHarness} mappedHarness
   * @returns {IHarnessConsistency.IResponse} IHarnessConsistency.IResponse
   * @memberof HarnessConsistencyController
   */
  public checkHarnessExtremityCoordinate(
    mappedHarness: IHarnessConsistency.IHarness,
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ) {
    let crossRefList: IHarnessConsistency.IHarnessCrossRef[] =
      mappedHarness.crossRefList;
    crossRefList.forEach((crossRef) => {
      crossRefList.forEach((subArraycrossRef) => {
        if (subArraycrossRef.partZoneName.charAt(12) !== "X") {
          // We check if extremities has same name
          if (
            subArraycrossRef.partZoneName !== crossRef.partZoneName &&
            subArraycrossRef.branch3DExtremityName ===
              crossRef.branch3DExtremityName
          ) {
            // We check if extremity Coordinate are the same
            const euclideanDistance: number = Math.sqrt(
              (subArraycrossRef.branch3DExtremityCoordinate
                .electricalCoordinateX -
                crossRef.branch3DExtremityCoordinate.electricalCoordinateX) **
                2 +
                (subArraycrossRef.branch3DExtremityCoordinate
                  .electricalCoordinateY -
                  crossRef.branch3DExtremityCoordinate.electricalCoordinateY) **
                  2 +
                (subArraycrossRef.branch3DExtremityCoordinate
                  .electricalCoordinateZ -
                  crossRef.branch3DExtremityCoordinate.electricalCoordinateZ) **
                  2
            );
            if (euclideanDistance < 1000) {
              // The extremities Coordinate are the same (with tolerance)
              // crossRefMatchedList.push([crossRef, subArraycrossRef]);
              if (euclideanDistance >= 4) {
                consolidationMsg.warning.push(
                  "Geometrical Match Warning: CrossRef " +
                    crossRef.branch3DExtremityName +
                    " from Partzones " +
                    crossRef.partZoneName +
                    " and " +
                    subArraycrossRef.partZoneName
                );
              }
            } else {
              consolidationMsg.error.push(
                "Geometrical Match Error: CrossRef " +
                  crossRef.branch3DExtremityName +
                  " from Partzones " +
                  crossRef.partZoneName +
                  " and " +
                  subArraycrossRef.partZoneName
              );
            }
            // ... so we delete this element from the crossRefList
            crossRefList = crossRefList.filter(
              (el) =>
                el.branch3DExtremityName !==
                subArraycrossRef.branch3DExtremityName
            );
          }
        }
      });
    });

    this.raiseCrossRefError(crossRefList, consolidationMsg);
  }

  /**
   * If crossRefList not empty that means there are some alone cross ref
   */
  public raiseCrossRefError(
    crossRefList: IHarnessConsistency.IHarnessCrossRef[],
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ) {
    if (crossRefList.length) {
      const regexCrossRefDynamic = new RegExp("[A-Z]{2}");
      const regexPz = new RegExp("[A-Z]");

      for (const crossRef of crossRefList) {
        if (crossRef.partZoneName.charAt(12) !== "X") {
          // Check if CrossRef is related to a "Dynamic Part Zone"
          const isDynamic = regexCrossRefDynamic.test(
            crossRef.branch3DExtremityName
          );
          const isDynamicLinkedToDynamicPz = regexPz.test(
            crossRef.branch3DExtremityName.charAt(4)
          );
          const temp = isDynamic ? this.warning : this.error;
          if (
            temp.findIndex((value) => {
              return (
                value.branch3DExtremityName == crossRef.branch3DExtremityName &&
                value.partZoneName == crossRef.partZoneName
              );
            }) == -1
          ) {
            // check to avoid fake cross ref errors and warnings
            if (
              crossRef.branch3DExtremityName.substring(1, 3) !==
              crossRef.branch3DExtremityName.substring(3, 5)
            ) {
              const crossRefObj = {
                partZoneName: crossRef.partZoneName,
                branch3DExtremityName: crossRef.branch3DExtremityName,
              };
              this.catagoriseError(
                isDynamic,
                regexPz,
                crossRef,
                isDynamicLinkedToDynamicPz,
                crossRefObj
              );
            }
          }
        }
      }
      this.consolidationMessageUpdate(consolidationMsg);
    }
  }

  /**
   * when a dynamic xref is set on a dynamic partzone and is not linked to a static partzone show error
   * @param isDynamic
   * @param regexPz
   * @param crossRef
   * @param isDynamicLinkedToDynamicPz
   * @param crossRefObj
   */
  private catagoriseError(
    isDynamic: boolean,
    regexPz: RegExp,
    crossRef: IHarnessConsistency.IHarnessCrossRef,
    isDynamicLinkedToDynamicPz: boolean,
    crossRefObj: { partZoneName: string; branch3DExtremityName: string }
  ) {
    if (isDynamic) {
      if (
        regexPz.test(crossRef.partZoneName.charAt(13)) &&
        !isDynamicLinkedToDynamicPz
      ) {
        this.error.push(crossRefObj);
      } else {
        this.warning.push(crossRefObj);
      }
    } else {
      // S-507437 - Consolidation status issue with PZ Kx in 920
      const dsCode = crossRefObj.partZoneName.substring(1, 4);
      if (
        dsCode == "920" &&
        (crossRefObj.branch3DExtremityName.charAt(1) == "K" ||
          crossRefObj.branch3DExtremityName.charAt(3) == "K")
      ) {
        this.noError.push(crossRefObj);
      } else {
        this.error.push(crossRefObj);
      }
    }
  }

  public consolidationMessageUpdate(
    consolidationMsg: IHarnessConsistency.IconsolidationMsg
  ) {
    consolidationMsg.warning.push(
      ...this.warning.map(
        (e) =>
          "Dynamic Partzone Warning : CrossRef " +
          e.branch3DExtremityName +
          " from Partzones " +
          e.partZoneName
      )
    );
    consolidationMsg.error.push(
      ...this.error.map(
        (e) =>
          "CrossRef unlinked : " +
          e.branch3DExtremityName +
          " from Partzone " +
          e.partZoneName
      )
    );
    consolidationMsg.noError.push(
      ...this.noError.map(
        (e) =>
          "CrossRef : " +
          e.branch3DExtremityName +
          " from Partzone " +
          e.partZoneName
      )
    );
  }
}
