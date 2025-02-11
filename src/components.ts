export function initializeCopyButtons() {
  const copyButtons = document.querySelectorAll(
    ".copy-element"
  ) as NodeListOf<HTMLButtonElement>;

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
