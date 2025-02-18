// ! Used to generate random transactions between wallets in a local blockchain network if you want to populate the network with transactions for testing purposes.
let amountOfTransactionsToGenerate = 50;

import { ethers, formatEther, parseEther } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

async function generateRandomTransactions(limit) {
  let availableWallets = await provider.listAccounts();

  let selectRandomFromWallet = () => {
    return availableWallets[
      Math.floor(Math.random() * availableWallets.length)
    ];
  };

  let selectRandomToWallet = (fromWallet) => {
    let toWallet = selectRandomFromWallet();

    while (toWallet === fromWallet) {
      toWallet = selectRandomFromWallet();
    }

    return toWallet;
  };

  for (let i = 0; i < limit; i++) {
    let fromWallet = selectRandomFromWallet();
    let toWallet = selectRandomToWallet(fromWallet);

    let balance = await provider.getBalance(fromWallet);

    let randomAmount = Math.random() * parseFloat(formatEther(balance));

    const signer = await provider.getSigner(fromWallet.address);

    try {
      const tx = await signer.sendTransaction({
        to: toWallet.address,
        value: ethers.parseEther(randomAmount.toString()),
      });
      console.log(`Transaction ${i + 1}: ${tx.hash}`);
    } catch (error) {
      console.error(`Transaction ${i + 1} failed`);
      continue;
    }
  }
}

await generateRandomTransactions(amountOfTransactionsToGenerate);
