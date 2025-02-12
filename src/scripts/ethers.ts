import { ethers } from "ethers";
import { showMessageBox } from "../messageBox";

export let provider: ethers.JsonRpcApiProvider;

export let providerExists = false;

// Function to initialize the provider
export async function initializeProvider() {
  provider = (await checkProvider()) || new ethers.JsonRpcProvider();

  return provider;
}

// Function to check if a provider exists
export async function checkProvider() {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    await provider.getBlockNumber();

    providerExists = true;

    return provider;
  } catch (error: any) {
    showMessageBox(
      "error",
      "Error connecting to provider",
      "❌ No provider found or connection failed. Please run ganache-cli or any other Ethereum client on 127.0.0.1:8545"
    );

    return null;
  }
}

// Function to get the total number of transactions in the pending block
export const getTotalTransactions = async () => {
  const latestBlockNumber = await provider.getBlockNumber();
  let totalTransactions = 0;

  // Really not the best way to get the total number of transactions but since I am using ganache,
  // there won't be a lot of transactions in the blocks so I can afford to do this
  // But if a real testnet is used, this will be very slow and inefficient
  // If testnet is used, best to check if they have caching enabled or use a database to store the transactions
  for (let i = 0; i <= latestBlockNumber; i++) {
    const block = (await provider.getBlock(i)) as ethers.Block;
    totalTransactions += block.transactions.length;
  }

  return totalTransactions.toString();
};

// Function to get the average block time in seconds
export const getAverageBlockTime = async () => {
  const latestBlock = (await provider.getBlock("latest")) as ethers.Block;
  const previousBlock = (await provider.getBlock(
    latestBlock.number - 1
  )) as ethers.Block;
  const timeDifference = latestBlock.timestamp - previousBlock.timestamp;
  return timeDifference.toString();
};

// Function to get the total number of wallets
export const getTotalWallets = async () => {
  const wallets = await provider.listAccounts();
  return wallets.length.toString();
};

// Function to get the network name
export const getNetworkName = async () => {
  // Had to create a translation table for the chainId since ethers.js gave me unknown when using ganache
  let translationTableChainId: { [key: string]: string } = {
    "1": "Mainnet",
    "137": "Matic Mainnet",
    "43114": "Avalanche Mainnet",
    "56": "Binance Smart Chain Mainnet",
    "8453": "Base",
    "42161": "Arbitrum Mainnet",
    "1337": "Ganache",
  };

  let chainId = (await provider.getNetwork()).chainId.toString();

  let networkName = translationTableChainId[chainId];

  return networkName;
};

// Get total number of blocks

export const getTotalBlocks = async () => {
  const totalBlocks = (await provider.getBlockNumber()).toString();
  return totalBlocks;
};
