import { Model } from "sequelize/types";

export const attach = (
  child: Model<any>,
  childName: string,
  parent: Model<any>,
  extra?: any,
  doublon?: boolean
): Promise<any> => {
  return Promise.resolve();
};
