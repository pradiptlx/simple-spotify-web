import axios from "axios";
import qs from "querystring";

type authorizationRequest = {
  isAccessTokenExists: boolean;
  accessToken: string;
  isTokenExpired: boolean;
};

const getAuthorizedToken = async ({
  isAccessTokenExists,
  accessToken,
  isTokenExpired,
}: authorizationRequest): Promise<void> => {
  const query = qs.stringify({
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    response_type: "token",
    redirect_uri: `${process.env.REACT_APP_URL}login/`,
    scope:
      "playlist-modify-private,user-library-read,user-follow-modify,user-follow-read",
    state: 123,
  });
  axios
    .get(
      `${process.env.REACT_APP_SPOTIFY_AUTH_URL}?${query}`
      //   , {
      //     headers: {
      //       "Access-Control-Allow-Origin": process.env.REACT_APP_URL,
      //         "Access-Control-Allow-Headers":
      //           "Origin, X-Requested-With, Content-Type, Accept",
      //       "Access-Control-Allow-Credentials": "true",
      //     },
      //   }
    )
    .then((response) => {
      if (response.request && response.request.responseURL != null) {
        if ((!isAccessTokenExists && !accessToken) || isTokenExpired) {
          window.open(response.request.responseURL, "_self")?.focus();
        }
      }
    });
};

// eslint-disable-next-line import/prefer-default-export
export { getAuthorizedToken };
