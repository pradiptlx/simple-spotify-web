import React from "react";

type alertProps = {
  titlePlaylist?: string;
  urlPlaylist?: string;
  isError?: boolean;
};

const Alert: React.FC<alertProps> = (props) => {
  const { titlePlaylist, urlPlaylist, isError } = props;

  return (
    <div className="dark:bg-gray-800 dark:text-white text-center">
      <div
        className={
          // eslint-disable-next-line no-nested-ternary
          isError
            ? "bg-red-500 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex p-2 transition-transform transform duration-500 ease-in-out translate-y-1"
            : // eslint-disable-next-line prefer-template
              "bg-green-500 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex p-2 transition-transform transform duration-500 ease-in-out translate-y-1"
        }
        role="alert"
      >
        <span className="font-semibold mr-2 text-left flex-auto">
          Successful created playlist: {titlePlaylist}
        </span>
        <svg
          onClick={() => {
            window.open(urlPlaylist, "_blank");
          }}
          className="fill-current opacity-75 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </div>
    </div>
  );
};

export default Alert;
