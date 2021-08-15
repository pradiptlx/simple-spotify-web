import React from "react";

import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "redux/store";
import { setDarkTheme } from "redux/actions/app";

import styles from "./style.module.css";
import { ReactComponent as SunSVG } from "./sun.svg";
import { ReactComponent as MoonSVG } from "./moon.svg";

const ToggleTheme = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { darkTheme } = useSelector((state) => state.app);

  const onClickHandler = () => {
    dispatch(setDarkTheme(!darkTheme));
  };

  return (
    <>
      <button
        className={styles.btnToggle}
        type="button"
        onClick={onClickHandler}
      >
        <SunSVG
          className={
            !darkTheme ? `${styles.lightThemeSun}` : `${styles.darkThemeSun}`
          }
        />
        <MoonSVG
          className={
            !darkTheme ? `${styles.lightThemeMoon}` : `${styles.darkThemeMoon}`
          }
        />
      </button>
    </>
  );
};

export default ToggleTheme;
