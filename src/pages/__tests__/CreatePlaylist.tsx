import React from "react";
import { waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "test/Wrapper";
import CreatePlaylist from "pages/CreatePlaylist";
import { tracksMockData } from "mocks/track";
import { Store, createStore, combineReducers } from "@reduxjs/toolkit";
import { applicationReducer } from "redux/reducers/app";
import { authorizationReducer } from "redux/reducers/authorization";
import { userReducer } from "redux/reducers/user";
import { mockPlaylistObject } from "mocks/playlist";

const handlers = [
  // Search Tracks
  rest.get(`${process.env.REACT_APP_SPOTIFY_API_URL}/search`, (req, res, ctx) =>
    res(ctx.json({ tracks: { items: tracksMockData } }))
  ),
  // Create Playlist
  rest.post(
    `${process.env.REACT_APP_SPOTIFY_API_URL}/users//playlists`,
    (req, res, ctx) => {
      const { body } = req;
      if (
        typeof body !== "undefined" &&
        Object(body).name.length < 10 &&
        Object(body).description.length < 20
      ) {
        return res(ctx.status(402));
      }
      return res(ctx.status(200), ctx.json(mockPlaylistObject));
    }
  ),
  // Add tracks to new playlist
  rest.post(
    `${process.env.REACT_APP_SPOTIFY_API_URL}/playlists/:playlistId/tracks`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          snapshot_id:
            "JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+",
        })
      )
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

type renderPage = {
  route: string;
  store?: Store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStore?: any;
  trackTitle: string;
};

function renderPage({ trackTitle, route, store, initialStore }: renderPage) {
  let pageStore = store;
  if (initialStore) {
    pageStore = createStore(
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
  const { rendered, history } = render(<CreatePlaylist />, {
    route,
    store: pageStore,
  });
  const { getByTestId } = rendered;

  const searchBarInput = getByTestId("searchTrackSpotifyInput");
  const searchBarBtn = getByTestId("searchTrackSpotifyBtn");

  userEvent.type(searchBarInput, trackTitle);

  return {
    ...rendered,
    history,
    searchBarInput,
    searchBarBtn,
  };
}

test("search spotify api after click submit", async () => {
  const searchTrackTitle = "hello world";
  const { searchBarInput, searchBarBtn, getAllByRole } = renderPage({
    trackTitle: searchTrackTitle,
    route: "/create-playlist",
  });

  expect(searchBarInput).toHaveValue(searchTrackTitle);

  await act(async () => {
    await waitFor(() => userEvent.click(searchBarBtn));
  });

  await waitFor(() => expect(getAllByRole("presentation")).toHaveLength(4), {
    timeout: 1000,
  });
});

test("create playlist on success should create alert of success", async () => {
  const searchTrackTitle = "track 2";
  const initialStore = {
    authorization: {
      accessToken: "abc",
    },
  };
  const {
    searchBarInput,
    searchBarBtn,
    findByPlaceholderText,
    getByText,
    findByText,
    getAllByRole,
  } = renderPage({
    trackTitle: searchTrackTitle,
    route: "/create-playlist",
    initialStore,
  });

  expect(searchBarInput).toHaveValue(searchTrackTitle);

  act(() => {
    userEvent.click(searchBarBtn);
  });

  await waitFor(() => expect(getAllByRole("presentation")).toHaveLength(4), {
    timeout: 1000,
  });
  const titleInputForm = await findByPlaceholderText("Title");
  const descTextareaForm = await findByPlaceholderText("Enter Description.");
  const submitFormBtn = await findByText("Create Playlist");

  act(() => {
    // for (let i = 0; i < 3; i += 1) {
    //   const selectedTrack = getByText(tracksMockData[i].name);

    //   userEvent.click(selectedTrack);
    // }
    const selectedTrack = getByText(tracksMockData[0].name);

    userEvent.click(selectedTrack);
  });

  userEvent.type(
    titleInputForm,
    "This is integration testing for create playlist"
  );
  userEvent.type(
    descTextareaForm,
    "This is integration testing for create playlist. Please be patient and keep searching the bug!"
  );

  act(() => {
    userEvent.click(submitFormBtn);
  });

  await waitFor(
    async () => {
      const alert = await findByText("Sucess Add New Playlist");
      expect(alert).toBeVisible();
    },
    { timeout: 5000 }
  );
});
