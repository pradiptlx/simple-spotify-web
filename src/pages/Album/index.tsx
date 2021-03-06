import React from "react";
import { useHistory } from "react-router-dom";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { setExpiredTokenTime } from "redux/actions/authorization";
import { AlbumObject } from "api/interfaces";
import { getCurrentUserSavedData } from "api/fetch";
import Sidebar from "components/Sidebar";
import CardList from "components/CardList";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

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
          width={600}
          height="300px"
          style={{
            borderRadius: "0.25rem",
          }}
        />
      </Box>
    ))}
  </div>
);

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
  }, [accessToken, isAccessTokenExists]);

  React.useEffect(() => {
    fetchHandler();

    return () => {
      setAlbums([]);
    };
  }, [fetchHandler]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="grid md:grid-cols-sidebar">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">My Albums</h1>
          <CardList
            type="albums"
            cardListItems={albums}
            emptyDataComponentFn={emptyDataComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
