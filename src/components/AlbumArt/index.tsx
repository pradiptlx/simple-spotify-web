import React from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

type albumArtProps = {
  albumArtFetched?: string;
  altText?: string;
  isSelected?: boolean;
};

const AlbumArt: React.FC<albumArtProps> = (props) => {
  const { albumArtFetched, altText = "", isSelected = false } = props;
  return (
    <div className="wrapper-img relative">
      {albumArtFetched ? (
        <img className="w-full" src={albumArtFetched} alt={altText} />
      ) : (
        ""
      )}
      {isSelected && (
        <CheckCircleOutlineIcon
          style={{
            fontSize: 24,
            position: "absolute",
            top: "2px",
            right: "3px",
            color: "green",
          }}
        />
      )}
    </div>
  );
};

export default AlbumArt;
