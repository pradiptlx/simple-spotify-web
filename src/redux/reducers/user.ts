import { createReducer } from "@reduxjs/toolkit";
// eslint-disable-next-line import/extensions
import { setCurrentUser } from "../actions/user";

const initialUserState = {
  id: "",
  displayName: "",
  imageUrl: "",
  spotifyUrl: "",
};

const userReducer = createReducer(initialUserState, (builder) => {
  builder.addCase(setCurrentUser, (state, action) => ({
    ...state,
    ...action.payload,
  }));
});

export { userReducer, initialUserState };
