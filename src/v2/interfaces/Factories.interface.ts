import { Model } from "sequelize-typescript";
import { IDataCreate } from "../interfaces/Queries.interface";

export interface ModelFactory {
  create<T extends Model<T>>(
    data: IDataCreate,
    parent?: T,
    extraField?: any
  ): Promise<any>;
  clean?(): Promise<any>;
}

export interface IFinDsWhereClause {
  sequenceNumber: string;
  circuit: string;
  suffix?: string;
  appendedLetter?: string;
}

export interface IFinDsInstance {
  idFin: number;
  related?: number;
}

export interface IComponentInstance {
  componentNaming: string;
  partNumber: string;
}

export interface IBranch3DExtremityInstance {
  idB3DExt: number;
  related?: number;
}

// export interface InstancesDictionary<T extends ModelController> {
//     [key: string]: InstancesDictionary2<T>;

// }

// interface InstancesDictionary2<T extends ModelController>  {
//     [key: string]: T;
// }
