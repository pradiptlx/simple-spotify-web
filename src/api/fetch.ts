/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import axios from "axios";
import qs from "querystring";
import {
  PagingObject,
  PlaylistObject,
  PrivateUserObject,
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

type getCurrentUserPlaylistsAPIIdentifier = queryParameter & {
  publicOnly?: boolean;
};

type getAllFeaturedPlaylistsType = queryParameter & {
  country: string;
};

type getCurrentUserSavedDataType = queryParameter & {
  type: "albums" | "tracks" | "episodes";
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
    { limit = 50, offset = 0, publicOnly = true },
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
          const publicPlaylists: SimplifiedPlaylistObject[] = publicOnly
            ? response.data.items.filter(
                (data: SimplifiedPlaylistObject) => data.public
              )
            : response.data.items;
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
    const query = qs.stringify({
      limit,
      offset,
    });

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
        const responseObject: PagingObject<SavedAlbumObject> =
          response.data;
        const albums = responseObject.items.map((item) => item.album);
        setResponseFn(albums);
      } else if (type === "tracks") {
        const responseObject: PagingObject<SavedTrackObject> =
          response.data;
        const tracks = responseObject.items.map((item) => item.track);
        setResponseFn(tracks);
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

export {
  searchSpotify,
  fetchCurrentUserProfile,
  createPlaylist,
  getPlaylist,
  addTrackToPlaylist,
  getCurrentUserPlaylists,
  getAllFeaturedPlaylists,
  getCurrentUserSavedData,
};
