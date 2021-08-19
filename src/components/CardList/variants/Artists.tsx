import React from "react";
import { ArtistObject } from "api/interfaces";
import { variantType } from "..";

const ArtistVariant: React.FC<variantType<ArtistObject>> = (props) => {
  const { items } = props;

  return (
    <div className="flex flex-wrap justify-center items-stretch space-x-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center rounded overflow-hidden shadow-lg text-center transition duration-200 ease-in-out hover:bg-secondary-light dark:hover:bg-secondary-dark dark:bg-gray-700 dark:bg-opacity-10 my-10"
        >
          <img
            className="rounded-full"
            src={item.images[0].url}
            alt={item.name}
            style={{ width: "256px", height: "256px" }}
          />
          <div className="px-6 py-4">
            <div className="dark:text-white font-bold text-lg mb-2">
              {item.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtistVariant;
