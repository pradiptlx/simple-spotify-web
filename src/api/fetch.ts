/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import axios, { AxiosResponse } from "axios";
import qs from "querystring";

type errorArgFn = {
  error: string;
  statusCode: number;
};

type authorizationParams = {
  accessToken: string;
  isAccessTokenExists?: boolean;
  isTokenExpired?: boolean;
  userId?: string;
};

// **********************************************

type queryParameter = {
  limit?: number;
  offset?: number;
  position?: number;
  uris?: string[];
  uri?: string[];
};

type pathParameter = {
  [key: string]: string[] | string;
};

type searchAPIIndetifier = queryParameter & {
  type: string;
  searchValue: string;
};

type createPlaylistAPIIdentifier = {
  title: string;
  desc?: string;
  isPublic: boolean;
  collaborative: boolean;
};

type getCurrentUserPlaylistsAPIIdentifier = queryParameter & {
  publicOnly?: boolean;
};

// **********************************************

type getQueryAPIRequestFn<Q> = (
  query: Q,
  authorization: authorizationParams,
  successCallbackFn: (response: any) => void,
  errorCallbackFn: (errorArg: errorArgFn) => void
) => Promise<void>;

type getAPIRequestFn = (
  authorization: authorizationParams,
  successCallbackFn: (response: any) => void,
  errorCallbackFn: (errorArg: errorArgFn) => void
) => Promise<void> | void;

type postAPIRequestFn<Q> = (
  body: Q,
  authorization: authorizationParams,
  successCallbackFn: (response: any) => void,
  errorCallbackFn: (errorArg: errorArgFn) => void
) => Promise<void>;

// **********************************************
// API Response
interface ExternalUrlObject {
  spotify: string;
}

interface ImageObject {
  url: string;
  height: string | null;
  width: string | null;
}

interface PlaylistTracksRefObject {
  href: string;
  total: number;
}

interface ArtistObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  genres: string[];
  name: string;
  images: ImageObject[];
  uri: string;
}

export interface TrackObject {
  album: SimplifiedAlbumObject;
  artists: ArtistObject[];
  id: string;
  href: string;
  external_urls: ExternalUrlObject;
  explicit: boolean;
  name: string;
  uri: string;
}

export interface PrivateUserObject {
  display_name: string;
  email: string;
  id: string;
  images: ImageObject[];
  external_urls: ExternalUrlObject;
  displayName: string;
  spotifyUrl: string;
  imageUrl: string;
}
export interface PlaylistObject {
  id: string;
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrlObject;
  href: string;
  name: string;
  images: ImageObject[];
  public: boolean;
  tracks: PlaylistTrackObject[];
  uri: string;
  spotifyUrl: string;
}

interface PlaylistTrackObject {
  added_at: Date;
  track: TrackObject;
}

interface SimplifiedAlbumObject {
  artists: ArtistObject[];
  id: string;
  images: ImageObject[];
  name: string;
}

export interface SimplifiedPlaylistObject {
  description: string;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  public: boolean;
  tracks: PlaylistTracksRefObject[];
  imageUrl: string;
  spotifyUrl: string;
  isPublic: boolean;
  title: string;
}

// **********************************************

const searchSpotify: getQueryAPIRequestFn<searchAPIIndetifier> = async (
  { type = "track", limit = 10, searchValue = "" },
  { accessToken },
  setDataFn,
  errorCallback
) => {
  const query = qs.stringify({
    q: searchValue,
    type,
    limit,
  });
  axios
    .get(`${process.env.REACT_APP_SPOTIFY_API_URL}/search?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      if (response.data && response.data?.tracks) {
        const responseObject: TrackObject[] = response.data.tracks.items;
        setDataFn(responseObject);
      }
    })
    .catch((error) => {
      const statusCode = error.response?.status;
      errorCallback({ error, statusCode });
    });
};

const fetchCurrentUserProfile: getAPIRequestFn = (
  { accessToken },
  setUserProfileFn,
  errorCallback
) => {
  axios
    .get(`${process.env.REACT_APP_SPOTIFY_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      if (response.data) {
        const {
          display_name,
          id,
          images,
          external_urls,
        }: Partial<PrivateUserObject> = response.data;
        setUserProfileFn({
          id,
          displayName: display_name,
          imageUrl: images ? images[0].url : "",
          spotifyUrl: external_urls?.spotify,
        } as PrivateUserObject);
      }
    })
    .catch((error) => {
      const statusCode = error.response?.status;
      errorCallback({ error, statusCode });
    });
};

