import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { useHistory } from "react-router-dom";
import { setExpiredTokenTime } from "redux/actions/authorization";
import Playlists from "components/Playlists";
import { getCurrentUserPlaylists, getAllFeaturedPlaylists } from "api/fetch";
import { SimplifiedPlaylistObject } from "api/interfaces";
import Sidebar from "components/Sidebar";
import { setPageData } from "redux/actions/app";

function Home(): React.ReactElement {
  const dispatch = useDispatch();
  const history = useHistory();

  const { accessToken, isAccessTokenExists } = useSelector(
    (state) => state.authorization
  );

  const [featuredPlaylists, setFeaturedPlaylists] = React.useState<
    SimplifiedPlaylistObject[]
  >([]);

  const fetchDepedencies = React.useCallback(async () => {
    if (accessToken && isAccessTokenExists) {
      await getCurrentUserPlaylists(
        { limit: 50, offset: 0 },
        { accessToken },
        (responseData) => {
          dispatch(setPageData({ currentUserPlaylists: responseData }));
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

      await getAllFeaturedPlaylists(
        { limit: 50, offset: 0, country: "ID" },
        { accessToken },
        setFeaturedPlaylists,
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
  }, [accessToken, isAccessTokenExists]);

  React.useEffect(() => {
    fetchDepedencies();
  }, [fetchDepedencies]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid grid-cols-sidebar">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">Trending Now.</h1>
          <div
            id="playlists"
            className="flex flex-wrap justify-center items-stretch space-x-4"
          >
            <Playlists playlists={featuredPlaylists} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
