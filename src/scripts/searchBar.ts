import {
  blocks,
  getAllWalletsAddress,
  getTransactionDetailsWithHash,
  showTransactionDetails,
} from "./ethers";
import { showMessageBox } from "./messageBox";

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
    // I can display the block details but since it's not relevant to the project I will just display the first transaction in the block
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

        if (isNaN(blockNumber)) {
          showMessageBox(
            "error",
            "Invalid Block Number",
            "Invalid Block Number entered"
          );
        }
      } catch (error) {
        showMessageBox(
          "error",
          "Invalid Block Number",
          "Invalid Block Number entered"
        );
        return;
      }
    } else {
      try {
        let transaction = await getTransactionDetailsWithHash(query);

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

        showTransactionDetails(transaction!);
      } catch (error) {
        showMessageBox("error", "Invalid Address", "Invalid Address entered");
        return;
      }
    }
  });
};
