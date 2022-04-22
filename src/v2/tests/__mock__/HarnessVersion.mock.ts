import { IAdapDsCiLO } from "../../modelsControllers/SynchronizeAPS/AdapDsPzDs/interface/AdapDsPzDs.interface";

export const getNewDSVersion = (
  data: IAdapDsCiLO,
  userAreaNamefromAps: string[],
  newVersion = "001"
): any => {
  console.log("hello");
  return {
    newVersion: "001",
    flagCreateNewDS: false,
  };
};
