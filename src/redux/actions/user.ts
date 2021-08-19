import { createAction } from "@reduxjs/toolkit";
import { PrivateUserObject } from "api/interfaces";

export type userDataIdentifier = PrivateUserObject;

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
