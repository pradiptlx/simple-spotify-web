import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import CardList from "components/CardList";
import Sidebar from "components/Sidebar";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { ArtistObject } from "api/interfaces";
import { errorArgFn, getCurrentUserSavedData } from "api/fetch";
import { setExpiredTokenTime } from "redux/actions/authorization";
import { useHistory } from "react-router-dom";

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
          animation="pulse"
          width={256}
          height={256}
          style={{
            borderRadius: "0.25rem",
          }}
        />
      </Box>
    ))}
  </div>
);
const ArtistPage = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { accessToken } = useSelector((state) => state.authorization);
  const [artists, setArtists] = React.useState<ArtistObject[]>([]);

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
    if (!accessToken) return;
    await getCurrentUserSavedData(
      { type: "following", limit: 50 }, // following is artists api type
      { accessToken },
      setArtists,
      errorFetchingHandler
    );
  }, [accessToken]);

  React.useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid grid-cols-sidebar">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">
            My Following Artists
          </h1>
          <CardList
            cardListItems={artists}
            emptyDataComponentFn={emptyDataComponent}
            type="artists"
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
