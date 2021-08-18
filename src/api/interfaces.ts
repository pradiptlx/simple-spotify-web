/* eslint-disable camelcase */
// List of Spotify Objects

export interface ExternalUrlObject {
  spotify: string;
}

export interface ImageObject {
  url: string;
  height: string | null;
  width: string | null;
}

export interface PlaylistTracksRefObject {
  href: string;
  total: number;
}

export interface ArtistObject {
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

export interface FollowersObject {
  href: string;
  total: number;
}

export interface PrivateUserObject {
  display_name: string;
  email: string;
  id: string;
  images: ImageObject[];
  external_urls: ExternalUrlObject;
  country: string;
  followers: FollowersObject;
}

export interface PublicUserObject {
  display_name: string;
  id: string;
  images: ImageObject[];
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
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
  tracks: PagingObject<PlaylistTrackObject>;
  uri: string;
  spotifyUrl: string;
}

export interface PlaylistTrackObject {
  added_at: Date;
  track: TrackObject;
}

export interface SimplifiedAlbumObject {
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
  tracks: PlaylistTracksRefObject;
}

export interface AlbumObject {
  album_type: string;
  artists: ArtistObject[];
  external_urls: ExternalUrlObject;
  genres: string[];
  href: string;
  id: string;
  images: ImageObject[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  tracks: TrackObject;
  uri: string;
}

export interface SavedAlbumObject {
  added_at: Date;
  album: AlbumObject;
}

export interface SavedTrackObject {
  added_at: Date;
  track: TrackObject;
}

export interface PagingObject<T> {
  href: string;
  items: T[];
  offset: number;
  total: number;
  previous: string;
  next: string;
}

export interface CursorPagingObject<T> {
  items: T[];
  limit: number;
  total: number;
  previous: string;
  next: string;
  cursors: CursorObject;
}

export interface CursorObject {
  after: string;
}
