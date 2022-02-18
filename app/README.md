# ourworlds client

## Development environment

Svelte is used for development. Check the [docs](https://kit.svelte.dev/docs) for more information.

## Setup

Clone repository and set the feature branch

```bash
clone https://github.com/our-worlds/ourworlds-svelte.git

cd .\ourworlds-svelte\
git switch -c initial origin/initial
```

Add `.env` file with the following entries in /app folder:

```
CLIENT_MORALIS_SERVER_URL=
CLIENT_MORALIS_APP_ID=
```

Install dependencies:

```bash
cd app
npm i
```

## Usage

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
