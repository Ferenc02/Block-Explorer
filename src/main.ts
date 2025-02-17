import { initializeCopyButtons } from "./scripts/copyButton";
import { initializeFooter } from "./scripts/footer";
import { activeWallet, initializeProvider } from "./scripts/ethers";
import "./style.css";
import { initializeCards } from "./scripts/cardsGenerator";
import { initializeTransactionsTable } from "./scripts/transactionsTableGenerator";
import { initializeHeader } from "./scripts/header";
import { initializeViewWallet } from "./scripts/viewWallet";
import { initializeTransactionPage } from "./scripts/newTransaction";

const init = async () => {
  initializeThemeSwitcher();

  let provider = await initializeProvider();
  initializeCopyButtons();

  initializeHeader();

  console.log("hash", location.hash);

  if (location.pathname === "/") {
    await initializeCards();
    await initializeTransactionsTable(20);
  }

  if (location.pathname === "/wallet/") {
    await initializeViewWallet();
  }

  if (location.pathname === "/new-transaction/") {
    await initializeTransactionPage();
  }

  await initializeFooter();

  if (location.pathname !== "/new-transaction/") {
    initializeActionButton();
  }
};

// Function used to initialize the action button and add the event listener to toggle the action buttons container
// This is the button on the bottom right of the screen
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

// Function used to initialize the theme switcher and set the theme while also adding the event listener to switch the theme
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

// A very cool function found from stackoverflow to sleep for a certain amount of time
// Much more readable than using setTimeout
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

init();
