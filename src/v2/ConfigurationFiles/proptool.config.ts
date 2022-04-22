import { IconfigFile } from "../interfaces/Processing.interface";

export const ProptoolConfig: IconfigFile = {
  name: "Proptool config file",
  fileFormat: "proptool",
  unicities: [
    {
      name: "harness3dDesignSolution",
      fields: [
        "adapDesignSolutionNumber",
        "adapDesignSolutionVersionNumber",
        "adapDesignSolutionIssueNumber",
      ], // , 'caccDsNumber', 'caccDsSolution'
    },
    {
      name: "partZone",
      fields: ["name", "version"],
    },
  ],
};

// const test: IMappingstructure = {
//     data: {
//         HarnessVb: {
//             truc: 'machin',
//             bidule: 'truc'
//         },
//         Bidule: {
//             truc: 'okok',
//             machin: 'polala'
//         }, machin: {
//         }
//     },
// relations: [{model: 'bidule', whereClause: {truc: 'machin'}}]
// };
