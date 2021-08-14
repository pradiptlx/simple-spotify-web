/* eslint-disable no-param-reassign */
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import {
  accessTokenIdentifier,
  expiredTokenTimeIdentifier,
  removeAuthorization,
  setAccessToken,
  setExpiredTokenTime,
  setLoginState,
  // eslint-disable-next-line import/extensions
} from "../actions/authorization";

const initialAuthorizationState = {
  accessToken: "",
  expiredTokenTime: 0,
  isTokenExpired: true,
  isAccessTokenExists: false,
  isLogin: false,
};

const authorizationReducer = createReducer(
  initialAuthorizationState,
  (builder) => {
    // SET ACCESS TOKEN
    builder.addCase(
      setAccessToken,
      (state, action: PayloadAction<accessTokenIdentifier>) => {
        const { accessToken, isAccessTokenExists } = action.payload;

        return {
          ...state,
          accessToken,
          isAccessTokenExists,
        };
      }
    );
    // SET ACCESS TOKEN EXPIRED TIME
    builder.addCase(
      setExpiredTokenTime,
      (state, action: PayloadAction<expiredTokenTimeIdentifier>) => {
        const { expiredTokenTime, isTokenExpired } = action.payload;

        return {
          ...state,
          expiredTokenTime,
          isTokenExpired,
        };
      }
    );
    // SET LOGIN STATUS
    builder.addCase(setLoginState, (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    });
    // CLEAR STATE
    builder.addCase(removeAuthorization, (state, action) => ({
      ...state,
      ...action.payload,
    }));
  }
);

// eslint-disable-next-line import/prefer-default-export
export { authorizationReducer };
