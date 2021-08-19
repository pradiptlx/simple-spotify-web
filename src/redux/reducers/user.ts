import { createReducer } from "@reduxjs/toolkit";
import { ImageObject } from "api/interfaces";
// eslint-disable-next-line import/extensions
import { setCurrentUser } from "../actions/user";

const initialUserState = {
  id: "",
  display_name: "",
  images: [{ url: "", height: null, width: null }] as ImageObject[],
  external_urls: { spotify: "" },
  country: "",
  followers: { href: "", total: 0 },
  email: "",
};

const userReducer = createReducer(initialUserState, (builder) => {
  builder.addCase(setCurrentUser, (state, action) => ({
    ...state,
    ...action.payload,
  }));
});

export { userReducer, initialUserState };
