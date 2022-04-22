import jsonData from "../ConfigurationFiles/Regex.json";
import { IPartZoneManagerData } from "../interfaces/mapping.interface.js";

type aircraftProgramType = "A320" | "A330" | "A350" | "A380" | "A400M";
export default class ValidatorService {
  private partZoneNumbering = Object.entries(jsonData.PARZONE_DS_Numbering)[0];
  private designSolNumber = jsonData.DESIGN_NUMBER;
  private errors: Error[] = [];
  static instance: ValidatorService;

  private constructor() {}

  static getInstance() {
    if (ValidatorService.instance) return ValidatorService.instance;
    else {
      ValidatorService.instance = new ValidatorService();
      return ValidatorService.instance;
    }
  }

  validatePartZoneManagerData(data: IPartZoneManagerData) {
    this.errors = []; // reset the errors array
    this.adapDsNumber(data.harness3dDesignSolution.adapDesignSolutionNumber);
    this.sequenceNumber(data.functionalItem.sequenceNumber);
    this.circuit(data.functionalItem.circuit);
    data.partZone.forEach((pz) => {
      this.partZoneName(pz.name);
      this.userArea(pz.userArea);
    });
    return this.errors;
  }

  adapDsNumber(data: string): void {
    if (!data) {
      this.errors.push(new Error("AdapDsNumber is missing"));
      return;
    }

    if (
      !Object.values(this.designSolNumber).some((expression) => {
        return new RegExp(expression).test(data);
      })
    ) {
      this.errors.push(new Error("AdapDsNumber format error"));
    }
  }

  sequenceNumber(data: string): void {
    if (!data) {
      this.errors.push(new Error("sequenceNumber is missing"));
      return;
    }

    if (
      !new RegExp("^" + jsonData.FIN_FORMAT.sequenceNumber + "$").test(data)
    ) {
      this.errors.push(
        new Error("functional item :: sequenceNumber format error")
      );
    }
  }

  circuit(data: string): void {
    if (!data) {
      this.errors.push(new Error("circuit is missing"));
      return;
    }

    if (!new RegExp("^" + jsonData.FIN_FORMAT.circuit + "$").test(data)) {
      this.errors.push(new Error("functional item :: circuit format error"));
    }
  }

  partZoneName(data: string): void {
    if (!data) {
      this.errors.push(new Error("partzone name is missing"));
      return;
    }

    if (
      !Object.values(jsonData.PARZONE_DS_Numbering).some((aircraft) => {
        return Object.values(aircraft).some((expression) => {
          return new RegExp(expression).test(data);
        });
      })
    ) {
      this.errors.push(new Error("partZoneName format error"));
    }
  }

  userArea(data: string): void {
    if (!data) {
      this.errors.push(new Error("user area is missing"));
      return;
    }

    if (!new RegExp("^[A-Z][A-Z0-9]$").test(data)) {
      this.errors.push(new Error("user Area format error"));
    }
  }
}
