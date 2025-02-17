import {
  getAverageBlockTime,
  getNetworkName,
  getTotalBlocks,
  getTotalTransactions,
  getTotalWallets,
  providerExists,
} from "./ethers";

let elements: any;

export const initializeFooter = async () => {
  const footer = document.querySelector<HTMLDivElement>("footer")!;

  let elementsSelector = {
    footerTotalBlocks: "footer-total-blocks",
    footerTotalTransactions: "footer-total-transactions",
    footerBlockTime: "footer-block-time",
    footerTotalWallets: "footer-total-wallets",
    footerNetworkSync: "footer-network-sync",
    footerNetwork: "footer-network",
  };

  elements = {
    footerTotalBlocks: footer.querySelector<HTMLSpanElement>(
      `.${elementsSelector.footerTotalBlocks}`
    ),
    footerTotalTransactions: footer.querySelector<HTMLSpanElement>(
      `.${elementsSelector.footerTotalTransactions}`
    ),
    footerBlockTime: footer.querySelector<HTMLSpanElement>(
      `.${elementsSelector.footerBlockTime}`
    ),
    footerTotalWallets: footer.querySelector<HTMLSpanElement>(
      `.${elementsSelector.footerTotalWallets}`
    ),
    footerNetworkSync: footer.querySelector<HTMLSpanElement>(
      `.${elementsSelector.footerNetworkSync}`
    ),
    footerNetwork: footer.querySelector<HTMLSpanElement>(
      `.${elementsSelector.footerNetwork}`
    ),
  };

  await updateFooter();
};

// Function to update the footer with the latest data
const updateFooter = async () => {
  const data = {
    totalBlocks: "0",
    totalTransactions: "0",
    blockTime: "0",
    totalWallets: "0",
    networkSync: "0",
    network: "0",
  };

  data.totalBlocks = await getTotalBlocks();

  data.totalTransactions = await getTotalTransactions();

  data.blockTime = await getAverageBlockTime();

  data.totalWallets = await getTotalWallets();

  data.networkSync = providerExists ? "Synced ✅" : "Not Synced ❌";

  data.network = await getNetworkName();

  elements.footerTotalBlocks!.innerText = `📦 Total Blocks: ${data.totalBlocks}`;
  elements.footerTotalTransactions!.innerText = `🔄 Total Transactions: ${data.totalTransactions}`;
  elements.footerBlockTime!.innerText = `⏳ Average Block Time: ${data.blockTime} s`;
  elements.footerTotalWallets!.innerText = `🔗 Total Wallets: ${data.totalWallets}`;
  elements.footerNetworkSync!.innerText = `🖧 Network Status: ${data.networkSync}`;
  elements.footerNetwork!.innerText = `📡 Network: ${data.network}`;
};
