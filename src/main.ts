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
};

// A very cool function found from stackoverflow to sleep for a certain amount of time
// Much more readable than using setTimeout
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// let provider = (await checkProvider()) || new ethers.JsonRpcProvider();

// const getBalance = async (address: string) => {
//   const balance = await provider.getBalance(address);

//   let balanceInEther = formatEther(balance);

//   balanceInEther = parseFloat(balanceInEther).toFixed(2);
//   return balanceInEther;
// };

// document.querySelector<HTMLDivElement>(
//   "#app"
// )!.innerHTML = `<h1>Loading...</h1>`;

// const address = "0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA";

// getBalance(address).then((balance) => {
//   document.querySelector<HTMLDivElement>(
//     "#app"
//   )!.innerHTML = `<h1>Balance: ${balance} ETH</h1>`;
// });

init();
