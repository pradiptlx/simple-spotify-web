import React from "react";
import { SimplifiedPlaylistObject } from "api/interfaces";
import { variantType } from "..";

const PlaylistVariant: React.FC<variantType<SimplifiedPlaylistObject>> = (
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
          <img
            className="w-full rounded-lg"
            src={item.images[0].url}
            alt={item.name}
          />
          <div className="px-6 py-4">
            <div className="dark:text-white font-bold text-xl mb-2">
              {item.name}
            </div>
            <div className="dark:text-white font-bold text-sm mb-2">
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistVariant;
