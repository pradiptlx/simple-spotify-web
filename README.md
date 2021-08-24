# Simple Spotify Web (actually: Create Playlist Spotify Web)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Intro

This project is nothing more than a side project as React is the most wanted library to learn (based on [StackOverflow 2021 Survey](https://insights.stackoverflow.com/survey/2021?_ga=2.236209345.190202062.1628102352-126161871.1625855113#section-most-popular-technologies-web-frameworks)) and this is also for my final project in Generasi GIGIH, a program from Yayasan Anak Bangsa Bisa. I like listening to music with Spotify, so it's worth it to explore and try to use their API but because of complexity in Audio API, currently this app only serve as Create Playlist and Show Saved Library from User. Yeah, that is for the intro.

## Features

- Search Tracks
- Create Playlists from Selected Tracks
- Show Trending Playlists (Region ID)
- Show User Library
  - Following Artists
  - Saved Albums
  - Saved Tracks
  - Saved Playlists
- Play tracks (limited)

## Requirements

- Node 14+
- NPM
- That's it. Just do step below

## Installation

If you want to try (or maybe help me to improve) this app on your local development, just install with

```sh
cp .env .env.local # open https://developer.spotify.com/dashboard/applications and add config env with your key (don't forget add hostname configuration)
yarn install
```

and run development server.

```sh
yarn start
```

Don't forget to run test (if you write the test) with

```sh
yarn test
```

and help me find some bug.

## Link

[Website](https://simple-spotify-web.vercel.app/) (If you want to try, send to me your email because Spotify development API is limited into the account)
