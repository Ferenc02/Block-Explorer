/*
 * viewWallet.ts - The script for the view wallet page of the application
 *
 * This script is responsible for initializing the view wallet page of the application
 * It shows the wallet address, balance, total transactions, total received, and total sent
 * It also shows the QR code for the wallet address and allows the user to set the wallet as active
 *
 */

// ---- imports from other scripts ----
import { initializeCopyButtons } from "./copyButton";
import { LocalWallet, setActiveWallet } from "./ethers";
import { initializeHeader } from "./header";
import { showMessageBox } from "./messageBox";
import { initializeTransactionsTable } from "./transactionsTableGenerator";

/**
 *
 * Function to initialize the view wallet page
 */
export const initializeViewWallet = async () => {
  // Create a new instance of the LocalWallet class using the wallet address from the URL hash
  // I could have used query parameters instead of the hash but I wanted to keep the URL clean and easier to work with
  let wallet = new LocalWallet(location.hash.slice(1));

  // Initialize the wallet so it gets the updated balance and transactions
  await wallet.init();

  if (location.hash === "" || !wallet) {
    showMessageBox("error", "404 Not Found", "Wallet address not found");
    return;
  }

  // ---- DOM elements ----
  let walletAddress =
    document.querySelector<HTMLSpanElement>(".wallet-address")!;

  let walletBalance =
    document.querySelector<HTMLSpanElement>(".wallet-balance")!;

  let walletTotalTransactions = document.querySelector<HTMLSpanElement>(
    ".wallet-total-transactions"
  )!;

  let walletTotalReceived = document.querySelector<HTMLSpanElement>(
    ".wallet-total-received"
  )!;
  let walletTotalSent =
    document.querySelector<HTMLSpanElement>(".wallet-total-sent")!;

  let walletSectionQRCodeImage =
    document.querySelector<HTMLImageElement>(".wallet-section-qr")!;

  let useWalletButton =
    document.querySelector<HTMLButtonElement>("#use-wallet-button")!;

  let makeTransactionButton = document.querySelector<HTMLButtonElement>(
    "#make-transaction-button"
  )!;

  // I'm using Regex to replace the data attribute since it can be faster than turning it into an array and then joining it back together
  walletSectionQRCodeImage.src = walletSectionQRCodeImage.src.replace(
    /data=[^&]+/,
    `data=${wallet.address}`
  );

  // Set the wallet address, balance, total transactions, total received, and total sent
  walletAddress.innerText = wallet.address;
  walletBalance.innerText = wallet.balance + " ETH";
  walletTotalTransactions.innerText =
    wallet.transactions?.length?.toString() || "0";
  // Simple filter to get the total received and total sent transactions
  walletTotalReceived.innerText = wallet.transactions
    .filter((transaction) => transaction.to === wallet.address)
    .length.toString();
  walletTotalSent.innerText = wallet.transactions
    .filter((transaction) => transaction.from === wallet.address)
    .length.toString();

  // If the wallet is not the active wallet, show the use wallet button
  if (wallet.address !== localStorage.getItem("activeWallet")) {
    useWalletButton.classList.remove("hidden");
  }

  // If the wallet is not the active wallet, show the make transaction button since you can't make a transaction to the same wallet
  if (wallet.address !== localStorage.getItem("activeWallet")) {
    makeTransactionButton.classList.remove("hidden");
  }

  // Event listener to set the wallet as the active wallet
  useWalletButton.addEventListener("click", async () => {
    await setActiveWallet(wallet.address);

    showMessageBox("success", "Success", "Wallet set as active");

    initializeHeader();
  });

  // Event listener to navigate to the new transaction page with the wallet address as a hash parameter
  makeTransactionButton.addEventListener("click", async () => {
    location.href = `/new-transaction/#${wallet.address}`;
  });

  // Initialize the transactions table with the transactions from the wallet. Show the latest 50 transactions only.
  // Can be changed to show more or less transactions
  await initializeTransactionsTable(50, wallet.transactions);

  // Initialize the copy buttons again so the copy button for the wallet address works
  initializeCopyButtons();
};
