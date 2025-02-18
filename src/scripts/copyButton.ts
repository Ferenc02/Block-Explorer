/*
 *
 * copyButton.ts - This file is responsible for initializing the copy buttons in the application
 *
 */

/**
 * Function to initialize the copy buttons
 */
export function initializeCopyButtons() {
  // Gets all the copy buttons on the page
  const copyButtons = document.querySelectorAll(
    ".copy-element"
  ) as NodeListOf<HTMLButtonElement>;

  // Adds an event listener to each copy button
  // Not really the best way to do this but it works for now
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const copyText = button.innerText;
      navigator.clipboard.writeText(copyText);

      const toolTip = button.nextElementSibling as HTMLSpanElement;
      toolTip.innerText = "Copied! 🎉";

      setTimeout(() => {
        toolTip.innerText = "Copy";
      }, 2000);
    });
  });
}
