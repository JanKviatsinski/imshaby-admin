export type Auth = {
  token: string;
  parish_id: string;
}

export enum AuthStatus {
  init,
  success,
  failed
}