import { IPartZoneManagerData } from "../../interfaces/mapping.interface";
import { IMappedData } from "../../interfaces/mapping.interface";
import { IconfigFile } from "../../interfaces/Processing.interface";

export const createComponents = (
  mappedData?: IMappedData | IPartZoneManagerData,
  configFile?: IconfigFile,
  partZoneDeletionList?: string[]
): Promise<any> => {
  return null;
};
