import React from "react";
import TrackInfo from "components/TrackTitle";
import AlbumArt from "components/AlbumArt";
import { TrackObject } from "api/interfaces";
import { variantType } from "..";

const TrackVariant: React.FC<variantType<TrackObject>> = (
  props
) => {
  const { items } = props;

  return (
    <div className="flex flex-wrap justify-center items-stretch space-x-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="max-w-sm rounded overflow-hidden shadow-lg text-center dark:bg-gray-700 my-10"
        >
          <AlbumArt
            albumArtFetched={item.album.images[0].url}
            altText={item.name}
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
