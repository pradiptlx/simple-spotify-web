import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { useHistory } from "react-router-dom";
import { setExpiredTokenTime } from "redux/actions/authorization";
import Playlists from "components/Playlists";
import {
  getCurrentUserPlaylists,
} from "api/fetch";
import {SimplifiedPlaylistObject} from 'api/interfaces'

function Home(): React.ReactElement {
  const dispatch = useDispatch();
  const history = useHistory();

  const { accessToken, isAccessTokenExists } = useSelector(
    (state) => state.authorization
  );

  const [userPlaylists, setUserPlaylists] = React.useState<
    SimplifiedPlaylistObject[]
  >([]);

  React.useEffect(() => {
    if (accessToken && isAccessTokenExists) {
      getCurrentUserPlaylists(
        { limit: 50, offset: 0 },
        { accessToken },
        setUserPlaylists,
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

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div
        id="playlists"
        className="flex flex-wrap justify-center items-stretch space-x-4"
      >
        <Playlists playlists={userPlaylists} />
      </div>
    </div>
  );
}

export default Home;
