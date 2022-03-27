# ourworlds client

## Development environment

Svelte is used for development. Check the [docs](https://kit.svelte.dev/docs) for more information.

## Setup

In `/app`, rename `.env.example` to `.env` and replace `SERVER_URL` & `APP_ID` with your Moralis serverUrl and appId, respectively.

```bash
CLIENT_MORALIS_SERVER_URL=SERVER_URL
CLIENT_MORALIS_APP_ID=APP_ID
```

Install dependencies:

```bash
cd app
npm i
```

## Usage

To start the development server

`npm run dev`

or start the server and open the app in a new browser tab

`npm run dev -- --open`

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
