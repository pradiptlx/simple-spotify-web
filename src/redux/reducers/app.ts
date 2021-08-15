import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { setDarkTheme } from "redux/actions/app";

const initialApplicationState = {
  darkTheme: false,
};

const applicationReducer = createReducer(initialApplicationState, (builder) => {
  builder.addCase(setDarkTheme, (state, action: PayloadAction<boolean>) => {
    // eslint-disable-next-line no-param-reassign
    state.darkTheme = action.payload;
  });
});

export default applicationReducer;
