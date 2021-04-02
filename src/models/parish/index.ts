import { createStore, createEffect, createEvent } from 'effector';
import { createGate } from 'effector-react';
import { api } from '../app';
import { Parish } from './types';
import parse from 'date-fns/parse';

const DATE_MASK = 'dd-MM-yyyy HH:mm:ss';

export const ParishGate = createGate();

export const $parish = createStore<Parish | null>(null);

export const updateParish = createEvent<Parish>()

export const fetchParishFx = createEffect(async (parish_id: string) => {
  const res = await api?.get(`/parish/${parish_id}`);

  if (!res?.data) return new Error('Parish not found');

  const parish = { ...res.data };
  parish.lastMassActualDate = parse(parish.lastMassActualDate, DATE_MASK, new Date());
  parish.lastModifiedDate = parse(parish.lastModifiedDate, DATE_MASK, new Date());

  return parish
});

export const updateParishFx = createEffect(async (params: { parish_id: string, parish: Parish}) => {
  const { parish, parish_id } = params;
  const res = await api?.put(`/parish/${parish_id}`, parish);

  if (!res?.data) return new Error('Parish not updated');

  // const parish = { ...res.data };
  // parish.lastMassActualDate = parse(parish.lastMassActualDate, DATE_MASK, new Date());
  // parish.lastModifiedDate = parse(parish.lastModifiedDate, DATE_MASK, new Date());

  return res.data
});