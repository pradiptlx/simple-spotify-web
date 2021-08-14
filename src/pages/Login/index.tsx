// eslint-disable-next-line no-use-before-define
import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getAuthorizedToken } from "api/authorization";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../../redux/store";
import { setLoginState } from "../../redux/actions/authorization";

type locationiIdentifier = {
  from: { pathname: string };
};

const Login: React.FC<unknown> = () => {
  const history = useHistory();
  const location = useLocation<locationiIdentifier>();
  const { from } = location.state || {
    from: { pathname: "/" },
  };
  const dispatch = useDispatch();
  const { accessToken, isAccessTokenExists, isTokenExpired } = useSelector(
    (state) => state.authorization
  );

  const [isAuthLoading, setIsAuthLoading] = React.useState(false);

  const onLoginBtnHandler = () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
    }, 1000);
    getAuthorizedToken({
      isAccessTokenExists,
      accessToken,
      isTokenExpired,
    });
  };

  // Handle login state after get access token or is exists
  React.useEffect(() => {
    if (isAccessTokenExists && !isTokenExpired) {
      dispatch(setLoginState(true));

      // Redirect to previous pages
      // history.replace(from);
      history.replace("/create-playlist");
    }
  }, [isAccessTokenExists, isTokenExpired, history, from]);

  return (
    <div className="h-screen dark:bg-gray-800 flex">
      <div className="m-auto">
        <svg
          className="mx-auto mb-5"
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 24 24"
          height="96px"
          viewBox="0 0 24 24"
          width="96px"
          fill="#FFFFFF"
        >
          <g>
            <rect fill="none" height="24" width="24" />
          </g>
          <g>
            <path d="M20,7h-5V4c0-1.1-0.9-2-2-2h-2C9.9,2,9,2.9,9,4v3H4C2.9,7,2,7.9,2,9v11c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V9 C22,7.9,21.1,7,20,7z M9,12c0.83,0,1.5,0.67,1.5,1.5S9.83,15,9,15s-1.5-0.67-1.5-1.5S8.17,12,9,12z M12,18H6v-0.75c0-1,2-1.5,3-1.5 s3,0.5,3,1.5V18z M13,9h-2V4h2V9z M18,16.5h-4V15h4V16.5z M18,13.5h-4V12h4V13.5z" />
          </g>
        </svg>
        <button
          className="dark:text-white flex float-right mx-4 rounded-full py-2 px-4 dark:bg-gray-700"
          onClick={onLoginBtnHandler}
          type="button"
        >
          Authorize
          {isAuthLoading && (
            <svg
              className="ml-2 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#ffffff"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
