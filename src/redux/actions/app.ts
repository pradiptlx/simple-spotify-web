import { createAction } from "@reduxjs/toolkit";
import { SimplifiedPlaylistObject } from "api/interfaces";

export type pageDataType = {
  currentUserPlaylists: SimplifiedPlaylistObject[];
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

export { setDarkTheme, setPageData };
