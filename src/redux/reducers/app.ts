import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { SimplifiedPlaylistObject } from "api/interfaces";
import { pageDataType, setDarkTheme, setPageData } from "redux/actions/app";

const initialApplicationState = {
  darkTheme: false,
  currentUserPlaylists: [] as SimplifiedPlaylistObject[],
};

const applicationReducer = createReducer(initialApplicationState, (builder) => {
  builder.addCase(setDarkTheme, (state, action: PayloadAction<boolean>) => {
    // eslint-disable-next-line no-param-reassign
    state.darkTheme = action.payload;
  });

  builder.addCase(
    setPageData,
    (state, action: PayloadAction<pageDataType>) => ({
      ...state,
      ...action.payload,
    })
  );
});

export { applicationReducer, initialApplicationState };
