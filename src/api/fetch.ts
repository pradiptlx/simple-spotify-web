/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import axios from "axios";
import qs from "querystring";
import {
  PlaylistObject,
  PrivateUserObject,
  SimplifiedPlaylistObject,
  TrackObject,
} from "./interfaces";

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
      setCurrentPlaylistFn(response.data);
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
          const publicPlaylists: SimplifiedPlaylistObject[] = publicOnly? response.data.items.filter(
            (data: SimplifiedPlaylistObject) => data.public
          ): response.data.items;
          setPlaylistsFn(publicPlaylists);
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
