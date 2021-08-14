import { createAction } from "@reduxjs/toolkit";

export type userDataIdentifier = {
  id: string;
  displayName: string;
  imageUrl: string;
  spotifyUrl: string;
};

const setCurrentUser = createAction(
  "user/profile",
  (userData: userDataIdentifier) => ({
    payload: {
      ...userData,
    },
  })
);

// eslint-disable-next-line import/prefer-default-export
export { setCurrentUser };
