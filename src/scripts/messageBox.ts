/*
 *
 *
 *  messageBox.ts This file contains the function to show a message box on the screen
 *
 * This file contains the function to show a message box on the screen with a title, message and a close button
 * The message box can be of two types: error or success
 * The message box can also reload the page when the close button is clicked
 * That is when the reloadPage parameter is set to true
 *
 * This script is originally from the other project we did but a better version of it with more features and modifications
 * */

/**
 * Function to show a message box on the screen
 * @param {string} type The type of the message box: error or success
 * @param {string} title The title of the message box
 * @param {string} message The message to be displayed in the message box
 * @param {boolean=} reloadPage Optional boolean to determine if the page should be reloaded when the message box is closed. Default is false
 *
 * */
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
      class="message-box fixed w-full h-full bg-opacity-75 bg-gray-900/65 flex justify-center items-center  z-50 fade-in scale-100"
    >
      <div
        class="message-box__content grow-animation bg-white rounded-lg mx-auto p-4 flex flex-col items-center gap-8 shadow-lg max-w-[90vw] max-h-[80vh]  md:max-w-md md:min-w-sm"
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
        <button class="message-box__button button !bg-ganache-yellow-light hover:!bg-ganache-yellow-dark transition-colors w-full cursor-pointer">Close</button>
      </div>
    </div>


    `;

  // Add event listener to the message box parent to remove the message box when the close button is clicked
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
