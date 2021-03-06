/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import axios from "axios";
import qs from "querystring";
import {
  ArtistObject,
  CursorPagingObject,
  PagingObject,
  PlaylistObject,
  SavedAlbumObject,
  SavedTrackObject,
  SimplifiedPlaylistObject,
  TrackObject,
} from "./interfaces";

export type errorArgFn = {
  error: string;
  statusCode?: number;
};

export type authorizationParams = {
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

type getAllFeaturedPlaylistsType = queryParameter & {
  country: string;
};

type getCurrentUserSavedDataType = queryParameter & {
  type: "albums" | "tracks" | "following" | "playlists";
};

type startUserPlaybackType = {
  context_uri?: string;
  uris?: string[];
  offset?: number;
  position_ms?: number;
  device_id?: string;
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
        setUserProfileFn(response.data);
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

const getPlaylist: getQueryAPIRequestFn<pathParameter> = async (
  { playlistId },
  { accessToken },
  setCurrentPlaylistFn,
  errorCallback
): Promise<void> => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SPOTIFY_API_URL}/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseObject: PlaylistObject = response.data;
    setCurrentPlaylistFn(responseObject);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorCallback({
        error: error.message,
        statusCode: error.response?.status,
      });
    }
  }
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

const getAllFeaturedPlaylists: getQueryAPIRequestFn<getAllFeaturedPlaylistsType> =
  async (
    { country = "ID", limit = 50, offset = 0 },
    { accessToken },
    setResponseFn,
    errorCallback
  ): Promise<void> => {
    const query = qs.stringify({
      country,
      limit,
      offset,
    });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SPOTIFY_API_URL}/browse/featured-playlists?${query}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseObject: SimplifiedPlaylistObject[] =
        response.data.playlists.items;
      setResponseFn(responseObject);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorCallback({
          error: error.message,
          statusCode: error.response?.status,
        });
      }
    }
  };

const getCurrentUserSavedData: getQueryAPIRequestFn<getCurrentUserSavedDataType> =
  async (
    { limit = 50, offset = 0, type },
    { accessToken },
    setResponseFn,
    errorCallback
  ): Promise<void> => {
    const queryParams =
      type === "following"
        ? { limit, offset, type: "artist" }
        : { limit, offset };
    const query = qs.stringify(queryParams);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SPOTIFY_API_URL}/me/${type}?${query}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (type === "albums") {
        const responseObject: PagingObject<SavedAlbumObject> = response.data;
        const albums = responseObject.items.map((item) => item.album);
        setResponseFn(albums);
      } else if (type === "tracks") {
        const responseObject: PagingObject<SavedTrackObject> = response.data;
        const tracks = responseObject.items.map((item) => item.track);
        setResponseFn(tracks);
      } else if (type === "following") {
        const responseObject: CursorPagingObject<ArtistObject> =
          response.data.artists;
        const artists = responseObject.items.map((item) => item);
        setResponseFn(artists);
      } else if (type === "playlists") {
        const responseObject: PagingObject<SimplifiedPlaylistObject> =
          response.data;
        const playlists: SimplifiedPlaylistObject[] = responseObject.items;
        setResponseFn(playlists);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorCallback({
          error: error.message,
          statusCode: error.response?.status,
        });
      }
    }
  };

const getInformationUserPlayback: getAPIRequestFn = async (
  { accessToken },
  setResponseFn,
  errorCallbackFn
) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SPOTIFY_API_URL}/me/player`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    setResponseFn(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorCallbackFn({
        error: error.message,
        statusCode: error.response?.status,
      });
    }
  }
};

const getUserDevices: getAPIRequestFn = async (
  { accessToken },
  setResponseFn,
  errorCallbackFn
) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SPOTIFY_API_URL}/me/player/devices`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    setResponseFn(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorCallbackFn({
        error: error.message,
        statusCode: error.response?.status,
      });
    }
  }
};

const startUserPlayback: getQueryAPIRequestFn<startUserPlaybackType> = async (
  { context_uri, uris, offset, position_ms, device_id },
  { accessToken },
  setResponseFn,
  errorCallbackFn
) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_SPOTIFY_API_URL}/me/player/play`,
      {
        context_uri,
        uris,
        offset,
        position_ms,
        device_id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204 || response.status === 200) {
      setResponseFn({
        isPlaybackError: false,
        playbackMessage: "Playing on active device.",
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let responseErrorMsg = error.message;
      if (error.response?.status === 403) {
        responseErrorMsg = "User must subscribed to premium account";
      } else if (error.response?.status === 404) {
        responseErrorMsg = "Active device not found";
      }
      errorCallbackFn({
        error: responseErrorMsg,
        statusCode: error.response?.status,
      });
    }
  }
};

export {
  searchSpotify,
  fetchCurrentUserProfile,
  createPlaylist,
  getPlaylist,
  addTrackToPlaylist,
  getAllFeaturedPlaylists,
  getCurrentUserSavedData,
  startUserPlayback,
  getInformationUserPlayback,
  getUserDevices,
};
