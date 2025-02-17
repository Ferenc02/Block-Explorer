export const showMessageBox = (
  type: "error" | "success",
  title: string,
  message: string,
  reloadPage?: boolean
) => {
  const messageBoxParent = document.createElement("div");

  if (type !== "error" && type !== "success") {
    showMessageBox("error", "Error", "Invalid message box type");
    return;
  }

  messageBoxParent.className =
    "message-box fixed w-full h-full bg-opacity-75 bg-gray-900/65 flex justify-center items-center  z-50";

  messageBoxParent.innerHTML = `
        <!-- Message box -->
    <div
      class="message-box fixed w-full h-full bg-opacity-75 bg-gray-900/65 flex justify-center items-center  z-50 fade-in "
    >
      <div
        class="message-box__content grow-animation bg-white rounded-lg mx-auto p-4 flex flex-col items-center gap-8 shadow-lg max-w-xs  md:max-w-md min-w-sm"
      >
        <span
          class="message-box__icon material-symbols-outlined text-ganache-yellow-light !text-8xl mt-4"
        >
          ${type === "error" ? "cancel" : "check_circle"}
        </span>
        <h2
          class="message-box__title text-center text-2xl font-bold text-gray-800"
        >
          ${title}
        </h2>
        <p class="message-box__text text-gray-700">
            ${message}
        </p>
        <button class="message-box__button button bg-ganache-yellow-light hover:bg-ganache-yellow-dark transition-colors w-full cursor-pointer">Close</button>
      </div>
    </div>


    `;

  messageBoxParent.addEventListener("click", (event) => {
    if (
      event.target === messageBoxParent.querySelector(".message-box") ||
      event.target === messageBoxParent.querySelector(".message-box__button")
    ) {
      messageBoxParent.remove();

      if (reloadPage) {
        location.reload();
      }
    }
  });

  document.body.appendChild(messageBoxParent);
};
