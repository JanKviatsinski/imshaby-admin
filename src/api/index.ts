import {IMassCreate, IParish, IPeriod, IScheduleResponse, IWeekSchedule} from "./interfeces";
import parse from "date-fns/parse";

const BASE_URL = process.env.REACT_APP_API_URL;
const DATE_MASK = 'dd-MM-yyyy HH:mm:ss';

export const getParishById = async (token: string, id: string): Promise<IParish> => {
  const parish = await request(BASE_URL + 'parish/' + id, token);
  parish.lastMassActualDate = parse(parish.lastMassActualDate, DATE_MASK, new Date());
  parish.lastModifiedDate = parse(parish.lastModifiedDate, DATE_MASK, new Date());
  return Promise.resolve(parish)
};

export const getWeekSchedule = async (token: string, id: string, date: string): Promise<IWeekSchedule> => {
  let weekSchedule = await request(BASE_URL + 'mass/week?' + `parishId=${id}&date=${date}`, token);
  weekSchedule.startWeekDate = parse(weekSchedule.startWeekDate, 'MM/dd/yyyy', new Date())
  weekSchedule.schedule = weekSchedule.schedule?.map((i: IScheduleResponse) =>
    ({...i, date: parse(i.date, 'MM/dd/yyyy', new Date())})
  )
  return Promise.resolve(weekSchedule);
};

export const createMass = async (token: string, data: IMassCreate) => {
  const mass = await request(BASE_URL + 'mass', token,'POST', data);
  return Promise.resolve(mass);

};

export const deleteMass = async (token: string, id: string, period: IPeriod) => {
  const url = new URLSearchParams();
  if (period?.from){
    url.append('from', period.from)
  }
  if (period?.to){
    url.append('to', period.to)
  }
  return await request(BASE_URL + `mass/${id}?` + url, token,'DELETE')
};

export const approveSchedule = async (token: string, parishId: string): Promise<any> => {
  return await request(BASE_URL + `mass?parishId=${parishId}`, token,'PUT')
};

export const getMassById = async (token: string, massId: string): Promise<any> => {
  return await request(BASE_URL + `mass/${massId}`, token,'GET')
};

export const updateParishInfo = async (token: string, parishId: string, data: IParish): Promise<IParish> => {
  return await request(BASE_URL + `parish/${parishId}`, token,'PUT', data)
};


const request = (url: string, token: string, method?: string, data?: any) => {
  return fetch(url, {
    method: method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => handleError(res))
    .then(res => res.json())
    .catch(err => console.error(err))
};

const handleError = (res: any) => {
  if(!res.ok) throw new Error(res.statusText)
  return res
}
