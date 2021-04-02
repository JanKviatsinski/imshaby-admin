import { createStore, createEffect, createEvent } from 'effector';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth, AuthStatus } from './types';
import { USER_PARISH_FIELD } from '../../utils/constans';

const { REACT_APP_AUTH_DOMAIN = '', REACT_APP_AUTH_CLIENT_ID = '', REACT_APP_AUTH_AUDIENCE = '' } = process.env;


export const $authStatus = createStore<AuthStatus>(AuthStatus.init);

export const $auth = createStore<Auth>({
  token: '',
  parish_id: '',
});

let client: Auth0Client | null = null;

export const createAuthClientFx = createEffect(async () => {
  if (!client) {
    client = await createAuth0Client({
      domain: REACT_APP_AUTH_DOMAIN,
      client_id: REACT_APP_AUTH_CLIENT_ID ,
      redirect_uri: window.location.origin,
      audience: REACT_APP_AUTH_AUDIENCE,
    });
  }

  return client;
});

export const fetchTokenFx = createEffect(async () => {
  const user = await client?.getUser();
  const token = await client?.getTokenSilently();
  return {
   token,
   parish_id: user ? user[USER_PARISH_FIELD] : ''
  }
})

export const isAuthenticatedFx = createEffect(async (): Promise<boolean> => {
  const isAuthenticated = await client?.isAuthenticated();
  return !!isAuthenticated
})

export const loginWithRedirectFx = createEffect(async () => {
  console.log('loginWithRedirectFx');
  const client = await createAuthClientFx();
  await client.loginWithRedirect({
    redirect_uri: window.location.origin
  });

  const isAuthenticated = await client?.isAuthenticated();
  console.log('=====');
  console.log(isAuthenticated);
})

export const logoutFx = createEffect(async () => {
  await client?.logout();
})

export const loginWithRedirect = createEvent();
export const logout = createEvent();

