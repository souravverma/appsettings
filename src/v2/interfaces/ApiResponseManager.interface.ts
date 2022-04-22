export interface IApiResponse {
  results?: IApiResponseResults[];
  context?: IApiResponseContext;
  links?: IApiResponseLinks;
  error?: IApiResponseError;
  status?: number;
}

export interface IApiResponseResults {
  [key: string]: any;
}

export interface IApiResponseLinks {
  self?: string;
  next?: string;
  previous?: string;
}

export interface IApiResponseError {
  name: string;
  message: string;
  hint?: string;
  code?: string;
  status?: number;
  parent?: any; // for SequelizeDatabaseError
}

// CONTEXT RESPONSE ******************************

export interface IApiResponseContext {
  client: IApiResponseContextClient;
  user: IApiResponseContextUser;
}

interface IApiResponseContextClient {
  id: number;
  workFlow: string;
  action: string;
}

interface IApiResponseContextUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: {
    type: string;
    description: string;
  };
}

export interface IApiResponseComparativeFin {
  id: number;
  name: string;
  partZoneVersion: string;
  userArea: string;
  VBs: string[];
  adapCi: string[];
  finMatched: string[];
  deltaP: string[];
  nbFinMatched: number;
  nbFinAsked: number;
  purcentageFinMatched: number;
  origin: string;
  date: Date;
  version: string;
  issue: Date;
}
