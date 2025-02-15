import { LocalWallet } from "./ethers";
import { showMessageBox } from "./messageBox";

export const initializeViewWallet = async () => {
  let wallet = new LocalWallet(location.hash.slice(1));

  if (location.hash === "" || !wallet) {
    showMessageBox("error", "404 Not Found", "Wallet address not found");
    return;
  }
};
