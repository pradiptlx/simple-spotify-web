import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as ErrorSVG } from "./error-404.svg";

const NotFoundPage = (): React.ReactElement => {
  const history = useHistory();

  const goBackHandler = () => {
    history.goBack();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          "radial-gradient( circle farthest-corner at 15% 50%, rgba(90,92,106,1) 0%, rgba(32,45,58,1) 81.3% )",
      }}
    >
      <div className="flex flex-col">
        <div className="m-auto mt-5">
          <ErrorSVG className="fill-current text-secondary-main dark:text-secondary-dark" />
        </div>

        <div className="m-auto mt-5">
          <h1 className="text-3xl text-white">Page Not Found.</h1>
        </div>

        <div className="m-auto mt-5">
          <h3 className="text-xl text-white">
            or back to{" "}
            <span
              className="underline text-secondary-main dark:text-secondary-dark"
              onClick={goBackHandler}
              onKeyDown={goBackHandler}
              role="button"
              tabIndex={0}
            >
              previous page
            </span>
            .
          </h3>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
