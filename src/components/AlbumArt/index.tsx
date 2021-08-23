import React from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { Theme, makeStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";

type albumArtProps = {
  albumArtFetched?: string;
  altText?: string;
  isSelected?: boolean;
  urlSpotify?: string;
  playerHandler?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  playIcon: {
    fontSize: "4rem",
    position: "absolute",
    bottom: "2px",
    right: "3px",
    color:
      theme.palette.type === "dark"
        ? theme.palette.secondary.dark
        : theme.palette.secondary.light,
  },
}));

const AlbumArt: React.FC<albumArtProps> = (props) => {
  const classes = useStyles();
  const {
    albumArtFetched,
    altText = "",
    isSelected = false,
    urlSpotify,
    playerHandler,
  } = props;
  const [isHover, setIsHover] = React.useState(false);

  const onHoverImageHandler = () => {
    setIsHover(true);
  };

  const onLeaveMouseHandler = () => {
    setIsHover(false);
  };

  return (
    <div
      className="wrapper-img relative"
      onMouseLeave={onLeaveMouseHandler}
      onMouseEnter={onHoverImageHandler}
    >
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
      {typeof urlSpotify !== "undefined" &&
        typeof playerHandler !== "undefined" && (
          <Zoom in={isHover}>
            <PlayCircleFilledIcon
              onClick={() => {
                playerHandler();
                window.open(urlSpotify, "_blank");
              }}
              role="button"
              className={classes.playIcon}
            />
          </Zoom>
        )}
    </div>
  );
};

export default AlbumArt;
