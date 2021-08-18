import { AlbumObject } from "api/interfaces";
import AlbumArt from "components/AlbumArt";
import React from "react";
import { variantType } from "..";

const AlbumVariant: React.FC<variantType<AlbumObject>> = (props) => {
  const { items } = props;

  return (
    <div className="flex flex-wrap justify-center items-stretch space-x-4">
      {items.map((item) => (
        <div
          className="relative flex-shrink-0 rounded-lg shadow-lg text-center mt-10 dark:bg-gray-700"
          role="presentation"
        >
          <div className="max-w-sm rounded-lg overflow-hidden">
            <AlbumArt
              albumArtFetched={item.images ? item.images[0].url : ""}
              altText={item.name}
            />
          </div>

          <div className="absolute bottom-0 bg-black rounded-b-md opacity-80 h-1/5 w-full flex flex-col overflow-hidden">
            <div className="m-auto">
              <p className="text-md text-white">{item.name}</p>
            </div>
            <div className="m-auto">
              <h1 className="text-sm text-white">{item.artists[0].name}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumVariant;
