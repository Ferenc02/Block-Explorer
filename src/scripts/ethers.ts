import { ethers } from "ethers";
import { showMessageBox } from "./messageBox";

export let provider: ethers.JsonRpcApiProvider;

export let providerExists = false;

let hasLoadedBlocks = false;

let blocks: Array<ethers.Block> = [];

// Function to initialize the provider
export async function initializeProvider() {
  provider = (await checkProvider()) || new ethers.JsonRpcProvider();

  loadBlocks();

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

// Function to get all wallets address
export const getAllWalletsAddress = async () => {
  const wallets = await provider.listAccounts();
  return wallets.map((wallet) => wallet.address);
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

// Get balance of a wallet in ether
export const getBalanceInEther = async (walletAddress: string) => {
  const balance = await provider.getBalance(walletAddress);
  return ethers.formatEther(balance);
};

// Get number of transactions of a wallet
export const getTransactionCount = async (walletAddress: string) => {
  const transactionCount = await provider.getTransactionCount(walletAddress);
  return transactionCount.toString();
};

// Function to load all blocks
const loadBlocks = async () => {
  if (!hasLoadedBlocks) {
    const latestBlock = await provider.getBlockNumber();

    for (let i = latestBlock; i >= 0; i--) {
      const block = await provider.getBlock(i);
      if (block) {
        blocks.push(block);
      }
    }

    hasLoadedBlocks = true;
  }
};

// Function to get the last activity of a wallet
// Binary search is used to find the last activity of a wallet to speed up the process
// Would not be efficient to loop through all blocks to find the last activity
export const getLatestActivity = async (walletAddress: string) => {
  let low = 0;
  let high = blocks.length - 1;

  let latestActivity = "";

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    const block = blocks[mid];

    let found = false;

    for (const transaction of block.transactions) {
      const tx = (await provider.getTransaction(
        transaction
      )) as ethers.TransactionResponse;
      if (
        tx.from.toLowerCase() === walletAddress.toLowerCase() ||
        (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase())
      ) {
        let date = new Date(block.timestamp * 1000);
        found = true;
        latestActivity = date.toDateString();
        break;
      }
    }

    if (found) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return latestActivity || "No activity found";
};

// Function to get the last activity of a wallet
// export const getLatestActivity = async (walletAddress: string) => {
//   for (let i = blocks.length; i >= 0; i--) {
//     const block = blocks[i];
//     if (!block) {
//       continue;
//     }

//     for (const transaction of block.transactions) {
//       const tx = (await provider.getTransaction(
//         transaction
//       )) as ethers.TransactionResponse;
//       if (
//         tx.from.toLowerCase() === walletAddress.toLowerCase() ||
//         (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase())
//       ) {
//         // console.log(`Latest activity: ${new Date(block.timestamp * 1000)}`);

//         let date = new Date(block.timestamp * 1000);
//         return date.toDateString();
//       }
//     }
//   }

//   return "No activity found";
// };
