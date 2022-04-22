import PartZoneModel from "../../models/Partzone.model";
import Harness3dDesignSolutionModel from "../../models/Harness3dDesignSolution.model";
import * as FileStream from "fs";

export default class HarnessCSVForDownload {
  protected model: typeof Harness3dDesignSolutionModel =
    Harness3dDesignSolutionModel;
  constructor() {}

  /**
   * Create content for CSV download content
   * @param adapDsNumber
   * @param adapDsVersion
   */
  public async CSVforDesignSolution(
    adapDsNumber: any,
    adapDsVersion: any
  ): Promise<any> {
    const result: Harness3dDesignSolutionModel = await this.model.findOne({
      // attributes: ['id', 'adapDesignSolutionNumber'],
      include: [
        {
          model: PartZoneModel,
          include: [
            {
              model: PartZoneModel,
            },
          ],
        },
      ],
      where: {
        adapDesignSolutionNumber: adapDsNumber,
        adapDesignSolutionVersionNumber: adapDsVersion,
      },
    });

    const downloadContent: string = this.createDownloadContent(
      result,
      adapDsVersion
    );

    const downloadFolder: string = process.env.USERPROFILE + "/Downloads/";
    FileStream.writeFile(
      downloadFolder + adapDsNumber + "_" + adapDsVersion + ".csv",
      downloadContent,
      "utf-8",
      function (err: any) {
        if (err) {
          console.log("error");
          return "error";
        } else {
          console.log("success");
          return "success";
        }
      }
    );
  }

  /**
   * Create CSV content
   * @param result
   * @param adapDsVersion
   * @returns
   */
  private createDownloadContent(
    result: Harness3dDesignSolutionModel,
    adapDsVersion: any
  ): string {
    if (result) {
      let dsdata: string;
      let reusepz: string;
      let newpz: string;
      let madefrompz: string;
      let srcdataforreuse: string;
      let srcdataformadefrom: string;
      let srcesidesgin: string;
      let srcesimadedesgin: string;
      let countofmadefrom = 0;
      let countofpartzone = 0;
      if (adapDsVersion === null) {
        adapDsVersion = "---";
      }
      dsdata = "#USE_CASE;SOURCE_PS;TARGET_PS;MATRIX" + "\n";
      if (result.partZone.length) {
        result.partZone.forEach((partZone: any) => {
          if (partZone.version === null) {
            partZone.version = "---";
          }
          if (partZone.origin != null) {
            if (partZone.origin.version === null) {
              partZone.origin.version = "---";
            }
            if (partZone.name === partZone.origin.name) {
              countofpartzone += 1;
              srcesidesgin =
                partZone.name.substring(0, partZone.name.length - 2) + "00_001";
              srcdataforreuse =
                "A320DSGN_" +
                partZone.name.substring(0, partZone.name.length - 2) +
                "00_001" +
                "/A320DSGN_" +
                partZone.name +
                "_" +
                partZone.version;
              reusepz +=
                "PZ_REUSED;" +
                srcdataforreuse +
                ";A320DSGN_" +
                result.adapDesignSolutionNumber +
                "_" +
                adapDsVersion +
                "/A320DSGN_" +
                partZone.name +
                "_" +
                partZone.version +
                ";" +
                "\n";
            } else {
              countofmadefrom += 1;
              srcesimadedesgin =
                partZone.origin.name.substring(
                  0,
                  partZone.origin.name.length - 2
                ) + "00_001";
              srcdataformadefrom =
                "A320DSGN_" +
                partZone.origin.name.substring(
                  0,
                  partZone.origin.name.length - 2
                ) +
                "00_001" +
                "/A320DSGN_" +
                partZone.origin.name +
                "_" +
                partZone.origin.version;
              madefrompz +=
                "PZ_MADEFROM;" +
                srcdataformadefrom +
                ";A320DSGN_" +
                result.adapDesignSolutionNumber +
                "_" +
                adapDsVersion +
                "/A320DSGN_" +
                partZone.name +
                "_" +
                partZone.version +
                ";" +
                "\n";
            }
          } else {
            newpz +=
              "PZ_NEW;" +
              "A320DSGN_" +
              result.adapDesignSolutionNumber +
              "_" +
              adapDsVersion +
              "/A320DSGN_" +
              partZone.name +
              "_" +
              partZone.version +
              ";" +
              "\n";
          }
        });
      }
      if (countofpartzone >= countofmadefrom) {
        dsdata +=
          "ESI_DESIGN;A320DSGN_" +
          srcesidesgin +
          ";A320DSGN_" +
          result.adapDesignSolutionNumber +
          "_" +
          adapDsVersion +
          ";" +
          "\n";
      } else {
        dsdata +=
          "ESI_DESIGN;A320DSGN_" +
          srcesimadedesgin +
          ";A320DSGN_" +
          result.adapDesignSolutionNumber +
          "_" +
          adapDsVersion +
          ";" +
          "\n";
      }
      dsdata += reusepz;
      dsdata += madefrompz;
      dsdata += newpz;
      return dsdata;
    }
  }
}
