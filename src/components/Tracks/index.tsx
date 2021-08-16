/* eslint-disable react/forbid-prop-types */
import React from "react";
// import Mock from "../../data";
import { selectedTrackIdentifier } from "pages/CreatePlaylist";
import { TrackObject } from "api/interfaces";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import AlbumArt from "../AlbumArt";
import TrackInfo from "../TrackTitle";

type tracksProps = {
  trackData: TrackObject[];
  selectedTrackFn?: React.Dispatch<
    React.SetStateAction<selectedTrackIdentifier>
  >;
};

const Tracks: React.FC<tracksProps> = (props) => {
  const { trackData, selectedTrackFn } = props;
  const [selectedTrack, setSelectedTrack] =
    React.useState<selectedTrackIdentifier>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const trackOnClickHandler = (idTrack: string, uriTrack: string) => {
    const newTracks = {
      ...selectedTrack,
      [idTrack]: { active: !selectedTrack[idTrack]?.active, uri: uriTrack },
    };
    setSelectedTrack(newTracks);
    if (selectedTrackFn) {
      selectedTrackFn(newTracks);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
          <Skeleton
            variant="circle"
            style={{
              borderRadius: "9999px",
              padding: "1 10",
              margin: "5 auto",
              width: "120px",
              height: "42px",
            }}
          />
        </Box>
      </Box>
    ));

  return trackData.length && !isLoading ? (
    <>
      {trackData.map((data) => (
        <div
          className={`tracks flex-shrink-0 rounded-lg shadow-lg text-center mt-10 dark:bg-gray-700 ${
            !selectedTrack[data.id]?.active
              ? "transition duration-500 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-900 transform hover:-translate-y-2 hover:scale-105"
              : ""
          }`}
          key={data.uri}
          onClick={() => {
            trackOnClickHandler(data.id, data.uri);
          }}
          role="presentation"
        >
          <div className="max-w-sm rounded-lg overflow-hidden">
            <AlbumArt
              albumArtFetched={data.album.images[0].url}
              altText={data.name}
              isSelected={selectedTrack[data.id]?.active}
            />
            <TrackInfo
              titleFetched={data.name}
              artistName={data.artists[0].name}
              albumName={data.album.name}
            />
            <button
              //   onClick={() => window.open(data.external_urls.spotify, "_blank")}
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 my-5 rounded-full"
            >
              {selectedTrack[data.id]?.active ? "Deselect" : "Select"}
            </button>
          </div>
        </div>
      ))}
    </>
  ) : (
    <>{emptyDataComponent()}</>
  );
};

export default Tracks;
