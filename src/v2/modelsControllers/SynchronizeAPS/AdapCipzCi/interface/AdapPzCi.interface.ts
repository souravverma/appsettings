export interface IAdapCi {
  id: string;
  type?: string;
  subType?: string;
  vu_vb_code?: string;
  ciConfigSet?: string;
  ataSubAta?: string;
  pz_ci?: IPartzoneCi[];
}

export interface IPartzoneCi {
  pz_ci_id: string;
  owner?: string;
  zone?: string;
}
