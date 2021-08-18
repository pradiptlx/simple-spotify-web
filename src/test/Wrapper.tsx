import React from "react";
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory, MemoryHistory } from "history";
import { combineReducers, createStore, Store } from "@reduxjs/toolkit";
import {
  applicationReducer,
  initialApplicationState,
} from "redux/reducers/app";
import {
  authorizationReducer,
  initialAuthorizationState,
} from "redux/reducers/authorization";
import { initialUserState, userReducer } from "redux/reducers/user";

type renderWrapperProps = (
  component: React.ReactElement,
  options: Omit<RenderOptions, "wrapper"> & {
    route?: string;
    store?: Store;
  }
) => { history: MemoryHistory; rendered: RenderResult };

const defaultStore = createStore(
  combineReducers({
    authorization: authorizationReducer,
    user: userReducer,
    app: applicationReducer,
  }),
  {
    app: { ...initialApplicationState },
    authorization: { ...initialAuthorizationState },
    user: { ...initialUserState },
  }
);

const RenderWithWrapper: renderWrapperProps = (
  component,
  { route = "/", store = defaultStore, ...options }
) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );

  const rendered = rtlRender(component, { wrapper: Wrapper, ...options });

  return {
    history,
    rendered,
  };
};

export * from "@testing-library/react";
export { RenderWithWrapper as render };
