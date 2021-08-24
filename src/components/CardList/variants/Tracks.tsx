/* eslint-disable no-console */
import React from "react";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "redux/store";
import TrackInfo from "components/TrackTitle";
import AlbumArt from "components/AlbumArt";
import { TrackObject } from "api/interfaces";
import {
  // getUserDevices,
  errorArgFn,
  getInformationUserPlayback,
  startUserPlayback,
} from "api/fetch";
import { setUserPlayback } from "redux/actions/app";
import { variantType } from "..";

const TrackVariant: React.FC<variantType<TrackObject>> = (props) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.authorization);
  const { items } = props;

  // const [devicePlayback, setDevicePlayback] = React.useState({ id: "" });

  const playerHandler = async (uriSpotify: string) => {
    // await getUserDevices(
    //   { accessToken },
    //   (response) => {
    //     console.log(response);
    //     setDevicePlayback({ id: response.devices[0].id });
    //   },
    //   ({ statusCode }: errorArgFn) => {
    //     console.error(statusCode);
    //   }
    // );

    await startUserPlayback(
      { uris: [uriSpotify], position_ms: 0 },
      { accessToken },
      ({
        isPlaybackError,
        playbackMessage,
      }: {
        isPlaybackError: boolean;
        playbackMessage: string;
      }) => {
        dispatch(setUserPlayback({ isPlaybackError, playbackMessage }));
      },
      ({ statusCode }: errorArgFn) => {
        console.error(statusCode);
      }
    );

    await getInformationUserPlayback(
      { accessToken },
      (response) => {
        dispatch(setUserPlayback({ currentPlayback: response.item }));
      },
      ({ statusCode }: errorArgFn) => {
        console.error(statusCode);
      }
    );
  };

  return (
    <div className="flex flex-wrap justify-center items-stretch">
      {items.map((item) => (
        <div
          key={item.id}
          className="mx-4 max-w-sm rounded overflow-hidden shadow-lg text-center transition duration-200 ease-in-out hover:bg-secondary-light dark:hover:bg-secondary-dark dark:bg-gray-700 my-10"
        >
          <AlbumArt
            albumArtFetched={item.album.images[0].url}
            altText={item.name}
            urlSpotify={item.external_urls.spotify}
            playerHandler={() => {
              playerHandler(item.uri);
            }}
          />
          <TrackInfo
            titleFetched={item.name}
            artistName={item.artists[0].name}
            albumName={item.album.name}
          />
        </div>
      ))}
    </div>
  );
};

export default TrackVariant;
