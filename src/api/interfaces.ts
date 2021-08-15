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
  tracks: PlaylistTracksRefObject[];
}