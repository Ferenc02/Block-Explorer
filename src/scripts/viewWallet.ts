import { initializeCopyButtons } from "./copyButton";
import { LocalWallet, setActiveWallet } from "./ethers";
import { initializeHeader } from "./header";
import { showMessageBox } from "./messageBox";
import { initializeTransactionsTable } from "./transactionsTableGenerator";

export const initializeViewWallet = async () => {
  let wallet = new LocalWallet(location.hash.slice(1));

  await wallet.init();

  console.log("wallet", wallet);

  if (location.hash === "" || !wallet) {
    showMessageBox("error", "404 Not Found", "Wallet address not found");
    return;
  }

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
  walletTotalReceived.innerText = wallet.transactions
    .filter((transaction) => transaction.to === wallet.address)
    .length.toString();
  walletTotalSent.innerText = wallet.transactions
    .filter((transaction) => transaction.from === wallet.address)
    .length.toString();

  if (wallet.address !== localStorage.getItem("activeWallet")) {
    useWalletButton.classList.remove("hidden");
  }

  useWalletButton.addEventListener("click", async () => {
    await setActiveWallet(wallet.address);

    showMessageBox("success", "Success", "Wallet set as active");

    initializeHeader();
  });

  await initializeTransactionsTable(20, wallet.transactions);

  initializeCopyButtons();
};
