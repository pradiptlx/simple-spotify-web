import React from "react";

type searchBarProps = {
  onSearchHandler: (event: React.ChangeEvent<HTMLFormElement>) => void;
  onInputSearchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
};

const Searchbar: React.FC<searchBarProps> = (props) => {
  const { onSearchHandler, onInputSearchHandler, searchValue } = props;

  return (
    <div
      id="searchbar-wrapper"
      className="text-center dark:bg-gray-800 dark:text-white pt-5"
    >
      <div id="searchBox">
        <form onSubmit={onSearchHandler}>
          <input
            id="searchInput"
            className="dark:bg-gray-800 dark:text-white mx-3 shadow-lg rounded-full py-3 px-6 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          "
            type="text"
            name="searchInput"
            placeholder="Search Song..."
            value={searchValue}
            onChange={onInputSearchHandler}
            data-testid="searchTrackSpotifyInput"
          />
          <button
            id="searchButton"
            className="rounded-full py-2 px-6 dark:bg-gray-900 shadow-lg"
            type="submit"
            data-testid="searchTrackSpotifyBtn"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Searchbar;
