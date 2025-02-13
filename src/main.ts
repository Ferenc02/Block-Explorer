import { initializeCopyButtons } from "./scripts/copyButton";
import { initializeFooter } from "./scripts/footer";
import { activeWallet, initializeProvider } from "./scripts/ethers";
import "./style.css";
import { initializeCards } from "./scripts/cardsGenerator";

const init = async () => {
  initializeThemeSwitcher();

  let provider = await initializeProvider();
  initializeCopyButtons();

  if (location.hash === "") {
    await initializeCards();
  }

  await initializeFooter();

  initializeActionButton();
};

export const initializeActionButton = () => {
  let actionButtonsContainer = document.querySelector<HTMLButtonElement>(
    "#action-buttons-container"
  );
  let actionButton =
    document.querySelector<HTMLButtonElement>("#action-button");

  actionButton!.addEventListener("click", async () => {
    actionButtonsContainer?.classList.toggle("hidden");
  });
};

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
