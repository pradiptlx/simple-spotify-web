import React from "react";
import TrackInfo from "components/TrackTitle";
import AlbumArt from "components/AlbumArt";
import { TrackObject } from "api/interfaces";
import { variantType } from "..";

const TrackVariant: React.FC<variantType<TrackObject>> = (props) => {
  const { items } = props;

  return (
    <div className="flex flex-wrap justify-center items-stretch">
      {items.map((item) => (
        <div
          key={item.id}
          className="mx-4 max-w-sm rounded overflow-hidden shadow-lg text-center transition duration-200 ease-in-out hover:bg-secondary-light dark:hover:bg-secondary-dark dark:bg-gray-700 my-10"
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
