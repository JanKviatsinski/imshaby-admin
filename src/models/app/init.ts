import { combine, forward } from 'effector';
import { AppGate, createApiClientFx, $apiClientReady, $auth0ClientReady, $tokenReady } from './';
import { createAuthClientFx, fetchTokenFx } from '../auth';
import { Auth } from '../auth/types';

$apiClientReady.on(createApiClientFx.doneData, () => true);
$auth0ClientReady.on(createAuthClientFx.doneData, () => true);
$tokenReady.on(fetchTokenFx.doneData, () => true);



forward({
  from: AppGate.open,
  to: createAuthClientFx,
});

const createApiClient = createApiClientFx.prepend((params: Auth) => params.token);
forward({
  from: fetchTokenFx.doneData,
  to: [createApiClient],
});