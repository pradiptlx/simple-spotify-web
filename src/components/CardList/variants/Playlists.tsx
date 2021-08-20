import React from "react";
import { SimplifiedPlaylistObject } from "api/interfaces";
import { variantType } from "..";

const PlaylistVariant: React.FC<variantType<SimplifiedPlaylistObject>> = (
  props
) => {
  const { items } = props;

  return (
    <div className="flex flex-wrap justify-center items-stretch">
      {items.map((item) => (
        <div
          key={item.id}
          className="mx-4 max-w-sm rounded overflow-hidden shadow-lg text-center transition duration-200 ease-in-out hover:bg-secondary-light dark:hover:bg-secondary-dark dark:bg-gray-700 my-10"
          onClick={() => {
            window.open(item.external_urls.spotify, "_blank");
          }}
          onKeyPress={() => {
            window.open(item.external_urls.spotify, "_blank");
          }}
          role="button"
          tabIndex={0}
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
