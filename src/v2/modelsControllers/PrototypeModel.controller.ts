import { Model } from "sequelize-typescript";
import {
  IUnicityRule,
  IWhereClauseParent,
} from "../interfaces/Processing.interface";
import sequelize from "sequelize";
import { logger } from "lib-central-logger";

export default abstract class PrototypeModelController {
  protected model: any;
  protected parent: any;
  protected whereClauseUnicity: IUnicityRule[];
  protected whereClause: IWhereClauseParent;
  protected collection: Model<any>[] = [];
  protected logger = logger;

  constructor(whereClauseUnicity?: IUnicityRule[]) {
    this.whereClauseUnicity = whereClauseUnicity;
  }

  public isObjectIncluded(obj1: any, obj2: any): boolean {
    // Loop through properties in object 1
    for (const p in obj1) {
      if (p === "refParent") {
        continue;
      }
      if (!obj2.dataValues.hasOwnProperty(p)) {
        return false;
      }
      if ((obj2.dataValues[p] || obj1[p]) && obj1[p] != obj2.dataValues[p]) {
        return false;
      }
    }
    return true;
  }

  protected findParent<T extends Model<T>>(
    data: sequelize.WhereOptions<any>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.parent
        .findOne({
          where: data,
        })
        .then((result: T) => resolve(result))
        .catch((err: Error) => reject(err));
    });
  }

  protected attach(
    child: Model<any>,
    childName: string,
    parent: Model<any>,
    extra?: any,
    doublon?: boolean
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (parent && (!(await parent.$has(childName, child)) || doublon)) {
        parent
          .$add(childName, child, { through: extra })
          .then(async () => {
            await child.reload(); // Here reload is needed to refresh the instance with the updated foreign key
            resolve();
          })
          .catch((err: Error) => reject(err));
      } else {
        resolve();
      }
    });
  }

  protected ObjectIncluded(obj1: any, obj2: any): boolean {
    // Loop through properties in object 1
    for (const p in obj1) {
      if (p === "refParent") {
        continue;
      }
      if (!obj2.dataValues.hasOwnProperty(p)) {
        return false;
      }
      if (obj1[p] != obj2.dataValues[p]) {
        return false;
      }
    }
    return true;
  }

  protected addToCollection(obj1: Model<any>) {
    if (!this.collection.some((v) => v.id === obj1.id))
      this.collection.push(obj1);
  }
  // this is to update collection if Modified version since addToCollection does not detect any changes if modified
  protected updateCollection(obj1: Model<any>) {
    this.collection = this.collection.filter((v) => v.id !== obj1.id);
    this.collection.push(obj1);
  }

  /**
   * Search in provided collection
   * @param data
   * @param collection
   * @returns
   */
  public findWithCollection<T extends Model<T>>(
    data: sequelize.WhereOptions<any>,
    collection: Model<any>[]
  ): T {
    if (collection.length) {
      return <T>collection.find((value) => {
        return this.ObjectIncluded(data, value);
      });
    } else {
      return;
    }
  }

  public find<T extends Model<T>>(data: sequelize.WhereOptions<any>): T {
    if (this.collection.length) {
      return <T>this.collection.find((value) => {
        return this.ObjectIncluded(data, value);
      });
    } else {
      return;
    }
  }

  // instead of findOne , this function will filter out a list of array for the specific model matching case
  public filter<T extends Model<T>>(data: sequelize.WhereOptions<any>): T[] {
    if (this.collection.length) {
      return <T[]>this.collection.filter((value) => {
        return this.ObjectIncluded(data, value);
      });
    } else {
      return;
    }
  }

  // FAST ADD : Some job as find (line 64) but in promise
  public findInCollection<T extends Model<T>>(
    data: sequelize.WhereOptions<any>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.collection.length) {
        const found = <T>this.collection.find((value) => {
          return this.ObjectIncluded(data, value);
        });
        resolve(found);
      } else {
        reject("Not find in collection");
      }
    });
  }
}
