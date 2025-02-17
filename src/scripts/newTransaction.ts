import {
  activeWallet,
  getAllWalletsAddress,
  getBalanceInEther,
  sendTransaction,
  showTransactionDetails,
} from "./ethers";
import { showMessageBox } from "./messageBox";

export const initializeTransactionPage = async () => {
  let transactionForm = document.getElementById(
    "new-transaction-form"
  ) as HTMLFormElement;

  let allWalletsAddress = await getAllWalletsAddress();

  let recepientAddress = location.hash.split("#")[1];

  let dataList = document.getElementById("wallets-list") as HTMLDataListElement;
  let maxAmount = document.getElementById("max-amount") as HTMLSpanElement;

  let fromInput = transactionForm.elements.namedItem(
    "from"
  ) as HTMLInputElement;

  let parsedMaxAmount = parseFloat(activeWallet.balance.slice(0, 8));

  //   Add the active wallet balance to the maxAmount span
  maxAmount.textContent = parsedMaxAmount.toString();
  maxAmount.addEventListener("click", () => {
    (transactionForm.elements.namedItem("amount") as HTMLInputElement).value =
      parsedMaxAmount.toString();
  });

  //   Add all the wallet addresses to the datalist
  allWalletsAddress.forEach((address) => {
    let option = document.createElement("option");
    option.value = address;
    dataList.appendChild(option);
  });

  (transactionForm.elements.namedItem("from") as HTMLInputElement).value =
    activeWallet.address;

  if (recepientAddress) {
    (transactionForm.elements.namedItem("to") as HTMLInputElement).value =
      recepientAddress;
  }

  fromInput.addEventListener("input", async (event) => {
    let balance = await getBalanceInEther(fromInput.value);
    parsedMaxAmount = parseFloat(balance.slice(0, 8));
    //   Add the active wallet balance to the maxAmount span
    maxAmount.textContent = parsedMaxAmount.toString();
  });

  transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(transactionForm);
    let transactionData = {
      from: formData.get("from") as string,
      to: formData.get("to") as string,
      amount: formData.get("amount") as string,
    };

    if (transactionData.from === transactionData.to) {
      showMessageBox(
        "error",
        "Invalid transaction",
        "Sender and recipient addresses cannot be the same"
      );

      return;
    }
    if (!allWalletsAddress.includes(transactionData.from)) {
      showMessageBox(
        "error",
        "Invalid sender address",
        "Invalid sender address, please enter a valid sender address"
      );

      return;
    }
    if (!allWalletsAddress.includes(transactionData.to)) {
      showMessageBox(
        "error",
        "Invalid recipient address",
        "Invalid recipient address, please enter a valid recipient address"
      );

      return;
    }

    try {
      let amount = parseFloat(transactionData.amount);
      if (isNaN(amount)) {
        throw new Error("Invalid amount");
      }
      if (amount > parseFloat(activeWallet.balance)) {
        throw new Error("Insufficient balance");
      }
    } catch (error) {
      showMessageBox(
        "error",
        "Invalid amount",
        "Invalid amount, please enter a valid amount"
      );
      return;
    }

    try {
      let transaction = await sendTransaction(
        transactionData.from,
        transactionData.to,
        transactionData.amount
      );

      showTransactionDetails(transaction, true);
    } catch (error) {
      showMessageBox(
        "error",
        "Transaction failed",
        "Transaction failed, please try again"
      );
    }
  });
};
