/* eslint-disable react/no-array-index-key */
import React from "react";
import { useAppSelector as useSelector } from "redux/store";
import {
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
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
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Slide from "@material-ui/core/Slide";

type withSidebarProps = {
  chidlren?: React.ReactChildren;
  headingText?: string;
};

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

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      borderBottomRightRadius: ".75rem",
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
      color:
        theme.palette.type === "dark" ? theme.palette.text.primary : "white",
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
      color:
        theme.palette.type === "dark" ? theme.palette.text.primary : "white",
    },
    playlistItem: {
      paddingBottom: 0,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      justifyContent: "flex-end",
    },
    drawerPaper: {
      // maxWidth: 360,
      //   height: 'inherit',
      position: "static",
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.primary.dark
          : theme.palette.primary.light,
      borderTopRightRadius: ".75rem",
      borderBottomRightRadius: ".75rem",
    },
    drawerRoot: {
      position: "fixed",
      height: "50%",
    },
    buttonRoot: {
      position: "static",
      float: "right",
    },
  })
);

const WithSidebarLayout: React.FC<withSidebarProps> = ({
  children,
  headingText,
}) => {
  const classes = useStyles();
  const { currentUserPlaylists } = useSelector((state) => state.app);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);

  const onDrawerClickHandler = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <div className="grid md:grid-cols-sidebar">
        <Drawer
          //   className="hidden md:block"
          classes={{ paper: classes.drawerPaper, root: classes.drawerRoot }}
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
        >
          <Divider />
          <List className={classes.root} subheader={<li />}>
            <li key="section-my-library" className={classes.listSection}>
              <ul className={classes.ul}>
                <ListSubheader className={classes.listHeader}>
                  My Library
                  <div className="block md:hidden float-right">
                    <IconButton onClick={onDrawerClickHandler}>
                      <ChevronLeftIcon />
                    </IconButton>
                  </div>
                </ListSubheader>
                <Divider component="li" variant="inset" />
                <ListItem className={classes.listItem}>
                  <NavLink
                    to="/me/tracks"
                    activeClassName="text-secondary-main dark:text-secondary-dark"
                  >
                    <ListItemText>
                      <LibraryMusicOutlinedIcon /> Tracks
                    </ListItemText>
                  </NavLink>
                </ListItem>

                <ListItem className={classes.listItem}>
                  <NavLink
                    to="/me/albums"
                    activeClassName="text-secondary-main dark:text-secondary-dark"
                  >
                    <ListItemText>
                      <AlbumOutlinedIcon /> Albums
                    </ListItemText>
                  </NavLink>
                </ListItem>

                <ListItem className={classes.listItem}>
                  <NavLink
                    to="/me/artists"
                    activeClassName="text-secondary-main dark:text-secondary-dark"
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
                          activeClassName="text-secondary-main dark:text-secondary-dark"
                        >
                          <ListItemText>{playlist.name}</ListItemText>
                        </NavLink>
                      </ListItem>
                    ))
                  : emptyDataComponent()}
              </ul>
            </li>
          </List>
        </Drawer>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl dark:text-white my-5">{headingText}</h1>
          {children}
        </div>
      </div>
      <div className="block md:hidden">
        <Slide in={!isDrawerOpen} direction="left">
          <IconButton
            aria-label="open drawer"
            onClick={onDrawerClickHandler}
            edge="end"
            classes={{ root: classes.buttonRoot }}
          >
            <MenuIcon />
          </IconButton>
        </Slide>
      </div>
    </>
  );
};

export default WithSidebarLayout;
