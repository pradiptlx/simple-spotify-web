/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import "./App.css";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import {
  Switch,
  Route,
  Redirect,
  RouteComponentProps,
  useLocation,
  useHistory,
} from "react-router-dom";
import { setDarkTheme, setPageData } from "redux/actions/app";
import { createTheme, Theme, ThemeProvider } from "@material-ui/core/styles";
import PlaylistPage from "pages/Playlist";
import AlbumPage from "pages/Album";
import ArtistPage from "pages/Artist";
import TrackPage from "pages/Track";
import {
  setAccessToken,
  setExpiredTokenTime,
  setLoginState,
} from "./redux/actions/authorization";
import { setCurrentUser } from "./redux/actions/user";
import { fetchCurrentUserProfile, getCurrentUserSavedData } from "./api/fetch";
import { parsingAccessToken } from "./utils/authorization";
import Navbar from "./components/Navbar";
import Home from "./pages";
import CreatePlaylist from "./pages/CreatePlaylist";
import Login from "./pages/Login";

type AppRouteComponentProps = {
  isLogin: boolean;
  isPrivate: boolean;
  component: (props: RouteComponentProps) => React.ReactElement;
};

type PrivateRouteProps = AppRouteComponentProps & {
  exact: boolean;
  path: string;
};

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...props
}) => (
  <Route
    {...props}
    render={(routeProps) =>
      !props.isLogin && props.isPrivate ? (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: routeProps.location },
          }}
        />
      ) : (
        <Component {...routeProps} />
      )
    }
  />
);

type localStorageAccessToken = {
  accessToken: string;
  expiredTokenTime: number;
};

