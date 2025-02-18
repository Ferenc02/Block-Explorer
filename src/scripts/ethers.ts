/*
 *
 * ethers.ts - The big beast of the application. This script is responsible for all the Ethereum related functions
 *
 *
 * It is responsible for initializing the provider, getting the total number of transactions, average block time, total wallets,
 * network name, total blocks, block timestamp, balance of a wallet, value of a transaction, number of transactions of a wallet,
 * sending a transaction, loading all blocks, getting the last activity of a wallet, getting the transaction details with the hash,
 * getting all transactions of a wallet, getting all transactions, setting new active wallet, showing transaction details,
 * and the LocalWallet class
 *
 * NOTE: This script is a bit long and can be broken down into smaller scripts but I wanted to keep all the Ethereum related functions in one place
 * NOTE: Good thing with this code is that everything is well documented and easy to understand while keeping everything in their own functions
 * */

// --- Other Imports ---
import { ethers } from "ethers";
import { showMessageBox } from "./messageBox";

export let provider: ethers.JsonRpcApiProvider;

// Variable to check if a provider exists
export let providerExists = false;

// Variable to check if blocks have been loaded
let hasLoadedBlocks = false;

// Array to store all blocks in the blockchain
export let blocks: Array<ethers.Block> = [];

// Variable to store the active wallet
export let activeWallet: LocalWallet;

/**
 *
 * Function to initialize the provider
 * @returns The provider
 */
export async function initializeProvider() {
  // Check if a provider exists
  provider = (await checkProvider()) || new ethers.JsonRpcProvider();

  // Load all blocks
  await loadBlocks();

  // Get the active wallet from local storage or the first wallet from the provider
  let localStorageActiveWallet =
    localStorage.getItem("activeWallet") ||
    (await provider.listAccounts())[0]?.address ||
    "";

  // Create a new instance of the LocalWallet class and set the active wallet
  activeWallet = new LocalWallet(localStorageActiveWallet);

  // Initialize the active wallet
  await activeWallet.init();

  return provider;
}

// Class to store the wallet information
// The class has a constructor that takes the wallet address, balance, transactions, and last activity
// The class has methods to initialize the wallet, get the balance, get the latest activity, get the transactions, and set the address
// This made everything more organized and easier to manage since all the wallet information is stored in one place.
export class LocalWallet {
  constructor(
    public address: string,
    public balance: string = "0",
    public transactions: Array<ethers.TransactionResponse> = [],
    public lastActivity: string = "No activity found"
  ) {}
  async init() {
    try {
      await provider.getBalance(this.address);
    } catch (error: any) {
      showMessageBox("error", "404 Not Found", "Wallet address not found");
      return;
    }

    this.balance = await this.getBalance();
    this.transactions = await this.getTransactions();
  }

  getBalance = async () => {
    return await getBalanceInEther(this.address);
  };

  getLatestActivity = async () => {
    return await getLatestActivity(this.transactions);
  };

  getTransactions = async () => {
    return await getTransactions(this.address);
  };

  setAddress = (address: string) => {
    this.address = address;
  };
}

/**
 *
 * Function to check if a provider exists
 * @returns The provider if it exists or null if it doesn't
 *
 * Basically it tries to connect to ganache-cli or any other Ethereum client on the address http://127.0.0.1:8545
 * If it connects successfully, it returns the provider
 * If it fails to connect, it shows an error message on the browser and returns null
 */
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

/**
 *
 * Function to get the total number of transactions done on the blockchain
 * @returns The total number of transactions
 */
export const getTotalTransactions = async () => {
  const latestBlockNumber = await provider.getBlockNumber();
  let totalTransactions = 0;

  // Really not the best way to get the total number of transactions but since I am using ganache,
  // there won't be a lot of transactions in the blocks so I can afford to do this
  // But if a real testnet is used, this will be very slow and inefficient
  // If testnet is used, best to check if they have caching enabled or use a database to store the transactions
  // Since a new block is created everytime a transaction is made,
  // I can just get the block number and know the total number of transactions
  // But to keep it more realistic, I loop through all the blocks and get the total number of transactions
  for (let i = 0; i <= latestBlockNumber; i++) {
    const block = (await provider.getBlock(i)) as ethers.Block;
    totalTransactions += block.transactions.length;
  }

  return totalTransactions.toString();
};

/**
 *
 * Function to get the average block time by getting the time difference between the latest block and the previous block
 * @returns The average block time
 */
