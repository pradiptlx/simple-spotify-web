/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "redux/store";
import { useParams, useHistory } from "react-router-dom";
import Sidebar from "components/Sidebar";
import Tracks from "components/Tracks";
import { PlaylistObject, TrackObject } from "api/interfaces";
import { errorArgFn, getCurrentUserPlaylists, getPlaylist } from "api/fetch";
import { setExpiredTokenTime } from "redux/actions/authorization";
import { setPageData } from "redux/actions/app";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import CardList from "components/CardList";

const emptyDataComponent = () => (
  <div className="flex flex-wrap justify-center items-stretch space-x-4">
    {new Array(10).fill(0).map((_, idx) => (
      <Box
        // eslint-disable-next-line react/no-array-index-key
        key={`box_${idx}`}
        mt={10}
        style={{
          maxWidth: "24rem",
          overflow: "hidden",
        }}
        data-testid="emptyTrackComponent"
      >
        <Skeleton
          variant="rect"
          animation="wave"
          width={600}
          height="300px"
          style={{
            borderRadius: "0.25rem",
          }}
        />
        <Box
          py={2}
          px={4}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: ".25rem",
          }}
        >
          <Skeleton
            variant="text"
            style={{
              width: "300px",
            }}
          />
          <Skeleton
            variant="text"
            style={{
              width: "300px",
            }}
          />
        </Box>
      </Box>
    ))}
  </div>
);

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
          <Sidebar />
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">
            {currentPlalist?.name}
          </h1>
          <CardList
            type="tracks"
            cardListItems={tracks}
            emptyDataComponentFn={emptyDataComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
