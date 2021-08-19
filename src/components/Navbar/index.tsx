/* eslint-disable react/no-array-index-key */
import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { NavLink, useHistory } from "react-router-dom";
import {
  removeAuthorization,
  setLoginState,
} from "redux/actions/authorization";
import { setCurrentUser } from "redux/actions/user";
import { initialUserState } from "redux/reducers/user";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ToggleTheme from "components/ToggleTheme";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AlbumOutlinedIcon from "@material-ui/icons/AlbumOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import LibraryMusicOutlinedIcon from "@material-ui/icons/LibraryMusicOutlined";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { setPageData } from "redux/actions/app";
import Typography from "@material-ui/core/Typography";
import styles from "./style.module.css";

const useStyles = makeStyles((theme: Theme) => ({
  paperRoot: {
    width: "100%",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
    color: "white",
  },
  accordionRoot: {
    width: "100%",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
  },
  accordionHeader: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: "white",
  },
  playlistItem: {
    paddingBottom: 0,
    width: "100%",
  },
  listPlaylistSection: {
    backgroundColor: "inherit",
    overflow: "auto",
    maxHeight: 400,
    width: "100%",
  },
  listItem: {
    margin: ".2rem auto",
    width: "100%",
  },
  listSection: {
    backgroundColor: "inherit",
    width: "100%",
  },
  ul: {
    backgroundColor: "inherit",
    width: "100%",
    padding: 0,
    color: theme.palette.type === "dark" ? theme.palette.text.primary : "white",
  },
  rootList: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: "inherit",
    position: "relative",
    overflow: "auto",
    height: "100%",
    borderTopRightRadius: ".75rem",
    borderBottomRightRadius: ".75rem",
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

const Navbar = (): React.ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector((state) => state.user);
  const { currentUserPlaylists } = useSelector((state) => state.app);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLImageElement>(null);
  const prevProfileMenuOpen = React.useRef(profileMenuOpen);

  const handleClickAvatar = () => {
    setProfileMenuOpen((prevState) => !prevState);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      setProfileMenuOpen(false);
    }
  }

  const handleCloseMenuAvater = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setProfileMenuOpen(false);
  };

  const signOutHandler = () => {
    localStorage.removeItem("spotify-access-token");
    dispatch(removeAuthorization());
    dispatch(setLoginState(false));
    dispatch(setCurrentUser(initialUserState));
    dispatch(setPageData({ currentUserPlaylists: [] }));

    history.replace("/login");
  };

  React.useEffect(() => {
    if (prevProfileMenuOpen.current && profileMenuOpen && anchorRef.current) {
      anchorRef.current.focus();
    }
    prevProfileMenuOpen.current = profileMenuOpen;
  }, [profileMenuOpen]);

  return (
    <nav className="bg-gray-800 shadow-2xl md:shadow-none sticky top-0 md:static z-10">
      <div className="hidden sm:block max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-white">
        <div className={`${styles.gridContainer} h-16`}>
          <NavLink
            to="/"
            exact
            className={styles.homeNav}
            activeClassName="bg-gray-900"
            data-testid="homeNavLink"
          >
            <p className="text-white block px-3 py-2 rounded-md text-base font-medium">
              Home
            </p>
          </NavLink>

          <NavLink
            to="/create-playlist"
            exact
            className={styles.createPlaylistNav}
            activeClassName="bg-gray-900"
            data-testid="createPlaylistNavLink"
          >
            <p className="text-white block px-3 py-2 rounded-md text-base font-medium">
              Create Playlist
            </p>
          </NavLink>

          <div className={styles.themeToggle}>
            <ToggleTheme />
          </div>

          <div className={styles.loginNav}>
            {userProfile.id && (
              <>
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    userProfile.images.length ? userProfile.images[0].url : ""
                  }
                  alt={userProfile.id}
                  onClick={handleClickAvatar}
                  ref={anchorRef}
                  role="presentation"
                  data-testid="profilePictureUser"
                />
                <Popper
                  open={profileMenuOpen}
                  anchorEl={anchorRef.current}
                  role="menuitem"
                  transition
                  disablePortal
                  style={{ zIndex: 20 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper className={classes.paperRoot}>
                        <ClickAwayListener onClickAway={handleCloseMenuAvater}>
                          <MenuList
                            autoFocusItem={profileMenuOpen}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem onClick={handleCloseMenuAvater}>
                              <a
                                href={userProfile.external_urls.spotify}
                                className="block px-4 py-2 text-sm text-white"
                                id="user-menu-item-0"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Your Profile
                              </a>
                            </MenuItem>
                            <MenuItem onClick={handleCloseMenuAvater}>
                              <button
                                className="block px-4 py-2 text-sm text-white"
                                role="menuitem"
                                onClick={signOutHandler}
                                type="button"
                              >
                                Sign Out
                              </button>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden flex flex-col" id="mobile-menu">
        <Accordion className={classes.accordionRoot}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="user-library"
          >
            <Typography className={classes.accordionHeader}>
              Main Navigation
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List className={classes.rootList} subheader={<li />}>
              <li
                key="section-playlists"
                className={classes.listPlaylistSection}
              >
                <ul>
                  <NavLink to="/" exact activeClassName="bg-gray-900">
                    <div className="flex items-center ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                      </svg>
                      <p className="text-white block px-3 py-4 rounded-md text-base font-medium">
                        Home
                      </p>
                    </div>
                  </NavLink>
                </ul>
                <ul>
                  <NavLink
                    to="/create-playlist"
                    exact
                    activeClassName="bg-gray-900"
                  >
                    <div className="flex items-center ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                      <p className=" text-white block px-3 py-4 rounded-md text-base font-medium">
                        Create Playlist
                      </p>
                    </div>
                  </NavLink>
                </ul>
                <ul>
                  {userProfile.id && (
                    <Accordion className={classes.accordionRoot}>
                      <AccordionSummary>
                        <div
                          className="flex items-center ml-2"
                          role="presentation"
                        >
                          <img
                            className="h-6 w-6 rounded-full"
                            src={
                              userProfile.images.length
                                ? userProfile.images[0].url
                                : ""
                            }
                            alt={userProfile.id}
                            onClick={() => {
                              setProfileMenuOpen(!profileMenuOpen);
                            }}
                            role="presentation"
                          />
                          <p className=" text-white block px-3 py-4 rounded-md text-base font-medium">
                            {userProfile.display_name}
                          </p>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List className={classes.rootList} subheader={<li />}>
                          <li
                            key="section-my-library"
                            className={classes.listSection}
                          >
                            <ul className={classes.ul}>
                              <ListItem className={classes.listItem}>
                                <a
                                  href={userProfile.external_urls.spotify}
                                  className="block px-4 py-2 text-sm text-white"
                                  id="user-menu-item-0"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Your Profile
                                </a>
                              </ListItem>

                              <ListItem className={classes.listItem}>
                                <button
                                  className="block px-4 py-2 text-sm text-white"
                                  role="menuitem"
                                  onClick={signOutHandler}
                                  type="button"
                                >
                                  Sign Out
                                </button>
                              </ListItem>
                            </ul>
                          </li>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </ul>
                <ul className={classes.ul}>
                  <div className="my-3">
                    <ToggleTheme />
                  </div>
                </ul>
              </li>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordionRoot}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="user-library"
          >
            <Typography className={classes.accordionHeader}>
              My Library
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List className={classes.rootList} subheader={<li />}>
              <li key="section-my-library" className={classes.listSection}>
                <ul className={classes.ul}>
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
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordionRoot}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="user-library"
          >
            <Typography className={classes.accordionHeader}>
              My Playlists
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List className={classes.rootList} subheader={<li />}>
              <li
                key="section-playlists"
                className={classes.listPlaylistSection}
              >
                <ul className={classes.ul}>
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
          </AccordionDetails>
        </Accordion>
      </div>
    </nav>
  );
};

export default Navbar;
