import qs from "querystring";

type authorizationRequest = {
  isAccessTokenExists: boolean;
  accessToken: string;
  isTokenExpired: boolean;
  responseHandler?: ({
    isError,
    message,
  }: {
    isError: boolean;
    message: string;
  }) => void;
};

function generateRandomString(length: number): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const getAuthorizedToken = async ({
  isAccessTokenExists,
  accessToken,
  isTokenExpired,
  responseHandler,
}: authorizationRequest): Promise<void> => {
  const query = qs.stringify({
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    response_type: "token",
    redirect_uri: `${process.env.REACT_APP_URL}login/`,
    scope:
      "playlist-modify-private,user-library-read,user-follow-modify,user-follow-read",
    state: generateRandomString(10),
  });
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SPOTIFY_AUTH_URL}?${query}`,
      {
        mode: "no-cors",
        method: "GET",
      }
    );
    if ((response && !isAccessTokenExists && !accessToken) || isTokenExpired) {
      window
        .open(`${process.env.REACT_APP_SPOTIFY_AUTH_URL}?${query}`, "_self")
        ?.focus();
      if (responseHandler) {
        responseHandler({ isError: false, message: "Success Login" });
      }
    }
  } catch (error) {
    if (responseHandler) responseHandler({ isError: true, message: error });
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getAuthorizedToken };
