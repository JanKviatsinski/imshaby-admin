import { $parish, fetchParishFx, ParishGate, updateParish, updateParishFx } from './index';
import { sample } from 'effector';
import { $auth } from '../auth';
import { approveScheduleFx } from '../schedule';


$parish
  .on(fetchParishFx.doneData, (_, parish) => parish);

sample({
  clock: [ParishGate.open, approveScheduleFx],
  source: $auth,
  fn: (params) => params.parish_id,
  target: fetchParishFx,
});


sample({
  clock: updateParish,
  source: {
    auth: $auth,
  },
  fn: (params, data) => ({ parish_id: params.auth.parish_id, parish: data }),
  target: updateParishFx
});