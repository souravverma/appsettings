export interface IAdapDsCiLO {
  id: string;
  type?: string;
  subType?: string;
  englishTitle?: string;
  domesticTitle?: string;
  issue: string;
  version: string;
  lastReleased?: boolean;
  lastIssue?: boolean;
  lastModifiedDate?: string;
  releaseStatus?: string;
  firstMsn: number;
  ciLo: ICiLO[];
  specifiedPzDs?: ISpecifiedPzDs[];
  implementedPzDs?: IImplementedPzDs[];
}

export interface ICiLO {
  adapCiId: string;
  adapLoId: string;
}

export interface ISpecifiedPzDs {
  id: string;
  pzCiId: string;
  lastModifiedDate?: string;
  issue: string;
  version: string;
  firstMsn?: number;
  pzOrigin?: pzOrigin[];
  deltaMp: IDeltaMp[];
  dataStatus?: string;
}

export interface IImplementedPzDs {
  id: string;
  pzCiId: string;
  lastModifiedDate?: string;
  issue: string;
  version: string;
  firstMsn?: number;
  pzOrigin?: pzOrigin[] | null;
  deltaMp: IDeltaMp[] | null;
}

export interface IDeltaMp {
  added?: Array<string>;
  removed?: Array<string>;
}

export interface pzOrigin {
  id: string;
  issue: string;
}