function App(): React.ReactElement {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { isLogin, isTokenExpired, isAccessTokenExists, accessToken } =
    useSelector((state) => state.authorization);
  const { currentUserPlaylists } = useSelector((state) => state.app);
  const currentUser = useSelector((state) => state.user);
  const { darkTheme } = useSelector((state) => state.app);
  const [isFirstMounted, setIsFirstMounted] = React.useState(true);

  const routes = [
    {
      pathname: "/",
      component: Home,
      isPrivate: true,
      state: null,
      exact: true,
    },
    {
      pathname: "/create-playlist",
      component: CreatePlaylist,
      isPrivate: true,
      state: null,
      exact: true,
    },
    {
      pathname: "/playlist/:playlistId",
      component: PlaylistPage,
      isPrivate: true,
      state: null,
      exact: true,
    },
    {
      pathname: "/me/albums",
      component: AlbumPage,
      isPrivate: true,
      state: null,
      exact: true,
    },
    {
      pathname: "/me/artists",
      component: ArtistPage,
      isPrivate: true,
      state: null,
      exact: true,
    },
    {
      pathname: "/me/tracks",
      component: TrackPage,
      isPrivate: true,
      state: null,
      exact: true,
    },
  ];

  // When isLogin state is initialized, its state is false so handle with isFirstMounted to prevent redirecting to Login component each refresh
  React.useEffect(() => {
    const isDarkThemeExists = Boolean(localStorage.getItem("darkTheme"));
    if (isFirstMounted) {
      setIsFirstMounted(false);
      if (
        isDarkThemeExists ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.classList.add("dark");
        dispatch(setDarkTheme(true));
      }
    }
  }, []);

  React.useEffect(() => {
    const excludePaths = ["/create-playlist", "/login"];
    if (!accessToken && !isAccessTokenExists) return;

    if (
      location &&
      !excludePaths.includes(location.pathname) &&
      currentUserPlaylists.length === 0
    ) {
      getCurrentUserSavedData(
        { type: "playlists", limit: 50, offset: 0 },
        { accessToken },
        (responseData) => {
          dispatch(
            setPageData({
              currentUserPlaylists: responseData,
            })
          );
        },
        ({ statusCode }) => {
          if (statusCode === 400 || statusCode === 401) {
            dispatch(
              setExpiredTokenTime({
                expiredTokenTime: 0,
                isTokenExpired: true,
              })
            );
            history.replace("/login");
          }
        }
      );
    }
  }, [location, accessToken, isAccessTokenExists, currentUserPlaylists]);

  const changeDomThemeHandler = React.useCallback(() => {
    // Manual Dark Theme Mode
    const isDarkThemeExists = Boolean(localStorage.getItem("darkTheme"));
    if (darkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkTheme", "true");
    } else if (!darkTheme && isDarkThemeExists && !isFirstMounted) {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("darkTheme");
    }
  }, [darkTheme, isFirstMounted]);

  React.useEffect(() => {
    changeDomThemeHandler();
  }, [changeDomThemeHandler]);

  // Parsing access token from local storage or from URL callback
  React.useEffect(() => {
    const {
      accessToken: accessTokenLocal,
      expiredTokenTime: expiredTimeLocal,
    }: localStorageAccessToken = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      localStorage.getItem("spotify-access-token")!
    ) || {
      accessToken: "",
      expiredTokenTime: new Date(),
    };

    const isExpired = new Date(expiredTimeLocal).getTime() - Date.now() <= 0;
    const isTokenExist = Boolean(accessTokenLocal);
    const url = window.location.href;

    if (url.split("#").length > 1 && isExpired && !isLogin) {
      parsingAccessToken(({ accessTokenURL, expiredTokenTimeURL }) => {
        dispatch(
          setAccessToken({
            accessToken: accessTokenURL,
            isAccessTokenExists: true,
          })
        );

        dispatch(
          setExpiredTokenTime({
            isTokenExpired: false,
            expiredTokenTime: expiredTokenTimeURL.getTime(),
          })
        );
      });
    } else if (!isLogin && isTokenExist && !isExpired) {
      dispatch(setLoginState(true));
    } else {
      // Fallback conditional
      dispatch(
        setAccessToken({
          accessToken: accessTokenLocal,
          isAccessTokenExists: isTokenExist,
        })
      );

      dispatch(
        setExpiredTokenTime({
          expiredTokenTime: expiredTimeLocal,
          isTokenExpired: isExpired,
        })
      );
    }
  }, [isLogin]);

  // Fetch user info
  React.useEffect(() => {
    if ((currentUser.id === "" || isTokenExpired) && isAccessTokenExists) {
      fetchCurrentUserProfile(
        { accessToken },
        (userData) => {
          dispatch(setCurrentUser(userData));
        },
        ({ statusCode }) => {
          if (statusCode === 400 || statusCode === 401) {
            dispatch(
              setExpiredTokenTime({
                expiredTokenTime: new Date().getTime(),
                isTokenExpired: true,
              })
            );
          }
        }
      );
    }
  }, [accessToken, isTokenExpired, isAccessTokenExists, currentUser.id]);

  const materialComponentsTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: darkTheme ? "dark" : "light",
          primary: {
            light: "#737d8e",
            main: "#475161",
            dark: "#1f2937",
          },
          secondary: {
            light: "#d7ffd9",
            main: "#a5d6a7",
            dark: "#75a478",
          },
        },
      }),
    [darkTheme]
  );

  return (
    <ThemeProvider<Theme> theme={materialComponentsTheme}>
      <Navbar />
      <Switch>
        {/* Auth Handler */}
        <Route path="/login" component={Login} />

        {routes.map((route) => {
          if (route.isPrivate) {
            return (
              <PrivateRoute
                key={`private_${route.pathname}`}
                exact={route.exact}
                path={route.pathname}
                isPrivate
                isLogin={isLogin || isFirstMounted}
                component={route.component}
              />
            );
          }
          return (
            <Route
              key={`public_${route.pathname}`}
              exact={route.exact}
              path={route.pathname}
              component={route.component}
            />
          );
        })}
      </Switch>
    </ThemeProvider>
  );
}

export default App;
