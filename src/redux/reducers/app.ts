import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { SimplifiedPlaylistObject, TrackObject } from "api/interfaces";
import {
  pageDataType,
  setCurrentUserPlayback,
  setDarkTheme,
  setPageData,
  setUserPlaybackResponse,
  playbackResponseType,
  currentUserPlaybackType,
} from "redux/actions/app";

const initialApplicationState = {
  darkTheme: false,
  currentUserPlaylists: [] as SimplifiedPlaylistObject[],
  userPlayback: {
    isPlaybackError: false,
    playbackMessage: "",
  },
  currentPlayback: {} as TrackObject,
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
    setUserPlaybackResponse,
    (state, action: PayloadAction<playbackResponseType>) => ({
      ...state,
      userPlayback: {
        ...action.payload,
      },
    })
  );

  builder.addCase(
    setCurrentUserPlayback,
    (state, action: PayloadAction<currentUserPlaybackType>) => ({
      ...state,
      currentPlayback: action.payload.currentPlayback,
    })
  );
});

export { applicationReducer, initialApplicationState };
