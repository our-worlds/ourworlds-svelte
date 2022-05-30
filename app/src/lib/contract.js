import upgradableWorld from '/src/token/UpgradableWorld.json';
import contractAddress from '/src/token/contract-address.json';

export const upgradableAbi = upgradableWorld.abi;

export const globeTextureUrl =
  'https://ipfs.io/ipfs/QmV3w8D47cCJgjtcYuJF1LjLW5zpYUWU5Y7M21tzSyYtPE?filename=texture.png';

export const CONTRACT_ADDRESS = contractAddress.address;

export async function getURI(currentUri, currentTokens, userEthAddress) {
  const provider = window.Moralis;
  let uri = currentUri ? currentUri : {};

  let tokens = currentTokens ? currentTokens : [];

  await provider.enableWeb3();
  let optionsNft = {
    chain: 'avalanche testnet',
    address: userEthAddress,
    token_address: CONTRACT_ADDRESS,
  };
  await provider?.Web3API.account.getNFTsForContract(optionsNft).then((nfts) => {
    nfts.result.forEach((nft) => {
      console.log(nft);
      const tokenId = nft.token_id;
      tokens.push(tokenId);
    });
  });

  if (tokens.length === 0) return { uri, tokens };

  const optionsFunc = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'tokenURI',
    abi: upgradableAbi,
    params: {
      tokenId: tokens[0],
    },
  };

  const data = await provider.executeFunction(optionsFunc);
  const encoded = decodeURIComponent(data.split(',')[1]);

  uri = JSON.parse(encoded);

  return { uri, tokens };
}

export async function setNewURI(currentUri, currentTokens) {
  const provider = window.Moralis;

  let tokenMetadata = currentUri; // get first token
  tokenMetadata.image = globeTextureUrl;
  tokenMetadata.xp += 100;
  if (tokenMetadata.xp >= tokenMetadata.maxXp) {
    tokenMetadata.level += 1;
    tokenMetadata.maxXp *= 2;
  }

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'setTokenURI',
    abi: upgradableAbi,
    params: {
      tokenId: currentTokens[currentTokens.length - 1],
      metadataURI: `data:text/plain,${encodeURIComponent(JSON.stringify(tokenMetadata))}`,
    },
  };

  console.log(options);

  const receipt = await provider.executeFunction(options);

  console.log(receipt);

  const { tokens, uri } = await getURI(tokenMetadata, currentTokens);

  return { uri, tokens };
}
