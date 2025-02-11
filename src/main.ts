// import { showMessageBox } from "./messageBox";
import "./style.css";

// import { ethers, formatEther } from "ethers";

const init = async () => {
  // alert("Hello World");
};

// async function checkProvider() {
//   try {
//     const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

//     await provider.getBlockNumber();

//     return provider;
//   } catch (error: any) {
//     showMessageBox(
//       "error",
//       "Error connecting to provider",
//       "❌ No provider found or connection failed. Please run ganache-cli or any other Ethereum client on 127.0.0.1:8545"
//     );

//     return null;
//   }
// }

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
