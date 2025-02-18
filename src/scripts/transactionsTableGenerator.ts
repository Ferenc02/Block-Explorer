/*
 *
 *  transactionsTableGenerator.ts - This file is responsible for generating the transactions table
 *
 * This file is responsible for generating the transactions table
 * It fetches the transactions from the blockchain and displays them in a table
 * It also allows the user to view the details of a transaction
 */

// ---- imports from other scripts ----
import { ethers } from "ethers";
import {
  getAllTransactions,
  getBlockTimeStamp,
  getValueInEther,
  showTransactionDetails,
} from "./ethers";

import { initializeCopyButtons } from "./copyButton";

/**
 * Function to initialize the transactions table
 * @param {number} limit - The number of transactions to fetch from the blockchain
 * @param {Array<ethers.TransactionResponse>} transactions - An optional parameter to pass the transactions directly to the function
 *
 */
export const initializeTransactionsTable = async (
  limit: number,
  transactions?: Array<ethers.TransactionResponse>
) => {
  let transactionsTable =
    document.querySelector<HTMLTableElement>("#transactions-grid")!;

  if (!transactions) {
    transactions = await getAllTransactions(limit);
  }

  for (const transaction of transactions) {
    let row = await generateTransactionRow(transaction);
    transactionsTable.appendChild(row);
  }

  initializeCopyButtons();
};

/**
 *
 * Function to generate a row in the transactions table
 *
 * @param transaction TransactionResponse object
 * @returns A div element containing the transaction details
 *
 * I tried to use a table element for the transactions table but it was difficult to style it properly so good old grid worked wonders
 */
let generateTransactionRow = async (
  transaction: ethers.TransactionResponse
) => {
  let row = document.createElement("div");
  row.classList.add(
    "grid",
    "grid-cols-7",
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
                  <p class="copy-element ${
                    transaction.from === location.hash.slice(1)
                      ? "!text-zinc-600"
                      : ""
                  }">
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
                  <p class="copy-element ${
                    transaction.to === location.hash.slice(1)
                      ? "!text-zinc-600"
                      : ""
                  }">
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
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center justify-center"
              >
                ${getValueInEther(transaction.value)} ETH
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center justify-end"
              >
                ${await new Date(
                  (await getBlockTimeStamp(transaction.blockNumber!)) * 1000
                ).toLocaleString()}
              </div>
              <div
                class="px-4 py-1 border-b border-table-border overflow-hidden flex items-center lg:justify-end justify-start"
              >
                ${transaction.blockNumber}
              </div>
              <div
                class="px-2 py-1 border-b border-table-border overflow-hidden flex items-center justify-center"
              >
                <button
                  id="details-button"
                  class="text-white !bg-ganache-yellow-light px-12 py-1 font-medium shadow-sm border border-search-border cursor-pointer hover:scale-[1.01] rounded-md"
                  >
                  Details
                </button>
                </div>
              </div>`;

  row.innerHTML = htmlContent;

  row.querySelector("#details-button")?.addEventListener("click", () => {
    showTransactionDetails(transaction);
  });

  return row;
};
