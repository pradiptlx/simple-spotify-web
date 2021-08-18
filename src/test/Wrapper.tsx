import React from "react";
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "redux/store";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

type renderWrapperProps = (
  component: React.ReactElement,
  options: Omit<RenderOptions, "wrapper"> & {
    route: string;
  }
) => RenderResult;

const RenderWithWrapper: renderWrapperProps = (
  component,
  { route = "/", ...options }
) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );

  return rtlRender(component, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { RenderWithWrapper as render };
