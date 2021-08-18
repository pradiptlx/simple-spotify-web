import React from "react";
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "redux/store";
import { Router } from "react-router";
import { createMemoryHistory, MemoryHistory } from "history";

type renderWrapperProps = (
  component: React.ReactElement,
  options: Omit<RenderOptions, "wrapper"> & {
    route: string;
  }
) => { history: MemoryHistory; rendered: RenderResult };

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

  const rendered = rtlRender(component, { wrapper: Wrapper, ...options });

  return {
    history,
    rendered,
  };
};

export * from "@testing-library/react";
export { RenderWithWrapper as render };
