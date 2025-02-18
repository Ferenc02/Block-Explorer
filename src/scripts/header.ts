/*
 *
 * header.ts - The script for the header of the application
 *
 * */

// --- Other Imports ---
import { activeWallet } from "./ethers";

/**
 * Function to initialize the header of the application
 */
export const initializeHeader = () => {
  let headerWalletAddress = document.querySelector<HTMLSpanElement>(
    ".header-wallet-address"
  )!;
  headerWalletAddress.innerText = activeWallet.address;
};
