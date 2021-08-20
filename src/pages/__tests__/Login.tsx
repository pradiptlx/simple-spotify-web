import React from "react";
import { render } from "test/Wrapper";
import userEvent from "@testing-library/user-event";
import { Store } from "@reduxjs/toolkit";
import { getAuthorizedToken as mockGetAuthorizedToken } from "api/authorization";
import Login from "pages/Login";

jest.mock("api/authorization", () => ({ getAuthorizedToken: jest.fn() }));

afterEach(() => {
  jest.clearAllMocks();
});

type loginPageProps = {
  route?: string;
  store?: Store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStore?: any;
};

function renderLoginPage({ route, store, initialStore }: loginPageProps) {
  const { rendered, history } = render(<Login />, {
    route,
    store,
    initialStore,
  });

  return {
    ...rendered,
    history,
  };
}

it("when not login, should redirect to /login", async () => {
  const { findByRole } = renderLoginPage({ route: "/" });
  const authBtn = await findByRole("button");
  expect(authBtn).toHaveTextContent(/Authorize/);
});

it("click authorized button should redirect to spotify login", async () => {
  const { findByText } = renderLoginPage({ route: "/login" });

  const authBtn = await findByText("Authorize");
  userEvent.click(authBtn);
  expect(mockGetAuthorizedToken).not.toThrow();
});
