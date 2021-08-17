import React from "react";
import { useHistory } from "react-router-dom";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { setExpiredTokenTime } from "redux/actions/authorization";
import { AlbumObject } from "api/interfaces";
import { getCurrentUserPlaylists, getCurrentUserSavedData } from "api/fetch";
import Sidebar from "components/Sidebar";
import Albums from "components/Albums";
import { setPageData } from "redux/actions/app";

const AlbumPage = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { accessToken, isAccessTokenExists } = useSelector(
    (state) => state.authorization
  );

  const [albums, setAlbums] = React.useState<AlbumObject[]>([]);

  const fetchHandler = React.useCallback(async () => {
    if (!accessToken && !isAccessTokenExists) return;
    await getCurrentUserSavedData(
      { type: "albums" },
      { accessToken },
      setAlbums,
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

    await getCurrentUserPlaylists(
      { limit: 50, offset: 0 },
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
  }, [accessToken, isAccessTokenExists]);

  React.useEffect(() => {
    fetchHandler();

    return () => {
      setAlbums([]);
    };
  }, [fetchHandler]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid grid-cols-sidebar">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">My Albums</h1>
          <div className="flex flex-wrap justify-center items-stretch space-x-4">
            <Albums albums={albums} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
