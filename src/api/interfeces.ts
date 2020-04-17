export interface IParish {
  imgPath: string;
  userId: null;
  name: string;
  address: string;
  gps: null;
  updatePeriodInDays: number;
  localizedInfo: {
    ru: ILocalization;
    en: ILocalization;
    pl: ILocalization;
  },
  needUpdate: boolean;
  lastModifiedDate: string;
  lastMassActualDate: string;
  cityId: string;
  phone: null;
  supportPhone: string;
  email: string;
  lastModifiedEmail: null;
  website: string;
  _links: {
    self: {
      href: string;
    }
  }
}

interface ILocalization {
  name: string;
  address: string;
}


export interface IWeekSchedule {
  startWeekDate: string;
  schedule: ISchedule[];
}

export interface ISchedule {
  date: Date;
  massHours: IMassHours[];
}

export interface IMassHours {
  hour: string;
  data: IMassHoursData[];
}
export interface IMassHoursData {
  days: number[];
  startDate: string | null;
  endDate: string | null;
  duration: number;
  info: string;
  langCode: string;
  lastModifiedDate: string;
  needUpdate: boolean;
  parish: {
    address: string;
    gps: null;
    imgPath: string;
    name: string;
    needUpdate: boolean;
    parishId: string;
  }
}

export interface IMassCreate {
  id?: string;
  cityId: string;
  langCode: string;
  time: string;
  days: number[] | null;
  notes: string;
  localizedInfo: {
    ru: ILocalization;
    en: ILocalization;
    pl: ILocalization;
  },
  parishId: string;
  startDate: string;
  endDate: string;
  singleStartTimestamp?: number;
}
