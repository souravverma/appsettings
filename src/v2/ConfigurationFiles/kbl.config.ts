import { IconfigFile } from "../interfaces/Processing.interface";
import Harness3dDesignSolutionModel from "../models/Harness3dDesignSolution.model";

export const KblConfig: IconfigFile = {
  name: "kbl configuration file",
  fileFormat: "kbl",
  unicities: [
    {
      name: "harness3dDesignSolution",
      fields: ["caccDsNumber", "caccDsSolution"],
    },
  ],
};