export const getAverageBlockTime = async () => {
  const latestBlock = (await provider.getBlock("latest")) as ethers.Block;

  // If there are no blocks, return 0 to avoid getting negative number
  if (latestBlock.number == 0) {
    return "0";
  }

  const previousBlock = (await provider.getBlock(
    latestBlock.number - 1
  )) as ethers.Block;
  const timeDifference = latestBlock.timestamp - previousBlock.timestamp;
  return timeDifference.toString();
};

/**
 *
 * Function to get the total number of wallets
 * @returns The total number of wallets
 */
export const getTotalWallets = async () => {
  const wallets = await provider.listAccounts();
  return wallets.length.toString();
};

/**
 *
 * Function to get all wallets address
 * @returns All wallets address in an Promise array
 */
export const getAllWalletsAddress = async () => {
  const wallets = await provider.listAccounts();

  return wallets.map((wallet) => wallet.address);
};

/**
 *
 * Function to get the network name
 * @returns The network name
 */
export const getNetworkName = async () => {
  // Had to create a translation table for the chainId since ethers.js gave me unknown when using ganache
  // Populated with some of the most popular chainIds and their network names
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

/**
 *
 * Function to get the total number of blocks in the blockchain
 * @returns The total number of blocks
 */
export const getTotalBlocks = async () => {
  const totalBlocks = (await provider.getBlockNumber()).toString();
  return totalBlocks;
};

/**
 *
 * Function to get the block timestamp
 * @param blockNumber The block number
 * @returns The block timestamp
 */
export const getBlockTimeStamp = async (blockNumber: number) => {
  const block = (await provider.getBlock(blockNumber)) as ethers.Block;
  return block.timestamp;
};

/**
 *
 * Function to get the balance of a wallet in ether
 * @param walletAddress The wallet address
 * @returns The balance of the wallet in ether
 */
export const getBalanceInEther = async (walletAddress: string) => {
  const balance = await provider.getBalance(walletAddress);
  return ethers.formatEther(balance);
};

/**
 *
 * Function to get the value of a transaction in ether
 * @param value The value of the transaction
 * @returns The value of the transaction in ether
 */
export const getValueInEther = (value: ethers.BigNumberish): string => {
  return ethers.formatEther(value);
};

/**
 *
 * Function to get the number of transactions of a wallet
 * @param walletAddress The wallet address
 * @returns The number of transactions of the wallet in string
 */
export const getTransactionCount = async (walletAddress: string) => {
  const transactionCount = await provider.getTransactionCount(walletAddress);
  return transactionCount.toString();
};

/**
 *
 * Function to send a transaction
 * @param from The sender address
 * @param to The receiver address
 * @param amount The amount to send
 * @returns The transaction in a Promise ethers.TransactionResponse
 */
export const sendTransaction = async (
  from: string,
  to: string,
  amount: string
) => {
  const signer = await provider.getSigner(from);

  const tx = await signer.sendTransaction({
    to: to,
    value: ethers.parseEther(amount),
  });

  return tx;
};

/**
 *
 * Function to load all blocks
 * This function loads all blocks in the blockchain and stores them in the blocks array
 */
const loadBlocks = async () => {
  if (!hasLoadedBlocks) {
    const latestBlock = await provider.getBlockNumber();

    for (let i = latestBlock; i >= 0; i--) {
      const block = await provider.getBlock(i);
      blocks.push(block!);
    }

    hasLoadedBlocks = true;
  }
};

/**
 *
 * Function to get the last activity of a wallet
 * @param transactions The transactions of the wallet
 * @returns The last activity of the wallet in string
 */
export const getLatestActivity = async (
  transactions: Array<ethers.TransactionResponse>
) => {
  if (!transactions || transactions.length === 0) {
    return "No activity found";
  }
  let latestActivity = "";

  let latestTransaction = transactions[0];

  // Loop through all transactions to get the latest transaction of the wallet and see if the hash is in the blocks
  latestActivity =
    blocks
      .find((block) => {
        if (block.transactions.includes(latestTransaction.hash)) {
          return block;
        }
      })
      ?.timestamp.toString() || "No activity found";

  let date = new Date(parseInt(latestActivity) * 1000);

  return date.toDateString();

  //? Previous code where I used binary search to find the latest activity of a wallet
  //? Really liked the code so I am keeping it here for reference
  // let low = 0;

  // let high = blocks.length - 1;

  // let date = new Date(latestActivity * 1000);
  // latestActivity = date.toDateString();

  // while (low <= high) {
  //   let mid = Math.floor((low + high) / 2);

  //   const block = blocks[mid];

  //   let found = false;

  //   for (const transaction of transactions) {
  //     const tx = (await provider.getTransaction(
  //       transaction
  //     )) as ethers.TransactionResponse;
  //     if (
  //       tx.from.toLowerCase() === walletAddress.toLowerCase() ||
  //       (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase())
  //     ) {
  //       let date = new Date(block.timestamp * 1000);
  //       found = true;
  //       latestActivity = date.toDateString();
  //       break;
  //     }
  //   }

  //   if (found) {
  //     low = mid + 1;
  //   } else {
  //     high = mid - 1;
  //   }
  // }
};

/**
 *
 * Function to get the transaction details with the hash
 * @param transactionHash The transaction hash
 * @returns The transaction details in a Promise ethers.TransactionResponse
 *
 */
export const getTransactionDetailsWithHash = async (
  transactionHash: string
) => {
  let tx = await provider.getTransaction(transactionHash);

  return tx;
};

// Function to get all transactions of a wallet
//// This function loops through all blocks and transactions to find the transactions of a wallet (Previous code, not used)
//// Not the best way to do this since it is slow and inefficient (Previous code, not used)
// Function uses map and promise all to fetch transactions in parallel since it's much faster than using a for loop
// A better approach would be to use a database to store the transactions and only load new transactions when needed
// But since the blockchain is not that big, this is fine for now
// Another approach that can be used is using json-server to store the transactions in a json file and query the transactions
/**
 *
 * Function to get all transactions of a wallet
 * @param walletAddress - The wallet address
 * @returns  The transactions of the wallet in a Promise array
 */
export const getTransactions = async (walletAddress: string) => {
  let transactions: ethers.TransactionResponse[] = [];

  // Filter transactions in parallel
  // The previous way which was looping through all blocks and transactions was very slow and inefficient so I used map and promise all to fetch transactions in parallel
  // This made the loading of transactions much faster and more efficient
  const transactionPromises = blocks.flatMap((block) =>
    block.transactions.map(async (txHash: string) => {
      try {
        const tx = (await provider.getTransaction(
          txHash
        )) as ethers.TransactionResponse;
        if (
          tx.from.toLowerCase() === walletAddress.toLowerCase() ||
          (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase())
        ) {
          transactions.push(tx);
        }
      } catch (error) {
        console.error(`Failed to fetch transaction ${txHash}:`, error);
      }
    })
  );

  // Wait for all transactions to be fetched
  await Promise.all(transactionPromises);

  return transactions;
};

/**
 *
 * Function to get all transactions
 * @param limit The number of transactions to fetch
 * @returns The transactions in a Promise array
 */
export const getAllTransactions = async (limit: number) => {
  let transactions = [];

  let count = 0;

  for (const block of blocks) {
    for (const transaction of block.transactions) {
      const tx = (await provider.getTransaction(
        transaction
      )) as ethers.TransactionResponse;
      transactions.push(tx);

      count++;

      if (count === limit) {
        return transactions;
      }
    }
  }
  return transactions;
};

/**
 *
 * Function to set a new active wallet
 * @param walletAddress The wallet address
 */
export const setActiveWallet = async (walletAddress: string) => {
  activeWallet = new LocalWallet(walletAddress);

  await activeWallet.init();

  localStorage.setItem("activeWallet", walletAddress);
};

/**
 *
 * Function to show the transaction details on the browser
 * @param transaction The transaction
 * @param persistent Whether the message box should be persistent or not
 */
export const showTransactionDetails = async (
  transaction: ethers.TransactionResponse,
  persistent?: boolean
) => {
  showMessageBox(
    "success",
    "Transaction Details",
    `
    
<div class="flex flex-col gap-4 w-full overflow-auto">

    <!-- Transaction Hash -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">Transaction Hash:</p>
      <p>${transaction.hash}</p>
    </div>

    <!-- Timestamp -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">Timestamp:</p>
      <p>${await new Date(
        (await getBlockTimeStamp(transaction.blockNumber!)) * 1000
      ).toLocaleString()}</p>
    </div>

    <!-- From -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">From:</p>
      <p>${transaction.from}</p>
    </div>

    <!-- To -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">To:</p>
      <p>${transaction.to || "Contract Creation"}</p>
    </div>

    <!-- Transaction Amount -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">Value:</p>
      <p>${getValueInEther(transaction.value)} ETH</p>
    </div>

    <!-- Gas Price -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">Gas Price:</p>
      <p>${getValueInEther(transaction.gasPrice)} ETH</p>
    </div>

    <!-- Gas Limit -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">Gas Limit:</p>
      <p>${transaction.gasLimit.toString()}</p>
    </div>

    <!-- Block Number -->
    <div class="flex gap-4 flex-col lg:flex-row">
      <p class="font-bold">Block Number:</p>
      <p>${transaction.blockNumber?.toString() || "Pending"}</p>
    </div>

</div>

    `,
    persistent ? true : false
  );
};
