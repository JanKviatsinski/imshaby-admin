export type Mass = {
  id?: string;
  cityId?: string;
  langCode?: string;
  time?: string;
  days?: number[] | null;
  notes?: string;
  localizedInfo?: {
    ru: ILocalization;
    en: ILocalization;
    pl: ILocalization;
  },
  parishId?: string;
  startDate?: string;
  endDate?: string;
  singleStartTimestamp?: number;
  online?: boolean | null;
}


type ILocalization = {
  name: string;
  address: string;
}

export type Period = {
  from: string;
  to?: string;
}

export enum MassMode {
  EDIT,
  CREATE,
  HIDDEN,
}