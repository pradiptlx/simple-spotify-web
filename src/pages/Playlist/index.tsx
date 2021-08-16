/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "redux/store";
import { useParams, useHistory } from "react-router-dom";
import Sidebar from "components/Sidebar";
import Tracks from "components/Tracks";
import {
  PlaylistObject,
  SimplifiedPlaylistObject,
  TrackObject,
} from "api/interfaces";
import { selectedTrackIdentifier } from "pages/CreatePlaylist";
import { errorArgFn, getCurrentUserPlaylists, getPlaylist } from "api/fetch";
import { setExpiredTokenTime } from "redux/actions/authorization";
import { setPageData } from "redux/actions/app";

const PlaylistPage = (): React.ReactElement => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { accessToken, isAccessTokenExists } = useSelector(
    (state) => state.authorization
  );

  const [tracks, setTracks] = React.useState<TrackObject[]>([]);
  const [currentPlalist, setCurrentPlaylist] =
    React.useState<Pick<PlaylistObject, "name" | "description" | "id">>();
  const [userPlaylists, setUserPlaylists] = React.useState<
    SimplifiedPlaylistObject[]
  >([]);
  const errorFetchingHandler = ({ statusCode }: errorArgFn) => {
    if (statusCode === 400 || statusCode === 401) {
      dispatch(
        setExpiredTokenTime({
          expiredTokenTime: new Date().getTime(),
          isTokenExpired: true,
        })
      );
      history.replace("/login");
    }
  };

  const setPlaylistTracksHandler = (responseData: PlaylistObject) => {
    setCurrentPlaylist({
      name: responseData.name,
      description: responseData.description,
      id: responseData.id,
    });
    const playlistTracks = responseData.tracks.items
      .map((item) => item) // PagingObject items[]
      .map((track) => track.track); // item track[]

    setTracks(playlistTracks);
  };

  const fetchTracksHandler = React.useCallback(async () => {
    if (!accessToken || !isAccessTokenExists) return;
    await getPlaylist(
      { playlistId },
      { accessToken },
      setPlaylistTracksHandler,
      errorFetchingHandler
    );
  }, [accessToken, isAccessTokenExists, playlistId]);

  React.useEffect(() => {
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
  }, []);

  React.useEffect(() => {
    fetchTracksHandler();

    return () => {
      setTracks([]);
    };
  }, [fetchTracksHandler]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid grid-cols-sidebar">
        <div className="h-full">
          <Sidebar userPlaylists={userPlaylists} />
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">
            {currentPlalist?.name}
          </h1>
          <div className="flex flex-wrap justify-center items-stretch space-x-4">
            <Tracks trackData={tracks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
