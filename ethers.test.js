// --- Other Imports ---
import { describe, beforeEach, it, expect } from "vitest";
import {
  checkProvider,
  getTotalTransactions,
  provider,
  initializeProvider,
  getTotalWallets,
  getNetworkName,
  sendTransaction,
} from "/src/scripts/ethers";

/**
 * Test Suite for Ethers.js
 * It uses the real provider to test the functions so it will only work with a real provider
 * In a real environment, the provider should be mocked to avoid unnecessary costs and stress on the network
 */
describe("Provider Testing", async () => {
  it("Should return true if the provider is loaded ", async () => {
    let providerExists = await checkProvider();
    console.log("providerExists: ", providerExists);
    expect(providerExists).toBeTruthy();
  });
});

describe("Get TotalWallets", () => {
  it("Should return the total number of wallets", async () => {
    await initializeProvider();
    const latestBlockNumber = await provider.getBlockNumber();
    let totalWallets = await getTotalWallets();
    totalWallets = parseInt(totalWallets);
    expect(totalWallets).toBeGreaterThan(0);
  });
});

describe("Get Network Name", () => {
  it("Should return the network name Ganache", async () => {
    await initializeProvider();
    const network = await getNetworkName();
    console.log("Network: ", network);
    expect(network).toBe("Ganache");
  });
});

describe("Retrieve Wallet Address", () => {
  it("Should fetch and return a valid wallet address from the provider", async () => {
    await initializeProvider();
    const walletAddress = await provider.listAccounts();
    console.log("Wallet Address: ", walletAddress);
    expect(walletAddress).toBeTruthy();
  });
});

describe("Create a transaction", () => {
  it("Should create a transaction", async () => {
    await initializeProvider();
    const walletAddress = await provider.listAccounts();

    const from = walletAddress[0].address;
    const to = walletAddress[1].address;
    const amountToSend = 0.1;

    const transactionTemplate = {
      accessList: expect.any(Array),
      blobVersionedHashes: null,
      blockHash: expect.any(String),
      blockNumber: expect.any(Number),
      chainId: expect.any(BigInt),
      data: "0x",
      from: expect.any(String),
      gasLimit: expect.any(BigInt),
      gasPrice: expect.any(BigInt),
      hash: expect.any(String),
      maxFeePerBlobGas: null,
      maxFeePerGas: expect.any(BigInt),
      maxPriorityFeePerGas: expect.any(BigInt),
      nonce: expect.any(Number),
      to: expect.any(String),
      type: 2,
      value: expect.any(BigInt),
    };

    const tx = await sendTransaction(from, to, amountToSend.toString());
    console.log("Transaction: ", tx);
    expect(tx).toMatchObject(transactionTemplate);
  });
});

describe("Total Transactions", () => {
  it("Should return the total number of transactions", async () => {
    await initializeProvider();
    const latestBlockNumber = await provider.getBlockNumber();
    console.log("Latest Block Number: ", latestBlockNumber);

    let totalTransactions = await getTotalTransactions();
    totalTransactions = parseInt(totalTransactions);
    console.log("Total Transactions: ", totalTransactions);

    expect(totalTransactions).toBeGreaterThan(0);
  });
});
