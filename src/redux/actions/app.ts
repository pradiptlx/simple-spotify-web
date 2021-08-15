import { createAction } from "@reduxjs/toolkit";

export type applicationConfigType = {
  darkTheme: boolean;
};

const setDarkTheme = createAction<boolean>("app/set_dark_theme");

export { setDarkTheme };
