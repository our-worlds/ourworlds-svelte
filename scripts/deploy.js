const hre = require("hardhat");

/**
 * Saves the ABI and contract address to the frontend directory
 * @param {ContractFactory} token 
 */
function saveAbiAndAddressToFrontend(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../app/src/token";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ address: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("UpgradableWorld");

  fs.writeFileSync(
    contractsDir + "/UpgradableWorld.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which " +
      "gets automatically created and destroyed every time. Use the Hardhat " +
      "option '--network localhost'"
    );
  }

  // We get the contract to deploy
  const UpgradableWorld = await hre.ethers.getContractFactory("UpgradableWorld");
  const upgradableWorld = await UpgradableWorld.deploy();

  await upgradableWorld.deployed();

  console.log("UpgradableWorld deployed to:", upgradableWorld.address);

  saveAbiAndAddressToFrontend(upgradableWorld);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
