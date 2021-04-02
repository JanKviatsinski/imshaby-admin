import { forward } from 'effector';
import {
  $auth,
  $authStatus,
  createAuthClientFx,
  fetchTokenFx,
  isAuthenticatedFx,
  loginWithRedirect,
  loginWithRedirectFx,
  logout,
  logoutFx,
} from './';
import { AuthStatus } from './types';

$auth
  .on(fetchTokenFx.doneData, (state, { token, parish_id }) => ({ ...state, token, parish_id }));

$authStatus
  .on(isAuthenticatedFx.doneData, (state, payload) => payload ? AuthStatus.success : AuthStatus.failed)
  .reset(logout);

forward({
  from: loginWithRedirectFx.doneData,
  to: isAuthenticatedFx,
})

forward({
  from: createAuthClientFx.doneData,
  to: [isAuthenticatedFx]
});

forward({
  from: isAuthenticatedFx.doneData,
  to: [fetchTokenFx]
});

forward({
  from: loginWithRedirect,
  to: [loginWithRedirectFx]
});

forward({
  from: logout,
  to: [logoutFx]
});
