import React from "react";
import { combineReducers, createStore, Store } from "@reduxjs/toolkit";
import { render, waitFor } from "test/Wrapper";
import Sidebar from "components/Sidebar";
import { applicationReducer } from "redux/reducers/app";
import { authorizationReducer } from "redux/reducers/authorization";
import { userReducer } from "redux/reducers/user";
import { SimplifiedPlaylistObject } from "api/interfaces";
import { build, fake } from "@jackfranklin/test-data-bot";

type renderSidebarType = {
  route: string;
  store?: Store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStore?: any;
};

function renderSidebar({ route, store, initialStore }: renderSidebarType) {
  let sidebarStore = store;
  if (initialStore) {
    sidebarStore = createStore(
      combineReducers({
        authorization: authorizationReducer,
        user: userReducer,
        app: applicationReducer,
      }),
      {
        ...initialStore,
      }
    );
  }
  const { rendered } = render(<Sidebar />, { route, store: sidebarStore });

  return {
    ...rendered,
  };
}

const playlistDataBuilder = build<{ description: string }>("playlist", {
  fields: {
    description: fake((f) => f.lorem),
  },
});

const mockPlaylistData: SimplifiedPlaylistObject[] = [
  {
    external_urls: {
      spotify:
        "http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
    },
    href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
    id: "53Y8wT46QIMz5H4WQ8O22c",
    images: [],
    name: "Wizzlers Big Playlist",
    public: true,
    tracks: {
      href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks",
      total: 30,
    },
    description: playlistDataBuilder().description,
  },
  {
    external_urls: {
      spotify:
        "http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
    },
    href: "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
    id: "1AVZz0mBuGbCEoNRQdYQju",
    images: [],
    name: "Another Playlist",
    public: true,
    tracks: {
      href: "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks",
      total: 58,
    },
    description: playlistDataBuilder().description,
  },
];

it("render skeleton on empty data", () => {
  const { queryAllByTestId, queryByTestId } = renderSidebar({ route: "/" });
  const rootSkeleton = queryByTestId("emptySkeleton");
  const items = queryAllByTestId("emptySkeletonItem");
  expect(rootSkeleton).not.toBeNull();
  expect(items).toHaveLength(20);
});

it("render sidebar data", async () => {
  const initialStore = {
    app: {
      currentUserPlaylists: mockPlaylistData,
      darkTheme: true,
    },
  };
  const { getByText } = renderSidebar({
    route: "/",
    initialStore,
  });
  await waitFor(() => {
    mockPlaylistData.forEach((data) => {
      const playlistName = getByText(data.name);
      expect(playlistName).toHaveTextContent(data.name);
    });
  });
});
