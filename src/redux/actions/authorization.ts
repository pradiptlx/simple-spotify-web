import { createAction } from "@reduxjs/toolkit";

export type accessTokenIdentifier = {
  accessToken: string;
  isAccessTokenExists: boolean;
};

export type expiredTokenTimeIdentifier = {
  expiredTokenTime: number;
  isTokenExpired: boolean;
};

const SET_ACCESS_TOKEN_ACTION_TYPE = "authorization/set_access_token";

const setAccessToken = createAction(
  SET_ACCESS_TOKEN_ACTION_TYPE,
  ({ accessToken, isAccessTokenExists }: accessTokenIdentifier) => ({
    payload: {
      accessToken,
      isAccessTokenExists,
    },
  })
);

const setExpiredTokenTime = createAction(
  "authorization/set_expired_token_time",
  ({ expiredTokenTime, isTokenExpired }: expiredTokenTimeIdentifier) => ({
    payload: {
      expiredTokenTime,
      isTokenExpired,
    },
  })
);

const removeAuthorization = createAction(
  "authorization/remove_access_token",
  () => ({
    payload: {
      accessToken: "",
      expiredTokenTime: 0,
      isTokenExpired: true,
      isAccessTokenExists: false,
    },
  })
);

const setLoginState = createAction<boolean>("authorization/set_login_state");

export {
  setAccessToken,
  setExpiredTokenTime,
  removeAuthorization,
  setLoginState,
};
