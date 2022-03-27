const { expect } = require("chai");

function encodeTokenMetadata(tokenMetadata) {
  return `data:text/plain,${encodeURIComponent(JSON.stringify(tokenMetadata))}`
}

describe("UpgradableWorld", function () {

  const tokenMetadata = {
    "name": "",
    "description": "",
    "image": "https://ipfs.io/ipfs/QmV3w8D47cCJgjtcYuJF1LjLW5zpYUWU5Y7M21tzSyYtPE?filename=texture.png",
    "xp": 0,
    "maxXp": 100,
    "level": 1
  };

  it("Successfully deploy contract", async function () {

    const UpgradableWorld = await hre.ethers.getContractFactory("UpgradableWorld");
    const upgradableWorld = await UpgradableWorld.deploy();

    const accounts = await hre.ethers.getSigners();

    await upgradableWorld.deployed();

    expect(await upgradableWorld.owner()).to.equal(accounts[0].address);
  });

  it("Only one NFT per address", async function () {
    const UpgradableWorld = await hre.ethers.getContractFactory("UpgradableWorld");

    // deply contract
    let upgradableWorld = await UpgradableWorld.deploy();
    // we ensure that the contract is deployted
    await upgradableWorld.deployed();

    // grab all the accounts in hardhat
    const accounts = await hre.ethers.getSigners();
    const adr = accounts[0].address;

    // first mint attempt
    tokenMetadata.name = "John McTest";
    tokenMetadata.description = "This is test mint";

    await upgradableWorld.safeMint(adr,encodeTokenMetadata(tokenMetadata));

    // second mint attempt
    tokenMetadata.name = "John McTest II";
    tokenMetadata.description = "This is the second test mint";

    // we expect this tx to fail
    expect(upgradableWorld.safeMint(adr,encodeTokenMetadata(tokenMetadata)))
      .to.be.revertedWith("User has a World already!");

    // signer should only have one NFT
    expect(await upgradableWorld.balanceOf(adr)).to.equal(1);
  })
});
