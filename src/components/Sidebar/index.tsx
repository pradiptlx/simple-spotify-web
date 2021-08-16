import React from "react";
import { SimplifiedPlaylistObject } from "api/interfaces";
import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import AlbumOutlinedIcon from "@material-ui/icons/AlbumOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import LibraryMusicOutlinedIcon from "@material-ui/icons/LibraryMusicOutlined";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
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
  listHeader: {
    color: theme.palette.text.primary,
    fontSize: "1.3rem",
  },
  listItem: {
    paddingBottom: 0,
    paddingTop: 0,
    margin: ".2rem auto",
  },
  ul: {
    backgroundColor: "inherit",
    color: theme.palette.text.primary,
  },
  playlistItem: {
    paddingBottom: 0,
  },
}));

type sidebarProps = {
  userPlaylists: SimplifiedPlaylistObject[];
};

const Sidebar: React.FC<sidebarProps> = (props) => {
  const { userPlaylists } = props;

  const classes = useStyles();

  return (
    <List className={classes.root} subheader={<li />}>
      <li key="section-my-library" className={classes.listSection}>
        <ul className={classes.ul}>
          <ListSubheader className={classes.listHeader}>
            My Library
          </ListSubheader>
          <Divider component="li" variant="inset" />
          <ListItem className={classes.listItem}>
            <NavLink to="/me/tracks">
              <ListItemText>
                <LibraryMusicOutlinedIcon /> Tracks
              </ListItemText>
            </NavLink>
          </ListItem>

          <ListItem className={classes.listItem}>
            <NavLink to="/me/albums">
              <ListItemText>
                <AlbumOutlinedIcon /> Albums
              </ListItemText>
            </NavLink>
          </ListItem>

          <ListItem className={classes.listItem}>
            <NavLink to="/me/artists">
              <ListItemText>
                <PeopleAltOutlinedIcon /> Artists
              </ListItemText>
            </NavLink>
          </ListItem>
        </ul>
      </li>
      <Divider component="li" />
      <li key="section-playlists" className={classes.listSection}>
        <ul className={classes.ul}>
          <ListSubheader className={classes.listHeader}>
            Playlists
          </ListSubheader>
          <Divider component="li" variant="inset" />
          {userPlaylists.map((playlist) => (
            <ListItem
              key={`playlist-${playlist.id}`}
              className={classes.playlistItem}
            >
              <NavLink to={`/playlist/${playlist.id}`}>
                <ListItemText>{playlist.name}</ListItemText>
              </NavLink>
            </ListItem>
          ))}
        </ul>
      </li>
    </List>
  );
};

export default Sidebar;
