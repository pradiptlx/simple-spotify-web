import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { useHistory } from "react-router-dom";
import { setExpiredTokenTime } from "redux/actions/authorization";
import { getCurrentUserPlaylists, getAllFeaturedPlaylists } from "api/fetch";
import { SimplifiedPlaylistObject } from "api/interfaces";
import Sidebar from "components/Sidebar";
import { setPageData } from "redux/actions/app";
import CardList from "components/CardList";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

const emptyDataComponent = () => (
  <>
    {new Array(10).fill(0).map((_, idx) => (
      <Box
        // eslint-disable-next-line react/no-array-index-key
        key={`box_${idx}`}
        mt={10}
        style={{
          maxWidth: "24rem",
          overflow: "hidden",
        }}
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
        <Box py={4} px={6}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Box>
      </Box>
    ))}
  </>
);

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
            <CardList
              type="playlists"
              cardListItems={featuredPlaylists}
              emptyDataComponentFn={emptyDataComponent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
