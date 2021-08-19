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

const TrackPage = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { accessToken, isAccessTokenExists } = useSelector(
    (state) => state.authorization
  );
  const { currentUserPlaylists } = useSelector((state) => state.app);

  const [tracks, setTracks] = React.useState<TrackObject[]>([]);

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

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid md:grid-cols-sidebar">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>

        <CardList
          type="tracks"
          cardListItems={tracks}
          emptyDataComponentFn={emptyDataComponent}
        />
      </div>
    </div>
  );
};

export default TrackPage;
