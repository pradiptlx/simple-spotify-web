/* eslint-disable import/extensions */
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import applicationReducer from "./reducers/app";
import { authorizationReducer } from "./reducers/authorization";
import { userReducer } from "./reducers/user";

const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    user: userReducer,
    app: applicationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
