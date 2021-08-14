import React from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
// import Button from "@material-ui/core/Button";
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

import styles from "./style.module.css";

const Navbar = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector((state) => state.user);
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

    history.replace("/login");
  };

  React.useEffect(() => {
    if (prevProfileMenuOpen.current && profileMenuOpen && anchorRef.current) {
      anchorRef.current.focus();
    }
    prevProfileMenuOpen.current = profileMenuOpen;
  }, [profileMenuOpen]);

  return (
    <nav className="bg-gray-800">
      <div className="hidden sm:block max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-white">
        <div className={`${styles.gridContainer} h-16`}>
          <NavLink
            to="/"
            exact
            className={styles.homeNav}
            activeClassName="bg-gray-900"
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
          >
            <p className="text-white block px-3 py-2 rounded-md text-base font-medium">
              Create Playlist
            </p>
          </NavLink>
          <div className={styles.loginNav}>
            {userProfile.id && userProfile.imageUrl && (
              <>
                <img
                  className="h-8 w-8 rounded-full"
                  src={userProfile.imageUrl}
                  alt={userProfile.id}
                  onClick={handleClickAvatar}
                  ref={anchorRef}
                  role="presentation"
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
                      <Paper>
                        <ClickAwayListener onClickAway={handleCloseMenuAvater}>
                          <MenuList
                            autoFocusItem={profileMenuOpen}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem onClick={handleCloseMenuAvater}>
                              <a
                                href={userProfile.spotifyUrl}
                                className="block px-4 py-2 text-sm text-gray-700"
                                id="user-menu-item-0"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Your Profile
                              </a>
                            </MenuItem>
                            <MenuItem onClick={handleCloseMenuAvater}>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700"
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

        <NavLink to="/create-playlist" exact activeClassName="bg-gray-900">
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

        {userProfile.id && userProfile.imageUrl && (
          <div
            className="flex items-center ml-2"
            onClick={() => {
              window.open(userProfile.spotifyUrl, "blank_");
            }}
            role="presentation"
          >
            <img
              className="h-6 w-6 rounded-full"
              src={userProfile.imageUrl}
              alt={userProfile.id}
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
              }}
              role="presentation"
            />
            <p className=" text-white block px-3 py-4 rounded-md text-base font-medium">
              {userProfile.displayName}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
