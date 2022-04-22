import { IadapDsVersionIssue } from "../interfaces/mapping.interface";

interface IHarnessInformation {
  adapDesignSolutionNumber?: string;
  adapDesignSolutionVersionNumber?: string;
  caccDsNumber?: string;
  caccDsSolution?: number;
}
interface IDictionnary extends IHarnessInformation {
  availability: boolean;
}

export default class HarnessDictionnaryService {
  public dictionnary: IDictionnary[];

  constructor() {
    this.dictionnary = [];
  }

  addEntry(adapDSData: IadapDsVersionIssue) {
    let entry;
    if (adapDSData.adapDesignSolutionVersionNumber === undefined) {
      entry = this.getEntry({
        adapDesignSolutionNumber: adapDSData.adapDesignSolutionNumber,
      });
    } else {
      entry = this.getEntry({
        adapDesignSolutionNumber: adapDSData.adapDesignSolutionNumber,
        adapDesignSolutionVersionNumber:
          adapDSData.adapDesignSolutionVersionNumber,
      });
    }
    if (!entry) {
      this.dictionnary.push({ ...adapDSData, availability: false });
    } else {
      entry.availability = false;
    }
  }

  finalizeEntry(info: IHarnessInformation) {
    const entry = this.getEntry(info);
    if (entry) {
      entry.availability = true;
    }
  }

  finalizeEntries() {
    const runningHarness = this.dictionnary.filter(
      (v) => v.availability === false
    );
    runningHarness.forEach((v) => (v.availability = true));
    return runningHarness;
  }

  getEntry(info: IHarnessInformation) {
    const entry = this.dictionnary.find((value: IDictionnary) => {
      let status = true;
      // Adding another condition to check if DS version exists
      if (status && info.adapDesignSolutionNumber) {
        if (value.adapDesignSolutionNumber === info.adapDesignSolutionNumber) {
          if (value.adapDesignSolutionVersionNumber === undefined) {
            status = true;
          } else {
            status = value.adapDesignSolutionVersionNumber
              ? value.adapDesignSolutionVersionNumber ===
                info.adapDesignSolutionVersionNumber
              : false;
          }
        } else {
          status = false;
        }
      }
      if (status && info.caccDsNumber)
        status = value.caccDsNumber
          ? value.caccDsNumber === info.caccDsNumber
          : false;
      if (status && info.caccDsSolution)
        status = value.caccDsSolution
          ? value.caccDsSolution === info.caccDsSolution
          : false;

      return status;
    });

    if (entry) {
      return entry;
    }
  }

  waitFinalization(info: IHarnessInformation, body: any, ProptoolConfig: any) {
    return new Promise((resolve, _) => {
      const entry = this.getEntry(info);
      if (!entry) {
        resolve([body, ProptoolConfig]);
      }

      if (!entry.availability) {
        setTimeout(() => {
          resolve(this.waitFinalization(info, body, ProptoolConfig));
        }, 3000);
      } else {
        resolve([body, ProptoolConfig]);
      }
    });
  }
}
