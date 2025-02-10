import "./style.css";

import { ethers, formatEther, parseEther } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const getBalance = async (address: string) => {
  const balance = await provider.getBalance(address);

  let balanceInEther = formatEther(balance);

  balanceInEther = parseFloat(balanceInEther).toFixed(2);
  return balanceInEther;
};

document.querySelector<HTMLDivElement>(
  "#app"
)!.innerHTML = `<h1>Loading...</h1>`;

const address = "0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA";

getBalance(address).then((balance) => {
  document.querySelector<HTMLDivElement>(
    "#app"
  )!.innerHTML = `<h1>${balance} ETH</h1>`;
});
