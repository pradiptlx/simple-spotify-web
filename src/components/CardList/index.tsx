import React from "react";
import AlbumVariant from "./variants/Albums";
import ArtistVariant from "./variants/Artists";
import PlaylistVariant from "./variants/Playlists";
import TrackVariant from "./variants/Tracks";

type cardListType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardListItems: any[];
  type: "albums" | "tracks" | "playlists" | "artists";
  emptyDataComponentFn: () => React.ReactElement;
};

export type variantType<T> = {
  items: T[];
};

const CardList: React.FC<cardListType> = (props) => {
  const { cardListItems, type, emptyDataComponentFn } = props;
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  const renderVariant = (): React.ReactElement => {
    if (type === "albums") {
      return <AlbumVariant items={cardListItems} />;
    }
    if (type === "artists") {
      return <ArtistVariant items={cardListItems} />;
    }
    if (type === "playlists") {
      return <PlaylistVariant items={cardListItems} />;
    }

    if (type === "tracks") {
      return <TrackVariant items={cardListItems} />;
    }

    return <></>;
  };

  return cardListItems.length && !isLoading
    ? renderVariant()
    : emptyDataComponentFn();
};

export default CardList;
