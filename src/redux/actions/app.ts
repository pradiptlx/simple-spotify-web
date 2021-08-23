import { createAction } from "@reduxjs/toolkit";
import { SimplifiedPlaylistObject, TrackObject } from "api/interfaces";

export type pageDataType = {
  currentUserPlaylists: SimplifiedPlaylistObject[];
};

export type userPlaybackType = {
  isPlaybackError?: boolean;
  playbackMessage?: string;
  currentPlayback?: TrackObject;
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

const setUserPlayback = createAction(
  "app/set_user_playback",
  ({ isPlaybackError, playbackMessage, currentPlayback }) => ({
    payload: {
      isPlaybackError,
      playbackMessage,
      currentPlayback,
    },
  })
);

export { setDarkTheme, setPageData, setUserPlayback };
