import { activeWallet } from "./ethers";

export const initializeHeader = () => {
  let headerWalletAddress = document.querySelector<HTMLSpanElement>(
    ".header-wallet-address"
  )!;

  headerWalletAddress.innerText = activeWallet.address;
};
