/*
 *
 * searchBar.ts This file is responsible for the search bar functionality
 *
 * This file is responsible for the search bar functionality
 * It allows the user to search for a block number, transaction hash or wallet address
 * It then displays the details of the block, transaction or wallet address
 */

// ---- imports from other scripts ----
import {
  blocks,
  getAllWalletsAddress,
  getTransactionDetailsWithHash,
  showTransactionDetails,
} from "./ethers";
import { showMessageBox } from "./messageBox";

/**
 * Function to initialize the search bar
 */
export const initializeSearchBar = async () => {
  const searchBarForm = document.getElementById(
    "search-form"
  ) as HTMLFormElement;
  searchBarForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(searchBarForm);

    const query = formData.get("search") as string;

    //This checks if characters in the search bar are less than 10 then it has to be a blockNumber.
    // Not my favorite way to do this but it works and is simple
    // I can display the block details but since it's not relevant to the project I will just display the first transaction in that block
    if (query.length < 10) {
      try {
        const blockNumber = parseInt(query);

        if (blockNumber < blocks.length) {
          let correctBlock = blocks.find(
            (block) => block.number === blockNumber
          );
          let transactionInBlock = await getTransactionDetailsWithHash(
            correctBlock!.transactions[0]
          );

          showTransactionDetails(transactionInBlock!);
        }

        // If the block number is not found in the blocks array
        if (isNaN(blockNumber)) {
          showMessageBox(
            "error",
            "Invalid Block Number",
            "Invalid Block Number entered"
          );
        }
      } catch (error) {
        // Or if any other error occurs
        showMessageBox(
          "error",
          "Invalid Block Number",
          "Invalid Block Number entered"
        );
        return;
      }
    }
    // If the search query is not a block number
    else {
      // Check if the query is a transaction hash
      try {
        let transaction = await getTransactionDetailsWithHash(query);

        // If the transaction is not found, check if the query is a wallet address
        if (!transaction) {
          let availableWallets = await getAllWalletsAddress();

          if (availableWallets.includes(query)) {
            location.href = `/wallet/#${query}`;

            if (location.pathname === "/wallet/") {
              location.reload();
            }

            return;
          }

          showMessageBox("error", "Invalid Address", "Invalid Address entered");
          return;
        }

        // If the transaction is found, display the transaction details
        showTransactionDetails(transaction!);
      } catch (error) {
        // If nothing is found, show an error message
        showMessageBox("error", "Invalid Address", "Invalid Address entered");
        return;
      }
    }
  });
};
