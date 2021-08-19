import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import Collapse from "@material-ui/core/Collapse";
import { searchSpotify, createPlaylist, addTrackToPlaylist } from "api/fetch";
import { TrackObject, PlaylistObject } from "api/interfaces";
import Searchbar from "../../components/Searchbar";
import Tracks from "../../components/Tracks";
import Alert from "../../components/Alert";
import PlaylistForm from "../../components/Playlists/Form";
import { setExpiredTokenTime } from "../../redux/actions/authorization";

type playlistValueIdentifier = {
  titlePlaylist?: string;
  descPlaylist?: string;
};

export type selectedTrackIdentifier = {
  [key: string]: {
    active: boolean;
    uri: string;
  };
};

function CreatePlaylist(): React.ReactElement {
  const dispatch = useDispatch();
  const [dataFetched, setDataFetched] = React.useState<TrackObject[]>([]);
  const [selectedTrack, setSelectedTrack] =
    React.useState<selectedTrackIdentifier>({});
  const [countSelectedTrack, setCountSelectedTrack] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");

  const { accessToken } = useSelector((state) => state.authorization);

  const userProfile = useSelector((state) => state.user);
  const [currentPlaylist, setCurrentPlaylist] =
    React.useState<PlaylistObject>();
  const [playlistValue, setPlaylistValue] =
    React.useState<playlistValueIdentifier>();
  const [isDoneCreatePlaylist, setIsDoneCreatePlaylist] = React.useState(false);
  const [isErrorCreatePlaylist, setIsErrorCreatePlaylist] =
    React.useState(false);

  const memoTracks = (tracks: TrackObject[]) => {
    const filteredTracks = dataFetched.filter(
      (track) => selectedTrack?.[track.id]?.active
    );
    setDataFetched([...filteredTracks, ...tracks]);
  };

  const onInputSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const onSearchHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchSpotify(
      { type: "track", limit: 10, searchValue },
      { accessToken },
      memoTracks,
      ({ statusCode }) => {
        if (statusCode === 400 || statusCode === 401) {
          dispatch(
            setExpiredTokenTime({
              expiredTokenTime: 0,
              isTokenExpired: true,
            })
          );
        }
      }
    );
  };

  const onPlaylistFormHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPlaylistValue({
      ...playlistValue,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitPlaylistFormHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const { titlePlaylist = "", descPlaylist = "" } = playlistValue || {};
    if (titlePlaylist.length >= 10 && descPlaylist.length >= 20) {
      let isCreatePlaylistError = false;
      createPlaylist(
        {
          title: titlePlaylist,
          desc: descPlaylist,
          isPublic: false,
          collaborative: false,
        },
        { userId: userProfile?.id, accessToken },
        setCurrentPlaylist,
        () => {
          isCreatePlaylistError = true;
          setIsErrorCreatePlaylist(true);
        }
      );
      if (!isCreatePlaylistError) {
        setIsDoneCreatePlaylist(true);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert("Minimal Title 10 Kata & Description 20 Kata");
    }
  };

  React.useEffect(() => {
    if (
      accessToken &&
      isDoneCreatePlaylist &&
      Object.keys(selectedTrack).length &&
      currentPlaylist?.id
    ) {
      const uriSelectedTrack = Object.keys(selectedTrack).map(
        (trackId) => selectedTrack[trackId].uri
      );
      addTrackToPlaylist(
        {
          playlistId: currentPlaylist.id,
          uris: uriSelectedTrack,
        },
        { accessToken },
        () => {
          setTimeout(() => {
            setIsDoneCreatePlaylist(false);
            setPlaylistValue({});
          }, 1000);
        },
        () => {
          setIsErrorCreatePlaylist(true);
        }
      );
    }
  }, [selectedTrack, isDoneCreatePlaylist, accessToken, currentPlaylist]);

  // Handling playlist form display
  React.useEffect(() => {
    const tracks = Object.values(selectedTrack); // return {active: bool, uri: string}
    setCountSelectedTrack(tracks.filter((track) => track.active).length);
  }, [selectedTrack]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      {isDoneCreatePlaylist && (
        <Alert
          titlePlaylist={playlistValue?.titlePlaylist}
          urlPlaylist={currentPlaylist?.spotifyUrl}
          isError={isErrorCreatePlaylist}
        />
      )}
      <div className="flex flex-col min-h-screen">
        <div className="m-auto">
          <Searchbar
            onInputSearchHandler={onInputSearchHandler}
            onSearchHandler={onSearchHandler}
            searchValue={searchValue}
          />
        </div>

        <div className="mt-5 flex flex-col">
          <Collapse
            in={countSelectedTrack > 0}
            style={{
              margin: "auto",
            }}
          >
            <div id="playlistForm" className="m-auto">
              <PlaylistForm
                titlePlaylistValue={playlistValue?.titlePlaylist}
                descPlaylistValue={playlistValue?.descPlaylist}
                onSubmitPlaylistFormHandler={onSubmitPlaylistFormHandler}
                onPlaylistFormHandler={onPlaylistFormHandler}
              />
            </div>
          </Collapse>
          {dataFetched.length > 0 && (
            <Tracks
              trackData={dataFetched}
              selectedTrackFn={setSelectedTrack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePlaylist;
