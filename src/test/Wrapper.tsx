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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialStore?: any;
  }
) => { history: MemoryHistory; rendered: RenderResult };

export const defaultStoreTest = createStore(
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
  { route = "/", store = defaultStoreTest, initialStore, ...options }
) => {
  let wrapperStore = store;
  if (typeof initialStore !== "undefined") {
    wrapperStore = createStore(
      combineReducers({
        authorization: authorizationReducer,
        user: userReducer,
        app: applicationReducer,
      }),
      {
        ...initialStore,
      }
    );
  }
  const history = createMemoryHistory({ initialEntries: [route] });
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={wrapperStore}>
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