const createPlaylist: postAPIRequestFn<createPlaylistAPIIdentifier> = async (
  { title, desc, isPublic = false, collaborative = false },
  { userId, accessToken },
  setCurrentPlaylistFn,
  errorCallback
): Promise<void> => {
  axios
    .post(
      `${process.env.REACT_APP_SPOTIFY_API_URL}/users/${userId}/playlists`,
      {
        name: title,
        description: desc,
        public: isPublic,
        collaborative,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => {
      // eslint-disable-next-line camelcase
      const { id, name, description, external_urls }: PlaylistObject =
        response.data;
      setCurrentPlaylistFn({
        id,
        title: name,
        desc: description,
        spotifyUrl: external_urls.spotify,
      });
    })
    .catch((error) => {
      const statusCode = error.response?.status;
      errorCallback({ error, statusCode });
    });
};

const getCurrentUserPlaylists: getQueryAPIRequestFn<getCurrentUserPlaylistsAPIIdentifier> =
  async (
    { limit = 10, offset = 0, publicOnly = true },
    { accessToken },
    setPlaylistsFn,
    errorCallback
  ): Promise<void> => {
    axios
      .get(
        `${process.env.REACT_APP_SPOTIFY_API_URL}/me/playlists?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        if (response.data && response.data?.items) {
          const responseObject: SimplifiedPlaylistObject[] =
            response.data.items;
          let playlists = responseObject.map(
            ({
              id,
              description,
              name,
              images,
              external_urls,
              public: isPublic,
            }) => ({
              id,
              description,
              title: name,
              imageUrl: images[0]?.url,
              spotifyUrl: external_urls?.spotify,
              isPublic,
            })
          );
          if (publicOnly) {
            playlists = playlists.filter((playlist) => playlist.isPublic);
          }

          setPlaylistsFn(playlists);
        }
      })
      .catch((error) => {
        const statusCode = error.response?.status;
        errorCallback({ error, statusCode });
      });
  };

const getPlaylist: getQueryAPIRequestFn<pathParameter> = async (
  { playlistId },
  { accessToken },
  setCurrentPlaylistFn,
  errorCallback
): Promise<void> => {
  axios
    .get(`${process.env.REACT_APP_SPOTIFY_API_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      const { id, name, description, external_urls, tracks } = response.data;
      setCurrentPlaylistFn({
        id,
        name,
        description,
        external_urls,
        tracks,
      });
    })
    .catch((error) => {
      const statusCode = error.response?.status;
      errorCallback({ error, statusCode });
    });
};

const addTrackToPlaylist: getQueryAPIRequestFn<pathParameter & queryParameter> =
  async (
    { playlistId, position, uris },
    { accessToken },
    setResponseFn,
    errorCallback
  ): Promise<void> => {
    axios
      .post(
        `${process.env.REACT_APP_SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
        {
          uris,
          position,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data) {
          setResponseFn(response.data);
        }
      })
      .catch((error) => {
        const statusCode = error.response?.status;
        errorCallback({ error, statusCode });
      });
  };

export {
  searchSpotify,
  fetchCurrentUserProfile,
  createPlaylist,
  getPlaylist,
  addTrackToPlaylist,
  getCurrentUserPlaylists,
};
