import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import PartZoneHelper from "./PartzoneHelper.controller";
import { container, injectable } from "tsyringe";

@injectable()
export default class PartZoneRelatedHarness {
  private partZoneRelatedHarness: Harness3dDesignSolutionModel[] = [];
  private helper: PartZoneHelper;

  constructor(partZoneHelper: PartZoneHelper) {
    this.helper = partZoneHelper;
  }

  /**
   * Get all related harness for a specific Partzone ->
   * Include : find automaticaly related harness from the pz name, check UserArea unicity
   * @param {string} partZoneName
   * @param {string} userArea
   * @returns {Promise<Harness3dDesignSolutionModel[]>}
   * @memberof PartZoneRelatedHarness
   */

  async getPartzoneRelatedToHarness(
    partZoneName: string,
    userArea: string,
    version?: string
  ): Promise<Harness3dDesignSolutionModel[]> {
    const params: any = this.helper.createWhereCondition(version, partZoneName);
    try {
      const allHarness = await this.helper.getAllHarnessesForPartZone(params);
      if (allHarness.length) {
        this.partZoneRelatedHarness = [...allHarness];

        const pzNameUA = partZoneName.slice(-2);
        if (pzNameUA !== userArea) {
          throw new Error(
            `Wrong User Area (${userArea}) inside the proptool file.`
          );
        }
      } else {
        const foundeHarnessName =
          this.helper.createDsNameFromPartZoneName(partZoneName);

        if (foundeHarnessName) {
          let existingHarness = await this.helper.checkHarnessForPartzoneExists(
            foundeHarnessName
          );
          if (!existingHarness) {
            existingHarness = await this.helper.checkHarnessForPartzoneExists(
              foundeHarnessName.substring(0, 12)
            );
          }

          if (existingHarness) {
            // As per ID52 user story we are blocking smart upload for all DS
            if (existingHarness.adapDesignSolutionNumber.length) {
              throw new Error(
                `The Partzone ${partZoneName} does not exist for this ADAP DS harness ${existingHarness.adapDesignSolutionNumber}. Please create this PartZone in PZM.`
              );
            }

            // If specific Harness that mean DS already exists
            // CHECK: If the User Area of this new Partzone not already exists (must be unique by Harness)
            if (
              existingHarness.partZone.some((pz) => {
                return pz.userArea.name === userArea;
              })
            ) {
              throw new Error(
                `The harness n°${existingHarness.adapDesignSolutionNumber} already has User Aera ${userArea} !`
              );
            } else {
              // We Have passed all check... we can resolve Now
              this.partZoneRelatedHarness = [existingHarness];
            }
          } else {
            throw new Error(
              `The harness n°${foundeHarnessName} does not exist and must be created first !`
            );
          }
        }
      }
      return this.partZoneRelatedHarness;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param partZone
   * @returns
   */
  public async isPartZoneLinkedToOtherHarness(
    partZone: PartZoneModel
  ): Promise<boolean> {
    const harness: Harness3dDesignSolutionModel[] = <
      Harness3dDesignSolutionModel[]
    >await partZone.$get("harness3d");
    return harness.length > 0;
  }
}
