import React from "react";
import Navbar from "components/Navbar";
import userEvent from "@testing-library/user-event";
import { render } from "test/Wrapper";
import { combineReducers, createStore, Store } from "@reduxjs/toolkit";
import { ImageObject, SimplifiedPlaylistObject } from "api/interfaces";
import { applicationReducer } from "redux/reducers/app";
import { authorizationReducer } from "redux/reducers/authorization";
import { userReducer } from "redux/reducers/user";

type renderNavbarProps = {
  route: string;
  store?: Store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStore?: any;
};

function renderNavbar({ route = "/", store, initialStore }: renderNavbarProps) {
  let navbarStore = store;
  if (initialStore) {
    navbarStore = createStore(
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

  const { rendered, history } = render(<Navbar />, {
    route,
    store: navbarStore,
  });

  return {
    ...rendered,
    history,
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

it("click Home NavLink from Login Page should redirect to Home Page", async () => {
  const { queryAllByTestId, history } = renderNavbar({ route: "/login" });
  expect(history.entries[history.entries.length - 1].pathname).toBe("/login");
  const homeNavLink = queryAllByTestId("homeNavLink");

  userEvent.click(homeNavLink[0]);
  expect(history.entries[history.entries.length - 1].pathname).toBe("/");
  expect(homeNavLink[0]).toHaveClass("homeNav bg-gray-900");
});

it("click Create Playlist NavLink from Home Page should redirect to Create Playlist Page", async () => {
  const { queryAllByTestId, history } = renderNavbar({ route: "/" });
  expect(history.entries[history.entries.length - 1].pathname).toBe("/");
  const createPlaylistNavLink = queryAllByTestId("createPlaylistNavLink");

  userEvent.click(createPlaylistNavLink[0]);
  expect(history.entries[history.entries.length - 1].pathname).toBe(
    "/create-playlist"
  );
  expect(createPlaylistNavLink[0]).toHaveClass("createPlaylistNav bg-gray-900");
});

it("profile picture not show by default", () => {
  const { queryByRole } = renderNavbar({ route: "/" });
  expect(queryByRole("presentation")).toBeNull();
});

// eslint-disable-next-line jest/expect-expect
it("profile picture is exists after get accessToken", async () => {
  const initialAuthorizationState = {
    accessToken: "abc",
    expiredTokenTime: Date,
    isTokenExpired: false,
    isAccessTokenExists: true,
    isLogin: true,
  };
  const initialUserState = {
    id: "user01",
    display_name: "user01",
    images: [{ url: "#", height: null, width: null }] as ImageObject[],
    external_urls: { spotify: "#" },
    country: "ID",
    followers: { href: "#", total: 0 },
    email: "test@email.com",
  };
  const initialApplicationState = {
    darkTheme: false,
    currentUserPlaylists: [] as SimplifiedPlaylistObject[],
  };
  const initialStore = {
    user: initialUserState,
    authorization: initialAuthorizationState,
    app: initialApplicationState,
  };
  const { findByTestId, queryByTestId } = renderNavbar({
    route: "/login",
  });
  const profilePicture = queryByTestId("profilePictureUser");
  expect(profilePicture).toBeNull();
  renderNavbar({
    route: "/login",
    initialStore,
  });
  const profilePictureLogin = await findByTestId("profilePictureUser");
  expect(profilePictureLogin).toBeInTheDocument();
});
