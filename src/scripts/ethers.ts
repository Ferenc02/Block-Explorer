import { ethers } from "ethers";
import { showMessageBox } from "./messageBox";

export let provider: ethers.JsonRpcApiProvider;

export let providerExists = false;

let hasLoadedBlocks = false;

export let blocks: Array<ethers.Block> = [];
export let activeWallet: LocalWallet;

// Function to initialize the provider
export async function initializeProvider() {
  provider = (await checkProvider()) || new ethers.JsonRpcProvider();

  await loadBlocks();

  let localStorageActiveWallet =
    localStorage.getItem("activeWallet") ||
    (await provider.listAccounts())[0]?.address ||
    "";

  activeWallet = new LocalWallet(localStorageActiveWallet);

  await activeWallet.init();

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
// Get block timestamp
export const getBlockTimeStamp = async (blockNumber: number) => {
  const block = (await provider.getBlock(blockNumber)) as ethers.Block;
  return block.timestamp;
};

// Get balance of a wallet in ether
export const getBalanceInEther = async (walletAddress: string) => {
  const balance = await provider.getBalance(walletAddress);
  return ethers.formatEther(balance);
};

// Get value from a transaction in ether
export const getValueInEther = (value: ethers.BigNumberish): string => {
  return ethers.formatEther(value);
};

// Get number of transactions of a wallet
export const getTransactionCount = async (walletAddress: string) => {
  const transactionCount = await provider.getTransactionCount(walletAddress);
  return transactionCount.toString();
};

// Function to send a transaction
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

// Function to load all blocks
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

// Function to get the last activity of a wallet
//// Binary search is used to find the last activity of a wallet to speed up the process
//// Would not be efficient to loop through all blocks to find the last activity
// The function now finds latest activity by checking the transactions in that wallet and checks all blocks to find the latest activity
export const getLatestActivity = async (
  transactions: Array<ethers.TransactionResponse>
) => {
  if (!transactions || transactions.length === 0) {
    return "No activity found";
  }
  let latestActivity = "";

  let latestTransaction = transactions[0];

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
// Function to get the transaction details with the hash
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
export const getTransactions = async (walletAddress: string) => {
  let transactions: ethers.TransactionResponse[] = [];

  // Filter transactions in parallel
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

  await Promise.all(transactionPromises);

  return transactions;
};

// Function to get all transactions
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

// Function to set new active wallet
export const setActiveWallet = async (walletAddress: string) => {
  activeWallet = new LocalWallet(walletAddress);

  await activeWallet.init();

  localStorage.setItem("activeWallet", walletAddress);
};

// show Transactions Details
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

  // transactionHash.innerText = transaction.hash;
  // transactionBlockNumber.innerText = transaction.blockNumber?.toString() || "Pending";
  // transactionFrom.innerText = transaction.from;
  // transactionTo.innerText = transaction.to || "Contract Creation";
  // transactionValue.innerText = getValueInEther(transaction.value) + " ETH";
  // transactionGasPrice.innerText = getValueInEther(transaction.gasPrice) + " ETH";
  // transactionGasLimit.innerText = transaction.gasLimit.toString();
  // transactionGasUsed.innerText = transaction.gasUsed.toString();
  // transactionStatus.innerText = transaction.blockNumber ? "Confirmed" : "Pending";
  // transactionTimeStamp.innerText = new Date(transaction.timestamp * 1000).toDateString();
};

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
