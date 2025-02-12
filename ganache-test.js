import { ethers, formatEther, parseEther } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

let balance = await provider.getBalance(
  "0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA"
);

console.log("Balance: " + formatEther(balance));

const transactionsCount = await provider.getTransactionCount(
  "0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA"
);
console.log("Amount of transactions:", transactionsCount);

// Function to get the last activity of a wallet
export const getLatestActivity = async (walletAddress) => {
  const topic = ethers.id("Transfer(address,address,uint256)");

  const logs = await provider.getLogs({
    address: walletAddress,
    fromBlock: 0,
    toBlock: "latest",
  });
  console.log("Logs: ", logs);
  if (logs.length === 0) {
    console.log("No activity found");
    return;
  }

  const latestLog = logs[logs.length - 1];

  const block = await provider.getBlock(latestLog.blockNumber);

  let date = new Date(block.timestamp * 1000);

  console.log("Latest activity: ", date);
};

await getLatestActivity("0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA");

// for (let i = 0; i < 2; i++) {
//   const signer = await provider.getSigner();
//   console.log("Signer: ", signer);

//   const trx = await signer.sendTransaction({
//     to: "0xc0d8F541Ab8B71F20c10261818F2F401e8194049",
//     value: parseEther("20"),
//   });

//   const receipt = await trx.wait();
//   console.log("Transaction receipt: ", receipt);
// }

// Old code

// Create a communication to local Ethereum node

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// let balance = await provider.getBalance(
//   "0x88c3B3392CB6b06B604Ecf2B1B59C459c925dB8D"
// );

// console.log("Balance: ", balance);

// console.log("Balance: ", formatEther(balance));

// const transactionsCount = await provider.getTransactionCount(
//   "0x88c3B3392CB6b06B604Ecf2B1B59C459c925dB8D"
// );
// console.log("Amount of transactions:", transactionsCount);

// const signer = await provider.getSigner();
// console.log("Signer: ", signer);

// const trx = await signer.sendTransaction({
//   to: "0x655A67e891aA091A008d05faAC124f86A9770532",
//   value: parseEther("20"),
// });

// const receipt = await trx.wait();

// console.log("Transaction receipt: ", receipt);
