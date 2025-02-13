import { initializeCopyButtons } from "./scripts/copyButton";
import { initializeFooter } from "./scripts/footer";
import { initializeProvider } from "./scripts/ethers";
import "./style.css";
import { initializeCards } from "./scripts/cardsGenerator";

const init = async () => {
  let provider = await initializeProvider();
  initializeCopyButtons();

  if (location.hash === "") {
    await initializeCards();
  }

  await initializeFooter();

  let actionButtonsContainer = document.querySelector<HTMLButtonElement>(
    "#action-buttons-container"
  );
  let actionButton =
    document.querySelector<HTMLButtonElement>("#action-button");

  actionButton!.addEventListener("click", async () => {
    actionButtonsContainer?.classList.toggle("hidden");
  });
};

// A very cool function found from stackoverflow to sleep for a certain amount of time
// Much more readable than using setTimeout
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

init();
