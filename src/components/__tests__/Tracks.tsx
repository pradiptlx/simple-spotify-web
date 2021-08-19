/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { render, waitFor } from "test/Wrapper";
import Tracks, { tracksProps } from "../Tracks";

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

function renderTracks(props: tracksProps) {
  const { trackData, selectedTrackFn } = props;
  const { rendered } = render(
    <Tracks trackData={trackData} selectedTrackFn={selectedTrackFn} />,
    { route: "/" }
  );

  return {
    ...rendered,
  };
}

test("10 empty components exist in Tracks component", () => {
  const { queryAllByTestId } = renderTracks({
    trackData: [],
    selectedTrackFn: () => {},
  });
  expect(queryAllByTestId("emptyTrackComponent")).toHaveLength(10);
});

test("load tracks data", async () => {
  const { queryAllByRole, rerender } = renderTracks({
    trackData: [],
    selectedTrackFn: () => {},
  });
  await waitFor(() => expect(queryAllByRole("presentation")).toHaveLength(0), {
    timeout: 1000,
  });

  rerender(<Tracks trackData={tracksMockData} selectedTrackFn={() => {}} />);
  await waitFor(() => expect(queryAllByRole("presentation")).toHaveLength(4), {
    timeout: 1000,
  });
});
