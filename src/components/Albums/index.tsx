import React from "react";
import { AlbumObject } from "api/interfaces";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import AlbumArt from "components/AlbumArt";
import { NavLink } from "react-router-dom";

type albumsType = {
  albums: AlbumObject[];
};

const emptyDataComponent = () =>
  new Array(10).fill(0).map((_, idx) => (
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
  ));

const Albums: React.FC<albumsType> = (props) => {
  const { albums } = props;

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return albums.length && !isLoading ? (
    <>
      {albums.map((album, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <NavLink key={`${album.id}_${idx}`} to={`/album/${album.id}`}>
          <div
            className="relative flex-shrink-0 rounded-lg shadow-lg text-center mt-10 dark:bg-gray-700"
            role="presentation"
          >
            <div className="max-w-sm rounded-lg overflow-hidden">
              <AlbumArt
                albumArtFetched={album.images ? album.images[0].url : ""}
                altText={album.name}
              />
            </div>

            <div className="absolute bottom-0 bg-black opacity-80 h-1/5 w-full flex flex-col overflow-hidden">
              <div className="m-auto">
                <p className="text-md text-white">{album.name}</p>
              </div>
              <div className="m-auto">
                <h1 className="text-sm text-white">{album.artists[0].name}</h1>
              </div>
            </div>
          </div>
        </NavLink>
      ))}
    </>
  ) : (
    <>{emptyDataComponent()}</>
  );
};

export default Albums;
