interface IManufucturingListFinDsVb {
  finDsVb: string;
  hVb?: IManufucturingListHarnessVb[];
}

interface IManufucturingListHarnessVb {
  harnessId: number;
  adapDsNumber: string;
  deliverableAssembly?: string;
  status: string;
  mSCreationDate: string;
  mSModifDate: string;
  availability: boolean;
}

interface IManufucturingDetail {
  hVb: IManufucturingHarnessVb;
  hManuf: IManufucturingHarnessManufacturing;
  subA: IManufucturingSubAssembly;
  finDsComponent: Array<IManufucturingFinDsComponent>;
}

interface IManufucturingHarnessVb {
  id: number;
  adapDsNumber: string;
  finDsVb: string;
  caccDsNumber: string;
  description: string;
}

interface IManufucturingHarnessManufacturing {
  deliverableAssembly: string;
  deliverableAssemblySolution: string;
  status: string;
  validity: string;
}

interface IManufucturingSubAssembly {
  name: string;
  deliverableAssembly: string;
  effectiveRoutes: string;
}

interface IManufucturingFinDsComponent {
  id: number;
  finDs: string;
  effectiveRoutes: string;
  cDRoot: string;
  subA: string;
  priority: number;
}
