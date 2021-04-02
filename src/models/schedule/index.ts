import { createEffect, createEvent, createStore } from 'effector';
import { api } from '../app';
import parse from 'date-fns/parse';
import { IWeekSchedule } from './types';
import { IScheduleResponse } from '../../api/interfeces';
import format from 'date-fns/format';

export const $schedule = createStore<IWeekSchedule | null>(null);
export const $scheduleDate = createStore<Date>(new Date());

export const updateScheduleDate = createEvent<Date>();

export const fetchWeekSchedule = createEvent();
export const fetchWeekScheduleFx = createEffect( async (params: { parish_id: string, date: Date }) => {
  const date = format(params.date, 'dd-MM-yyyy');

  const res = await api?.get(`mass/week?parishId=${params.parish_id}&date=${date}`);

  if (!res?.data) return new Error('Week schedule not found');

  const weekSchedule = { ...res.data };
  weekSchedule.startWeekDate = parse(weekSchedule.startWeekDate, 'MM/dd/yyyy', new Date());
  weekSchedule.schedule = weekSchedule.schedule?.map((i: IScheduleResponse) =>
    ({ ...i, date: parse(i.date, 'MM/dd/yyyy', new Date()) }),
  );
  return weekSchedule;
});


export const approveSchedule = createEvent();
export const approveScheduleFx = createEffect(async (parish_id: string ) => {
  const res = await api?.put(`mass?parishId=${parish_id}`, {});

  if (!res?.data) return new Error('Approve schedule has been failed');

  return res.data;
})
