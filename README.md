# Welcome to ourworlds

Turning kind deeds into freedom.

## Setup

Clone repository

`git clone https://github.com/our-worlds/ourworlds-svelte.git`

`cd .\ourworlds-svelte\`

In `/app` Rename `.env.example` to `.env` and replace `SERVER_URL` & `APP_ID` with your Moralis serverUrl and appId, respectively.

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

## Technologies Used

- IPFS
- Moralis
- FRP
  - [Used to connect Moralis with Ganache local server](https://www.youtube.com/watch?v=aRRS394is1U)

## Deploy Smart Contract

To deploy to the hardhat network:

`npx hardhat run .\scripts\deploy.js`

To deploy to the Fuji network:

`npx hardhat run .\scripts\deploy.js --network fuji`

**NOTE**: `PRIVATE_KEY` needs to be defined in the top-level `.env` for the account that will deploy the contract.
