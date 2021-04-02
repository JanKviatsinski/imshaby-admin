import {
  $mass, $massDeleted,
  $massMode,
  $massUpdated,
  changeMassMode,
  createMassFx, deleteMass, deleteMassFx, editMass,
  getMassFx,
  resetMass, resetMassDeleted,
  resetMassMode,
  resetMassUpdated,
  saveMass,
  updateMassFx,
  updateMassStore,
} from './index';
import { attach, forward, guard } from 'effector';
import { MassMode } from './types';
import { $auth } from '../auth';
import { $parish } from '../parish';

$mass
  .on(createMassFx.doneData, (state, payload) => payload)
  .on(getMassFx.doneData, (state, payload) => payload)
  .on(updateMassStore, (state, payload) => payload ? payload : state)
  .reset([resetMass])

$massMode
  .on(changeMassMode, (state, payload) => payload)
  //.on(getMassFx.doneData, (state, payload) => MassMode.EDIT)
  .reset([resetMassMode])

$massUpdated
  .on(createMassFx.doneData, () => true)
  .on(updateMassFx.doneData, () => true)
  .on(deleteMassFx.doneData, () => true)
  .on(resetMassUpdated, () => false)

$massDeleted
  .on(deleteMassFx.doneData, () => true)
  .on(resetMassDeleted, () => false)
  .reset([deleteMass])


guard({
  source: saveMass,
  filter: $massMode.map((x) => x === MassMode.CREATE),
  target: attach({
    source: {
      mass: $mass,
      auth: $auth,
      parish: $parish,
    },
    mapParams:  (params, data) => {
      return {
        ...data.mass,
        parishId: data.auth.parish_id,
        cityId: data.parish?.cityId
      }
    },
    effect: createMassFx,
  }),
});

guard({
  source: saveMass,
  filter: $massMode.map((x) => x === MassMode.EDIT),
  target: attach({
    source: {
      mass: $mass,
      auth: $auth,
      parish: $parish,
    },
    mapParams:  (params, data) => {
      console.log(data.mass);
      return {
        ...data.mass,
        parishId: data.auth.parish_id,
        cityId: data.parish?.cityId
      }
    },
    effect: updateMassFx,
  }),
});

forward({
  from: editMass,
  to: getMassFx
});

forward({
  from: deleteMass,
  to: deleteMassFx
})

