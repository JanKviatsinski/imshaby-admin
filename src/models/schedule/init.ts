import {
  $schedule,
  $scheduleDate,
  approveSchedule,
  approveScheduleFx,
  fetchWeekSchedule,
  fetchWeekScheduleFx, updateScheduleDate,
} from './index';
import { forward, sample } from 'effector';

import { $user } from '../auth';
import { createMassFx, deleteMassFx, updateMassFx } from '../mass';

$schedule
  .on(fetchWeekScheduleFx.doneData, (_, schedule) => schedule);

$scheduleDate
  .on(updateScheduleDate, (state, payload) => payload);



sample({
  clock: [fetchWeekSchedule, updateMassFx.doneData, createMassFx.doneData, deleteMassFx.doneData, approveScheduleFx.doneData],
  source: {
    user: $user,
    scheduleDate: $scheduleDate
  },
  fn: (params) => ({ parish_id: params.user.parish_id, date: params.scheduleDate }),
  target: fetchWeekScheduleFx
});

sample({
  clock: approveSchedule,
  source: $user,
  fn: (user) => user.parish_id,
  target: approveScheduleFx
});

