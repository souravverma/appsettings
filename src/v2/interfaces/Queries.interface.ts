export interface IWhereClause {
  limit?: number;
  offset?: number;
  [PropName: string]: string | number;
}

export interface IEnrichData {
  id: number;
}

export interface IDataCreate {
  [PropName: string]: any;
}
