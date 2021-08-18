/* eslint-disable react/no-array-index-key */
import React from "react";
import { useAppSelector as useSelector } from "redux/store";
import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import AlbumOutlinedIcon from "@material-ui/icons/AlbumOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import LibraryMusicOutlinedIcon from "@material-ui/icons/LibraryMusicOutlined";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
    position: "relative",
    overflow: "auto",
    height: "100%",
    borderTopRightRadius: ".75rem",
  },
  listSection: {
    backgroundColor: "inherit",
  },
  listPlaylistSection: {
    backgroundColor: "inherit",
    overflow: "auto",
    maxHeight: 400,
  },
  listHeader: {
    color: theme.palette.text.primary,
    fontSize: "1.3rem",
  },
  listItem: {
    paddingBottom: 0,
    paddingTop: 0,
    margin: ".2rem auto",
    width: "100%",
  },
  ul: {
    backgroundColor: "inherit",
    color: theme.palette.text.primary,
  },
  playlistItem: {
    paddingBottom: 0,
  },
}));

const emptyDataComponent = () => (
  <div data-testid="emptySkeleton">
    {new Array(20).fill(0).map((item, idx) => (
      <Box
        key={`playlist_${idx}`}
        style={{
          paddingBottom: 0,
          paddingTop: 0,
          margin: ".2rem auto",
          width: "15rem",
        }}
        data-testid="emptySkeletonItem"
      >
        <Skeleton key={`skeleton_${idx}`} variant="text" />
      </Box>
    ))}
  </div>
);

const Sidebar = (): React.ReactElement => {
  const { currentUserPlaylists } = useSelector((state) => state.app);

  const classes = useStyles();

  return (
    <div className="fixed">
      <List className={classes.root} subheader={<li />}>
        <li key="section-my-library" className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listHeader}>
              My Library
            </ListSubheader>
            <Divider component="li" variant="inset" />
            <ListItem className={classes.listItem}>
              <NavLink
                to="/me/tracks"
                activeClassName="text-green-400 dark:text-green-200"
              >
                <ListItemText>
                  <LibraryMusicOutlinedIcon /> Tracks
                </ListItemText>
              </NavLink>
            </ListItem>

            <ListItem className={classes.listItem}>
              <NavLink
                to="/me/albums"
                activeClassName="text-green-400 dark:text-green-200"
              >
                <ListItemText>
                  <AlbumOutlinedIcon /> Albums
                </ListItemText>
              </NavLink>
            </ListItem>

            <ListItem className={classes.listItem}>
              <NavLink
                to="/me/artists"
                activeClassName="text-green-400 dark:text-green-200"
              >
                <ListItemText>
                  <PeopleAltOutlinedIcon /> Artists
                </ListItemText>
              </NavLink>
            </ListItem>
          </ul>
        </li>
        <Divider component="li" />
        <li key="section-playlists" className={classes.listPlaylistSection}>
          <ul className={classes.ul}>
            <ListSubheader className={classes.listHeader}>
              Playlists
            </ListSubheader>
            <Divider component="li" variant="inset" />
            {currentUserPlaylists.length
              ? currentUserPlaylists.map((playlist) => (
                  <ListItem
                    key={`playlist-${playlist.id}`}
                    className={classes.playlistItem}
                  >
                    <NavLink
                      to={`/playlist/${playlist.id}`}
                      activeClassName="text-green-400 dark:text-green-200"
                    >
                      <ListItemText>{playlist.name}</ListItemText>
                    </NavLink>
                  </ListItem>
                ))
              : emptyDataComponent()}
          </ul>
        </li>
      </List>
    </div>
  );
};

export default Sidebar;
