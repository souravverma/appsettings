export type TTablesName =
  | "backshell3dSolution"
  | "branch3d"
  | "branch3dExtremityCoveringElementRelation"
  | "branch3dExtremityRelation"
  | "branch3dExtremitySolution"
  | "branch3dSegment"
  | "branchManufExtremity"
  | "branchPointDefinition"
  | "coveringElement3d"
  | "deliverableAssemblySolution"
  | "fin3dEffectiveRoutesRelation"
  | "functionalItem3dSolution"
  | "harness3dDesignSolution"
  | "harness3dDsPzRelation"
  | "harnessManufacturingSubAssembly"
  | "mechanicalBackshellComponent"
  | "mechanicalCoveringElementComponent"
  | "partZone"
  | "routeBranch3dRelation"
  | "validityDaSolutionRelation"
  | "majorComponentAssembly"
  | "aircraftProgram"
  | "circuit"
  | "component"
  | "deliverableAssembly"
  | "functionalItem"
  | "routeCategory"
  | "validity";
export interface IReferenceParent {
  ref: TTablesName;
  whereClause: IWhereClause | IWhereClause[];
}

export interface IWhereClause {
  [k: string]: string | IWhereClauseExtra;
  extra?: IWhereClauseExtra;
}

export interface IWhereClauseExtra {
  [t: string]: string | string[] | number | boolean;
}
export interface IBackshell3dSolution {
  backshellOrientation?: string;
  backshellOrientationReference?: string;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  type?: string;
  partNumber3d?: string;
  refParent: IReferenceParent[];
}

export interface IBranch3d {
  name?: string;
  diameter3dMm?: number;
  bendRadius?: number;
  lengthMm?: number;
  lengthForcedMm?: number;
  extraLengthMm?: number;
  admissibleRoutes?: string;
  effectiveRoutes?: string | string[];
  notExtractible?: string;
  segment: string[];
  environmentType?: string[];
  branch3dPointDefinition?: IBranch3dPointDefinition[];
  refParent: IReferenceParent;
}

export interface IadapDsVersionIssue {
  adapDesignSolutionNumber?: string;
  adapDesignSolutionIssueNumber?: string;
  adapDesignSolutionVersionNumber?: string;
  dataStatus?: string;
  ChangePsSynchroStatus?: string;
}

export interface IBranch3dExtremityCoveringElementRelation {
  lengthMm?: number;
}

export interface IBranch3dExtremityFinDsRelation {}

export interface IBranch3dExtremityRelation {
  vectorX?: number;
  vectorY?: number;
  vectorZ?: number;
  name?: string;
}

export interface IBranch3dExtremitySolution {
  name?: string;
  electricalCoordinateX?: number;
  electricalCoordinateY?: number;
  electricalCoordinateZ?: number;
  type?: string;
  refParent: IReferenceParent;
}

export interface IBranch3dSegment {
  name?: string;
}

export interface IBranchManufExtremity {
  name?: string;
  usableFor?: string;
}

export interface IBranch3dPointDefinition {
  coordinateX?: number;
  coordinateY?: number;
  coordinateZ?: number;
  vectorX?: number;
  vectorY?: number;
  vectorZ?: number;
  middle?: boolean;
  pbranch3d?: number;
  b3d?: number;
}

export interface ICoveringElement3d {
  name: string;
  type: string;
  printedLabel1: string;
  printedLabel2: string;
  printedLabel3: string;
  lengthMm?: number;
  diameterMm?: number;
  refParent: IReferenceParent[];
}

export interface IDeliverableAssemblySolution {
  deliverableAssemblySolution?: string;
  status?: string;
}

export interface IFin3dEffectiveRoutesRelation {}

export interface IFunctionalItem3dSolution {
  solutionNumber?: string;
  partNumber3d?: string;
  instanceName3d?: string;
  definitionZone?: string;
  panel?: string;
  longPartNumber?: string;
  mountingPriority?: string;
  masterSourceId?: string;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  refParent: IReferenceParent[];
}

export interface IHarness3dDesignSolution {
  adapDesignSolutionNumber?: string;
  adapDesignSolutionVersionNumber?: string;
  adapDesignSolutionIssueNumber?: string;
  harnessType?: string;
  oldAdapDsVersionNumber?: string;
  oldAdapDsIssueNumber?: string;
  harnessConsolidationStatus?: string;
  adapDsOwner?: string;
  modificationAdapDsDate?: Date;
  extractionOwner?: string;
  extractionDateFrom3d?: Date;
  storingOwnerInCoreElec?: string;
  storingDateInCoreElec?: Date;
  caccDsNumber?: string;
  caccDsSolution?: string;
  dataStatus?: string;
  dataType?: string;
  consolidationMsg?: string;
  fromPZM?: boolean;
  refParent: IReferenceParent;
  psSynchroStatus: string;
}

export interface IHarness3dDsPzRelation {}

export interface IHarnessManufacturingSubAssembly {
  name?: string;
}

