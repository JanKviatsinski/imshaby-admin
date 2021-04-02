export type IWeekSchedule = {
  startWeekDate: Date;
  schedule: ISchedule[];
}

export type ISchedule = {
  date: Date;
  massHours: IMassHours[];
}

export type IMassHours = {
  hour: string;
  data: IMassHoursData[];
}
export type IMassHoursData = {
  id: string;
  days: number[];
  startDate: string | null;
  endDate: string | null;
  duration: number;
  info: string;
  langCode: string;
  lastModifiedDate: string;
  needUpdate: boolean;
  online: boolean;
  parish: {
    address: string;
    gps: null;
    imgPath: string;
    name: string;
    needUpdate: boolean;
    parishId: string;
  }
}
