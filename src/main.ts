/*
 * main.ts - The main entry point for the application
 *
 * This file is the main entry point for the application and is responsible for initializing all the other scripts
 * and setting up the event listeners for the theme switcher and the action button
 *
 *
 */

// ---- imports from other scripts ----
import { initializeCopyButtons } from "./scripts/copyButton";
import { initializeFooter } from "./scripts/footer";
import { activeWallet, initializeProvider } from "./scripts/ethers";
import "./style.css";
import { initializeCards } from "./scripts/cardsGenerator";
import { initializeTransactionsTable } from "./scripts/transactionsTableGenerator";
import { initializeHeader } from "./scripts/header";
import { initializeViewWallet } from "./scripts/viewWallet";
import { initializeTransactionPage } from "./scripts/newTransaction";
import { initializeSearchBar } from "./scripts/searchBar";

/**
 * Function to initialize the application
 */
const init = async () => {
  initializeThemeSwitcher();

  await initializeProvider();

  // Initialize the cards and the transactions table only on the home page
  if (location.pathname === "/") {
    await initializeCards();
    await initializeTransactionsTable(100);
  }

  // Initialize the view wallet page only on the wallet page
  if (location.pathname === "/wallet/") {
    await initializeViewWallet();
  }

  // Initialize the new transaction page only on the new transaction page
  if (location.pathname === "/new-transaction/") {
    await initializeTransactionPage();
  }

  // Initialize the search bar and the action button only on pages that are not the new transaction page
  if (location.pathname !== "/new-transaction/") {
    initializeHeader();
    await initializeSearchBar();
    initializeActionButton();
  }

  await initializeFooter();

  initializeCopyButtons();
};

/**
 * Function used to initialize the action button and add the event listener to toggle the action buttons container
 * This is the button on the bottom right of the screen
 * The button is used to view the active wallet and make a new transaction
 */
export const initializeActionButton = () => {
  let actionButtonsContainer = document.querySelector<HTMLButtonElement>(
    "#action-buttons-container"
  );
  let actionButton =
    document.querySelector<HTMLButtonElement>("#action-button");

  actionButton!.addEventListener("click", async () => {
    actionButtonsContainer?.classList.toggle("hidden");
  });

  let actionButtons =
    actionButtonsContainer?.querySelectorAll<HTMLButtonElement>("button");

  // View active wallet button
  actionButtons![0].addEventListener("click", async () => {
    location.href = `/wallet/#${activeWallet.address}`;
  });
  // Make a transaction button
  actionButtons![1].addEventListener("click", async () => {
    location.href = `/new-transaction/`;
  });
};

/**
 * Function to initialize the theme switcher and add the event listener to toggle the theme
 * This can be toggled on the bottom right of the screen on the footer, the sun and moon icon
 */
export const initializeThemeSwitcher = () => {
  let themeSwitcher = document.querySelector<HTMLButtonElement>(
    "#theme-switcher"
  ) as HTMLButtonElement;

  let spanElements = themeSwitcher.getElementsByTagName(
    "span"
  ) as HTMLCollectionOf<HTMLSpanElement>;

  let currentTheme =
    (localStorage.getItem("theme") as "light-mode" | "dark-mode") ||
    "light-mode";

  const setTheme = (theme: "light-mode" | "dark-mode") => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);

    spanElements[0].classList.toggle("!hidden", theme === "dark-mode");
    spanElements[1].classList.toggle("!hidden", theme === "light-mode");
  };

  setTheme(currentTheme);

  themeSwitcher!.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("light-mode")
      ? "dark-mode"
      : "light-mode";
    setTheme(newTheme);
  });
};

/**
 * Function to pause the execution of the script
 * @param {number} ms - The number of milliseconds to pause the script
 *
 *
 * A very cool function found from stackoverflow to sleep for a certain amount of time
 * Much more readable than using setTimeout
 * I used this to slow down the card generation to make it look better but since the cards are now generated in the background I don't need it anymore.
 * And the blockchain is much more bigger now so it's not needed since it's already "slow"
 * But I'm keeping it here because its a really smart way to pause the execution of the script while keeping it modern and clean
 * https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize the application
init();
