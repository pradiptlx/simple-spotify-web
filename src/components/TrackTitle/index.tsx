import React from "react";

type trackInfoProps = {
  titleFetched: string;
  artistName: string;
  albumName: string;
};

const TrackInfo: React.FC<trackInfoProps> = (props) => {
  const { titleFetched, artistName, albumName } = props;
  return (
    <div className="px-6 py-4">
      {titleFetched && (
        <div className="font-bold dark:text-white text-md mb-2 text-center">
          {titleFetched}
        </div>
      )}

      {artistName && albumName && (
        <>
          <p className="dark:text-white">
            {artistName} - {albumName}
          </p>
        </>
      )}
    </div>
  );
};

export default TrackInfo;
