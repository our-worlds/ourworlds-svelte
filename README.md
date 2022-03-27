# Welcome to ourworlds

Turning kind deeds into freedom.

## Technologies Used

- IPFS
- Moralis

## Running the web client

For instruction on running the svelte client, please vist [app/README.md](./app/README.md).

## Deploy Smart Contract

To deploy to the hardhat network:

`npx hardhat run .\scripts\deploy.js`

To deploy to the Fuji network:

`npx hardhat run .\scripts\deploy.js --network fuji`

**NOTE**: `PRIVATE_KEY` needs to be defined in the top-level `.env` for the account that will deploy the contract. See `.env.example` for reference.
