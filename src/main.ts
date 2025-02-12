import { initializeCopyButtons } from "./scripts/components";
import { initializeFooter } from "./scripts/footer";
import { initializeProvider } from "./scripts/ethers";
import "./style.css";

const init = async () => {
  let provider = await initializeProvider();
  initializeCopyButtons();
  initializeFooter(provider);
};

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
