const artistsMockData = [
  {
    name: "abc",
    id: "1",
    href: "http://localhost",
    external_urls: { spotify: "http://localhost" },
    genres: ["pop"],
    images: [{ url: "", height: null, width: null }],
    type: "artist",
    uri: "",
  },
];

const albumMockData = {
  id: "1",
  artists: artistsMockData,
  images: [{ url: "", height: null, width: null }],
  name: "album 1",
  type: "album",
  external_urls: { spotify: "http://localhost" },
  uri: "",
  href: "",
};

const tracksMockData = [
  {
    artists: artistsMockData,
    album: albumMockData,
    name: "track 1",
    id: "1",
    href: "http://localhost:3000/1",
    external_urls: { spotify: "http://localhost" },
    type: "tracks",
    explicit: false,
    uri: "nah1",
  },
  {
    artists: artistsMockData,
    album: albumMockData,
    name: "track 2",
    id: "2",
    href: "http://localhost:3000/1",
    external_urls: { spotify: "http://localhost" },
    type: "tracks",
    explicit: false,
    uri: "nah2",
  },
  {
    artists: artistsMockData,
    album: albumMockData,
    name: "track 3",
    id: "3",
    href: "http://localhost:3000/1",
    external_urls: { spotify: "http://localhost" },
    type: "tracks",
    explicit: false,
    uri: "nah3",
  },
  {
    artists: artistsMockData,
    album: albumMockData,
    name: "track 4",
    id: "4",
    href: "http://localhost:3000/1",
    external_urls: { spotify: "http://localhost" },
    type: "tracks",
    explicit: false,
    uri: "nah4",
  },
];

export { albumMockData, artistsMockData, tracksMockData };
