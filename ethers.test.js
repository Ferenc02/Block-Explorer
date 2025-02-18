import { describe, beforeEach, it, expect } from "vitest";
import {
  checkProvider,
  getTotalTransactions,
  provider,
  initializeProvider,
  getTotalWallets,
  getNetworkName,
} from "/src/scripts/ethers";

describe("Provider Testing", async () => {
  it("Should return true if the provider is loaded ", async () => {
    let providerExists = await checkProvider();
    console.log("providerExists: ", providerExists);
    expect(providerExists).toBeTruthy();
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
