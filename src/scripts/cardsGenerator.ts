import { initializeCopyButtons } from "./copyButton";
import {
  setActiveWallet,
  getAllWalletsAddress,
  activeWallet,
  LocalWallet,
} from "./ethers";
import { showMessageBox } from "./messageBox";
import { initializeHeader } from "./header";

let walletCards: any;

export const initializeCards = async () => {
  let cardContainer =
    document.querySelector<HTMLDivElement>("#wallets-container")!;
  walletCards = [];

  cardContainer.innerHTML = "";

  let wallets = await getAllWalletsAddress();

  for (const walletAddress of wallets) {
    let card = await generateCard(walletAddress);
    cardContainer.appendChild(card);
    walletCards.push(card);
  }

  //   // Add a delay to make the cards appear one by one instead of all at once for a better user experience
  //   // await sleep(50);
  // }

  // Add event listeners for the sort buttons
  let selectionButton =
    document.querySelector<HTMLButtonElement>("#sort-wallets");

  selectionButton!.addEventListener("change", (event) => {
    let sortBy = (event.target as HTMLButtonElement).value;
    sortCards(sortBy);
  });

  await initializeCopyButtons();
};

// Function to sort the cards based on the selected option
const sortCards = (sortBy: string) => {
  if (sortBy === "balance") {
    walletCards.sort((a: any, b: any) => {
      let balanceA = parseFloat(a.getAttribute("data-balance")!.slice(0, 7));
      let balanceB = parseFloat(b.getAttribute("data-balance")!.slice(0, 7));
      return balanceB - balanceA;
    });
  } else if (sortBy === "transactions") {
    walletCards.sort((a: any, b: any) => {
      let transactionCountA = parseInt(a.getAttribute("data-transactions")!);
      let transactionCountB = parseInt(b.getAttribute("data-transactions")!);
      return transactionCountB - transactionCountA;
    });
  } else if (sortBy === "last-activity") {
    walletCards.sort((a: any, b: any) => {
      let lastActivityA = a.getAttribute("data-last-activity")!;
      let lastActivityB = b.getAttribute("data-last-activity")!;
      return (
        new Date(lastActivityB).getTime() - new Date(lastActivityA).getTime()
      );
    });
  }

  let cardContainer =
    document.querySelector<HTMLDivElement>("#wallets-container")!;
  cardContainer.innerHTML = "";
  walletCards.forEach((card: any) => {
    cardContainer.appendChild(card);
  });
};

// Function to generate a card for each wallet
const generateCard = async (walletAddress: string) => {
  let card = document.createElement("div");
  card.classList.add(
    "card",
    "bg-search",
    "border-search-border",
    "border",
    "shadow-md",
    "px-4",
    "py-6",
    "rounded-lg",
    "max-w-96",
    "fade-in",
    "relative"
  );

  let wallet = new LocalWallet(walletAddress);

  await wallet.init();

  let walletInformation = {
    walletAddress: walletAddress,
    balance: "0",
    transactionCount: "0",
    lastActivity: "0",
  };

  walletInformation.balance = (wallet.balance as string).slice(0, 7);
  walletInformation.transactionCount = wallet.transactions.length.toString();
  walletInformation.lastActivity = await wallet.getLatestActivity();

  card.setAttribute("data-balance", wallet.balance);
  card.setAttribute("data-transactions", walletInformation.transactionCount);
  card.setAttribute("data-last-activity", walletInformation.lastActivity);

  let cardHtml = `

              ${
                activeWallet.address === walletInformation.walletAddress
                  ? ` <div class="absolute top-0 right-0 !bg-ganache-yellow-light p-2 rounded-lg  text-white text-xs font-bold uppercase select-none">
                Active
              </div>`
                  : ""
              }
              
            <div class="group relative">
              <h2
                class="text-xl card-wallet-address copy-element !font-bold text-center overflow-ellipsis whitespace-nowrap overflow-hidden px-4 cursor-pointer"
              >
                ${walletInformation.walletAddress}
              </h2>
              <span
                id="tooltip"
                class="tooltip group-hover:opacity-100 transition-opacity absolute top-[-3.5rem] left-1/2 -translate-x-1/2 opacity-0 mx-auto whitespace-normal break-words rounded-lg py-1.5 px-3 text-sm font-normal focus:outline-none shadow-sm bg-search pointer-events-none"
                >Copy</span
              >
            </div>
            <div class="flex flex-col mt-4 gap-4 font-light text-xl relative">
            
              <div class="flex gap-4 flex-col lg:flex-row">
                <p>Balance:</p>
                <p class="card-balance italic">${
                  walletInformation.balance
                } eth</p>
              </div>
              <div class="flex gap-4 flex-col lg:flex-row">
                <p>Transactions:</p>
                <p class="card-transaction-count italic">${
                  walletInformation.transactionCount
                }</p>
              </div>


              <div class="flex gap-4 flex-col lg:flex-row">
                <p>Last Activity:</p>
                <p class="card-last-activity italic">${
                  walletInformation.lastActivity
                }</p>
              </div>
            </div>

            <div class="flex flex-col justify-center mt-4 gap-2">
              <a
                id="view-wallet-button"
                href="/wallet/#${walletInformation.walletAddress}"
                class="!bg-ganache-brown-light !text-white p-2 !uppercase !text-center !font-bold rounded-md text-sm w-full hover:!bg-ganache-brown-dark transition-colors cursor-pointer shadow-sm"
              >
                View Wallet
              </a>

              <button
                id="use-wallet-button"
                class="!bg-ganache-yellow-light text-white p-2 uppercase font-bold rounded-md text-sm w-full hover:!bg-ganache-yellow-dark transition-colors cursor-pointer shadow-sm"
              >
                Use Wallet
              </button>
            </div>

         `;

  card.innerHTML = cardHtml;

  card
    .querySelector<HTMLButtonElement>("#use-wallet-button")!
    .addEventListener("click", () => {
      setActiveWallet(walletInformation.walletAddress);

      showMessageBox("success", "Success", "Wallet set as active");

      initializeHeader();
      initializeCopyButtons();
      initializeCards();
    });

  return card;
};
