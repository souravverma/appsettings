export interface IFileGenerator {
  generateDecFile(): Promise<string>;
  generateLonFile(): Promise<string>;
}

export interface IDecFile {
  CCTE?: string; // 4 - 20DE
  CAT?: string; // 1 - B
  RRPEI?: string; // 15 - FIN   FinDsModel
  LRO?: string; // 5 - Route   FinDsModel
  RRABR?: string; // 15 - Drawing Root FinDsModel
  RENCS?: string; // 15 - DA   HArnessManufacturing
  CSTBD?: string; // 1 - Priority  FinDsModel
  RSEDE?: string; // 15 - SubAssembly DA   HarnessManufacturingSubAssembly
  CLM?: string; // 1 - Restriction type    HarnessManufacturing
  CSGVSA?: string; // 5 - Code version ('com') HarnessManufacturing
  NRGD?: string; // 5 - from   HarnessManufacturing
  NRGDFN?: string; // 5 - to   HarnessManufacturing
  CLS?: string; // 1 - D
  PINRO?: string; // 6 - Entrer point on route (from : Z1740 to : Z8999)
  QLOCB?: string; // 5 - Length cable (priority forced length) Branch3D
  CAK?: string; // 3 - code accident - empty
  RRFXX2?: string; // 15 - fonctional repere code - empty
  CTF?: string; // 2 - fabrication type - N
  filler1?: string;
  filler2?: string;
  filler3?: string;
  filler4?: string;
  filler5?: string;
  filler6?: string;
  filler7?: string;
}

export interface IValidity {
  type: string;
  code: string;
  from: string;
  to: string;
}

export interface ILonFile {
  CCTE?: string; // 4
  CAT?: string; // 4
  filler1?: string; // 4
  PDELO?: string; // 4
  LRO?: string; // 4
  PARLO?: string; // 4
  filler2?: string; // 6
  RENCS?: string; // 4
  filler3?: string; // 6
  NPC?: string; // 4
  CLM?: string; // 4
  CSGVSA?: string; // 4
  NRGDE?: string; // 4
  NRGFN?: string; // 4
  filler4?: string; // 5
  QLOCB?: string; // 4
  filler5: string; // 1
  CAK?: string; // 4
  CTF?: string; // 4
}
