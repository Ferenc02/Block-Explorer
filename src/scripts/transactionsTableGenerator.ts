import { ethers } from "ethers";
import {
  getAllTransactions,
  getBlockTimeStamp,
  getValueInEther,
} from "./ethers";

export const initializeTransactionsTable = async (limit: number) => {
  let transactionsTable =
    document.querySelector<HTMLTableElement>("#transactions-grid")!;

  let transactions = await getAllTransactions(limit);

  for (const transaction of transactions) {
    let row = await generateTransactionRow(transaction);
    transactionsTable.appendChild(row);
  }
};

let generateTransactionRow = async (
  transaction: ethers.TransactionResponse
) => {
  let row = document.createElement("div");
  row.classList.add(
    "grid",
    "grid-cols-[350px_250px_250px_auto_auto_auto_auto]",
    "w-full",
    "font-bold",
    "text-table-text",
    "transactions-table-row"
  );

  let htmlContent = `          
                <div class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center">   
                <div class="group relative cursor-pointer w-full">
                  <p class="copy-element">
                    ${transaction.hash}
                  </p>
                  <span
                    id="tooltip"
                    class="tooltip group-hover:opacity-100 transition-opacity absolute bottom-0 right-0 left-0 w-fit m-auto opacity-0 mx-auto whitespace-normal break-words rounded-lg py-1.5 px-3 text-sm font-normal focus:outline-none shadow-sm bg-search pointer-events-none"
                    >Copy</span
                  >
                </div>
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center"
              >
                <div class="group relative cursor-pointer w-full">
                  <p class="copy-element">
                    ${transaction.from}
                  </p>
                  <span
                    id="tooltip"
                    class="tooltip group-hover:opacity-100 transition-opacity absolute bottom-0 right-0 left-0 w-fit m-auto opacity-0 mx-auto whitespace-normal break-words rounded-lg py-1.5 px-3 text-sm font-normal focus:outline-none shadow-sm bg-search pointer-events-none"
                    >Copy</span
                  >
                </div>
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center"
              >
                <div class="group relative cursor-pointer w-full">
                  <p class="copy-element">
                    ${transaction.to}
                  </p>
                  <span
                    id="tooltip"
                    class="tooltip group-hover:opacity-100 transition-opacity absolute bottom-0 right-0 left-0 w-fit m-auto opacity-0 mx-auto whitespace-normal break-words rounded-lg py-1.5 px-3 text-sm font-normal focus:outline-none shadow-sm bg-search pointer-events-none"
                    >Copy</span
                  >
                </div>
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center"
              >
                ${getValueInEther(transaction.value)} ETH
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center"
              >
                ${await new Date(
                  (await getBlockTimeStamp(transaction.blockNumber!)) * 1000
                ).toLocaleString()}
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center"
              >
                ${transaction.blockNumber}
              </div>
              <div
                class="px-2 py-1 border-b border-table-border overflow-hidden flex items-center justify-end"
              >
                <button
                  class="text-white bg-ganache-yellow-light px-12 py-1 font-medium shadow-sm border border-search-border cursor-pointer hover:scale-[1.01] rounded-md"
                >
                  Details
                </button>
                </div>
              </div>`;

  row.innerHTML = htmlContent;

  return row;
};
