import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import PartZoneModel from "../../models/Partzone.model";
import UserAreaModel from "../../models/UserAreaPartZone.model";
import regexJson from "../../ConfigurationFiles/Regex.json";
const { Op } = require("sequelize");

export default class ManagePartZoneAssignment {
  public async managePartZoneAssignment(
    newPartzone: PartZoneModel,
    harnessParent: Harness3dDesignSolutionModel
  ): Promise<any> {
    const userArea: UserAreaModel = <UserAreaModel>(
      await newPartzone.$get("userArea")
    );
    if (!userArea)
      throw new Error(
        "User area property is missing for partzone " + newPartzone.id + "."
      );

    let harnessRelated: Harness3dDesignSolutionModel[];
    if (harnessParent) harnessRelated = [harnessParent];
    else
      harnessRelated = <Harness3dDesignSolutionModel[]>(
        await newPartzone.$get("harness3d")
      );

    if (!harnessRelated.length) {
      let harnessRoot;
      Object.values(regexJson.DESIGN_NUMBER).forEach((expression) => {
        const regex = new RegExp(expression).exec(newPartzone.name);
        if (regex) harnessRoot = regex[0];
      });
      harnessRelated = await Harness3dDesignSolutionModel.findAll({
        where: {
          adapDesignSolutionNumber: harnessRoot,
          dataStatus: { [Op.not]: "frozen" },
        },
      });
    }
    await Promise.all(
      harnessRelated.map(async (harness) => {
        if (harness.dataStatus !== "frozen") {
          try {
            const linkedPartzone: PartZoneModel[] = <PartZoneModel[]>(
              await harness.$get("partZone", {
                where: { fk_user_area_id: userArea.id },
              })
            );
            if (
              linkedPartzone.length &&
              linkedPartzone[0].id !== newPartzone.id
            ) {
              /* If the uploaded Partzone_user_area is assigned to another partzone to the harness, we replace the existing partzone with the new one. */
              await harness.$remove("partZone", linkedPartzone[0]);
              await harness.$add("partZone", newPartzone);
            } else {
              /* If the harness hasn't partzone for the user area yet, we assign it the new partzone */
              await harness.$add("partZone", newPartzone);
            }
            await harness.reload();
          } catch (err) {
            Promise.reject(err);
          }
        } else {
          await harness.$add("partZone", newPartzone);
        }
      })
    );
  }
}
