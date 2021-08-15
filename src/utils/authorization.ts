type callbackFnIdentifier = {
  accessTokenURL: string;
  expiredTokenTimeURL: Date;
};

type parsingAccessTokenFnIdentifier = (
  callbackFn: (arg: callbackFnIdentifier) => void
) => void;

const parsingAccessToken: parsingAccessTokenFnIdentifier = (callbackFn) => {
  const url = new URL(window.location.href);
  const params = url.hash.split("&");
  const accessTokenURL = params[0].split("=")[1];

  const expiredSeconds = Number(params[2].split("=")[1]);
  const expiredTime = new Date();
  expiredTime.setSeconds(expiredSeconds);

  callbackFn({
    accessTokenURL,
    expiredTokenTimeURL: expiredTime,
  });

  localStorage.setItem(
    "spotify-access-token",
    JSON.stringify({
      accessToken: accessTokenURL,
      expiredTokenTime: expiredTime,
    })
  );
  window.open(process.env.REACT_APP_URL, "_self");
};

// eslint-disable-next-line import/prefer-default-export
export { parsingAccessToken };
