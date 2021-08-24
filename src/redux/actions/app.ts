import { createAction } from "@reduxjs/toolkit";
import { SimplifiedPlaylistObject, TrackObject } from "api/interfaces";

export type pageDataType = {
  currentUserPlaylists: SimplifiedPlaylistObject[];
};

export type playbackResponseType = {
  isPlaybackError: boolean;
  playbackMessage: string;
};

export type currentUserPlaybackType = { currentPlayback: TrackObject };

export type userPlaybackType = {
  userPlayback: playbackResponseType & currentUserPlaybackType;
};

const setDarkTheme = createAction<boolean>("app/set_dark_theme");

const setPageData = createAction(
  "app/set_page_data",
  ({ currentUserPlaylists }: pageDataType) => ({
    payload: {
      currentUserPlaylists,
    },
  })
);

const setUserPlaybackResponse = createAction(
  "app/set_user_playback",
  ({ isPlaybackError, playbackMessage }: playbackResponseType) => ({
    payload: {
      isPlaybackError,
      playbackMessage,
    },
  })
);

const setCurrentUserPlayback = createAction(
  "app/set_current_user_playback",
  ({ currentPlayback }: currentUserPlaybackType) => ({
    payload: { currentPlayback },
  })
);

export {
  setDarkTheme,
  setPageData,
  setUserPlaybackResponse,
  setCurrentUserPlayback,
};
