export interface HarnessVbInterface {
  adapDsNumber: string;
  adapDsIssueIndex: string;
  adapDsState: string;
  description?: string;
  majorComponentAssembly: string;
  masterSourceId: string;
  mSCreationDate: string;
  mSModifDate: string;
  mSUserModifId: string;
  mSUserCreationId: string;
  b3D: Branch3DInterface[];
}

export interface Branch3DInterface {
  branchId: string;
  lengthForced: string;
  length: string;
  extraLength: string;
  effectiveRoutes?: string;
  diameter3dMm?: string;
  bendradius?: string;
  partzoneNumber?: string;
  notExtractible: boolean;
  branch3DExtremities: Branch3DExtremityInterface[];
  branch3DExtremitiesRelation: Branch3DExtremityRelationInterface[];
}

export interface Branch3DExtremityRelationInterface {
  branch3DExtremityRelationId: string;
  vectorX: number;
  vectorY: number;
  vectorZ: number;
}

export interface Branch3DExtremityInterface {
  branchExtremityNaming: string;
  electricalCoordinateX: number;
  electricalCoordinateY: number;
  electricalCoordinateZ: number;
  type: string;
  finDs?: FinDsInterface;
}

export interface FinDsInterface {
  sequenceNumber: string;
  circuit: string;
  suffix?: string;
  appendedLetter?: string;

  aircraftProgram: string;
  domain: string;
  majorComponentAssembly: string;

  cDRoot?: string;
  effectiveRoutes?: string;

  finType: string;
  cMPT?: ComponentInterface;
  mPoint?: MorphoPointInterface;
  hVb?: HarnessVbInterface;
}

export interface MorphoPointInterface {
  positionX: number;
  positionY: number;
  positionZ: number;
  type: string;
}

export interface ComponentInterface {
  componentNaming: string;
  partNumber: string;
  componentType: string;
  masterSourceId: string;
  mSCreationDate: string;
  mSModifDate: string;
  mSUserModifId: string;
  mSUserCreationId: string;
}
