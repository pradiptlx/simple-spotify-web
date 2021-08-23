import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { SimplifiedPlaylistObject, TrackObject } from "api/interfaces";
import {
  pageDataType,
  setDarkTheme,
  setPageData,
  setUserPlayback,
  userPlaybackType,
} from "redux/actions/app";

const initialApplicationState = {
  darkTheme: false,
  currentUserPlaylists: [] as SimplifiedPlaylistObject[],
  userPlayback: {
    isPlaybackError: false,
    playbackMessage: "",
    currentPlayback: {} as TrackObject,
  },
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

  builder.addCase(
    setUserPlayback,
    (state, action: PayloadAction<userPlaybackType>) => ({
      ...state,
      ...action.payload,
    })
  );
});

export { applicationReducer, initialApplicationState };
