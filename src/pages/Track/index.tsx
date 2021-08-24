import React from "react";
import { errorArgFn, getCurrentUserSavedData } from "api/fetch";
import Sidebar from "components/Sidebar";
import { useHistory } from "react-router-dom";
import { setExpiredTokenTime } from "redux/actions/authorization";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { TrackObject } from "api/interfaces";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import CardList from "components/CardList";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {
  setCurrentUserPlayback,
  setUserPlaybackResponse,
} from "redux/actions/app";

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

export type playerResponseType = {
  title: string;
  isError: boolean;
  message: string;
};

const TrackPage = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { accessToken, isAccessTokenExists } = useSelector(
    (state) => state.authorization
  );
  const { currentUserPlaylists, userPlayback, currentPlayback } = useSelector(
    (state) => state.app
  );
  const [tracks, setTracks] = React.useState<TrackObject[]>([]);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [currentPlayerResponse, setCurrentPlayerResponse] =
    React.useState<playerResponseType>({} as playerResponseType);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

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

  const fetchHandler = React.useCallback(async () => {
    if (!accessToken || !isAccessTokenExists) return;

    await getCurrentUserSavedData(
      { type: "tracks", limit: 50, offset: 0 },
      { accessToken },
      setTracks,
      errorFetchingHandler
    );
  }, [accessToken, isAccessTokenExists, currentUserPlaylists]);

  React.useEffect(() => {
    fetchHandler();

    return () => {
      setTracks([]);
    };
  }, [fetchHandler]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (userPlayback.playbackMessage !== "" && "name" in currentPlayback) {
      setOpenSnackbar(true);
      setCurrentPlayerResponse({
        title: currentPlayback.name,
        message: userPlayback.playbackMessage,
        isError: userPlayback.isPlaybackError,
      });
      timer = setTimeout(() => {
        setOpenSnackbar(false);
        dispatch(
          setUserPlaybackResponse({
            playbackMessage: "",
            isPlaybackError: false,
          })
        );
        dispatch(
          setCurrentUserPlayback({ currentPlayback: {} as TrackObject })
        );
      }, 6000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [userPlayback, currentPlayback]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid md:grid-cols-sidebar">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col justify-center items-center">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={currentPlayerResponse?.isError ? "error" : "success"}
            >
              {currentPlayerResponse?.title || ""} 🎵{" "}
              {currentPlayerResponse?.message}
            </Alert>
          </Snackbar>
          <h1 className="text-3xl dark:text-white my-5">My Saved Tracks</h1>
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

export default TrackPage;
