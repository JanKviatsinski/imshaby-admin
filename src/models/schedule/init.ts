import {
  $schedule,
  $scheduleDate,
  approveSchedule,
  approveScheduleFx,
  fetchWeekSchedule,
  fetchWeekScheduleFx, updateScheduleDate,
} from './index';
import { sample, forward, createEffect } from 'effector';

import { $auth } from '../auth';
import { createMassFx, deleteMassFx, updateMassFx } from '../mass';

$schedule
  .on(fetchWeekScheduleFx.doneData, (_, schedule) => schedule);

$scheduleDate
  .on(updateScheduleDate, (state, payload) => payload);



sample({
  clock: [fetchWeekSchedule, updateMassFx.doneData, createMassFx.doneData, deleteMassFx.doneData],
  source: {
    auth: $auth,
    scheduleDate: $scheduleDate
  },
  fn: (params) => ({ parish_id: params.auth.parish_id, date: params.scheduleDate }),
  target: fetchWeekScheduleFx
});

sample({
  clock: approveSchedule,
  source: $auth,
  fn: (auth) => auth.parish_id,
  target: approveScheduleFx
});
