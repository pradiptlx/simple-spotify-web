import React from "react";

type playlistFormProps = {
  onSubmitPlaylistFormHandler: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  onPlaylistFormHandler: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  titlePlaylistValue?: string;
  descPlaylistValue?: string;
};

const PlaylistForm: React.FC<playlistFormProps> = (props) => {
  const {
    onSubmitPlaylistFormHandler,
    onPlaylistFormHandler,
    titlePlaylistValue = "",
    descPlaylistValue = "",
  } = props;

  return (
    <div className="dark:bg-gray-800 dark:text-white pt-5">
      <form onSubmit={onSubmitPlaylistFormHandler}>
        <div className="flex items-center gap-x-4">
          <div id="playlist-title">
            <input
              id="titlePlaylist"
              className="dark:bg-gray-800 dark:text-white mx-3 shadow-lg rounded-full py-3 px-6 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          "
              type="text"
              name="titlePlaylist"
              placeholder="Title"
              value={titlePlaylistValue}
              onChange={onPlaylistFormHandler}
              minLength={10}
            />
          </div>
          <div id="playlist-description">
            <textarea
              className="dark:bg-gray-800 dark:text-white form-textarea mt-1 block w-full
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              minLength={20}
              name="descPlaylist"
              value={descPlaylistValue}
              placeholder="Enter Description."
              onChange={onPlaylistFormHandler}
            />
          </div>
          <button
            id="createPlaylistBtn"
            className="rounded-full max-h-40-px px-6 py-2 dark:bg-gray-900 shadow-lg"
            type="submit"
          >
            Create Playlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistForm;
