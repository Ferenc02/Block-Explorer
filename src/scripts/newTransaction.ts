/*
 *
 *
 *  newTransaction.ts - This file contains the logic for the new transaction page
 *
 *
 * It allows the user to send a transaction from one wallet to another
 * It also validates the transaction and shows the transaction details
 *
 *
 * */

// ---- imports from other scripts ----
import {
  activeWallet,
  getAllWalletsAddress,
  getBalanceInEther,
  sendTransaction,
  showTransactionDetails,
} from "./ethers";
import { showMessageBox } from "./messageBox";

/**
 * Function to initialize the new transaction page
 */
export const initializeTransactionPage = async () => {
  // ---- DOM elements ----
  let transactionForm = document.getElementById(
    "new-transaction-form"
  ) as HTMLFormElement;
  let dataList = document.getElementById("wallets-list") as HTMLDataListElement;
  let maxAmount = document.getElementById("max-amount") as HTMLSpanElement;

  let fromInput = transactionForm.elements.namedItem(
    "from"
  ) as HTMLInputElement;

  let allWalletsAddress = await getAllWalletsAddress();
  let recepientAddress = location.hash.split("#")[1];
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

  //   Add an event listener to the from input to get the balance of the sender
  fromInput.addEventListener("input", async () => {
    let balance = await getBalanceInEther(fromInput.value);
    parsedMaxAmount = parseFloat(balance.slice(0, 8));
    //   Add the active wallet balance to the maxAmount span
    maxAmount.textContent = parsedMaxAmount.toString();
  });

  //  Add an event listener to the form to send the transaction
  transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(transactionForm);
    let transactionData = {
      from: formData.get("from") as string,
      to: formData.get("to") as string,
      amount: formData.get("amount") as string,
    };

    //  Validate the transaction
    // Could have used a better way to validate the transaction but this works
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

    // Check if the amount is a valid number and if the sender has enough balance
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

    // If everything looks good, send the transaction
    try {
      let transaction = await sendTransaction(
        transactionData.from,
        transactionData.to,
        transactionData.amount
      );

      // Display the transaction details, I reused the function from the ethers.ts file to display the transaction details instead of writing a new one
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