export interface IMechanicalBackshellComponent {
  material?: string;
  emi?: string;
  backshellType?: string;
}

export interface IMechanicalCoveringElementComponent {
  bendRadiusMinD?: string;
  colour?: string;
  comment?: string;
  commentTresti?: string;
  diameterMaxMm?: number;
  diameterMaxMmTresti?: number;
  diameterMinMm?: number;
  diameterMinMmTresti?: number;
  environement?: string;
  lengthMm?: number;
  lengthMmTresti?: number;
  material?: string;
  order?: string;
  orderTresti?: string;
  sizeCode?: string;
  sizeCodeTresti?: string;
  sleeveFamily?: string;
  sleeveFamilyTresti?: string;
  temperatureMaxC?: number;
  temperatureMinC?: number;
  thicknessCoeffA?: string;
  thicknessCoeffATresti?: string;
  thicknessCoeffB?: string;
  thicknessCoeffBTresti?: string;
  weightG?: number;
  weightGMTresti?: number;
}

export interface IPartZone {
  name: string;
  partzoneVersion?: string;
  userArea: string;
  dataStatus?: string;
  dataType?: string;
  consolidationStatus?: string;
  consolidationMessage?: string;
  releaseStatus?: string;
  originId?: number;
  origin?: string;
  issue?: string;
  version?: string;
  upissue?: boolean;
  updated_at?: Date;
  pzStatus?: string;
}

export interface IRouteBranch3dRelation {}

export interface IValidityDaSolutionRelation {}

export interface IMajorComponentAssembly {
  name?: string;
}

export interface IAircraftProgram {
  familyName?: string;
  mainAircraftLetterCode?: string;
  taksyProjectKey?: string;
  taksyShortCode?: string;
}

export interface ICircuit {
  letters?: string;
  description?: string;
}

export interface IComponent {
  partNumber?: string;
  norm?: string;
}

export interface IDeliverableAssembly {
  number?: string;
  constituentAssemblyNumber?: string;
}

export interface IFunctionalItem {
  sequenceNumber?: string;
  circuit?: string;
  suffix?: string;
  appendedLetter?: string;
  supplementaryPart?: string;
  description?: string;
  newcircuit?: string;
  newsequenceNumber?: string;
  fromFinListModal?: boolean;
}

export interface IRouteCategory {
  name?: string;
  essential?: string;
  system?: string;
  systemDescription?: string;
  categoryCode?: string;
  categoryDescription?: string;
  remarks?: string;
}

export interface IValidity {
  code?: string;
  rankNumberFrom?: string;
  rankNumberTo?: string;
}

export interface IDomain {
  name: string;
  code: string;
}

export interface IMappedData {
  domain?: IDomain;
  backshell3dSolution?: IBackshell3dSolution[];
  branch3d?: IBranch3d[];
  branch3dExtremityCoveringElementRelation?: IBranch3dExtremityCoveringElementRelation;
  branch3dExtremityRelation?: IBranch3dExtremityRelation[];
  branch3dExtremitySolution?: IBranch3dExtremitySolution[];
  branch3dSegment?: IBranch3dSegment[];
  branchManufExtremity?: IBranchManufExtremity[];
  coveringElement3d?: ICoveringElement3d[];
  deliverableAssemblySolution?: IDeliverableAssemblySolution[];
  fin3dEffectiveRoutesRelation?: IFin3dEffectiveRoutesRelation[];
  functionalItem3dSolution?: IFunctionalItem3dSolution[];
  harness3dDesignSolution?: IHarness3dDesignSolution;
  harness3dDsPzRelation?: IHarness3dDsPzRelation;
  harnessManufacturingSubAssembly?: IHarnessManufacturingSubAssembly[];
  mechanicalBackshellComponent?: IMechanicalBackshellComponent[];
  mechanicalCoveringElementComponent?: IMechanicalCoveringElementComponent[];
  partZone?: IPartZone[];
  routeBranch3dRelation?: IRouteBranch3dRelation[];
  validityDaSolutionRelation?: IValidityDaSolutionRelation[];
  majorComponentAssembly?: IMajorComponentAssembly;
  aircraftProgram?: IAircraftProgram;
  circuit?: ICircuit[];
  component?: IComponent[];
  deliverableAssembly?: IDeliverableAssembly[];
  functionalItem?: IFunctionalItem[];
  routeCategory?: IRouteCategory[];
  validity?: IValidity[];
}

export interface IPartZoneManagerData {
  harness3dDesignSolution: IHarness3dDesignSolution;
  partZone: IPartZone[];
  functionalItem: IFunctionalItem;
  majorComponentAssembly?: IMajorComponentAssembly;
  aircraftProgram?: IAircraftProgram;
}

export interface IErrorValidationContainer {
  title: string;
  content?: Array<IErrorValidation>;
}

export interface IErrorValidation {
  impact: "warning" | "error" | "succees";
  message?: string | Array<string>;
}
