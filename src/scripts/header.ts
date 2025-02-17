import { activeWallet } from "./ethers";

export const initializeHeader = () => {
  if (location.pathname !== "/new-transaction/") {
    let headerWalletAddress = document.querySelector<HTMLSpanElement>(
      ".header-wallet-address"
    )!;
    headerWalletAddress.innerText = activeWallet.address;
  }
};
