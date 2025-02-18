# Note

This branch is used if you want to run the project with a persistant database. The database is stored in the `db` folder

# Project Description

This project is designed to provide a comprehensive blockchain explorer tool. The platform allows users to browse the latest blocks on the blockchain, view detailed block and transaction information, search for blocks and addresses, and send transactions. It aims to offer a user-friendly interface for interacting with blockchain data and performing various blockchain-related tasks efficiently with their local ganache server.

## Features

### 🔍 Block Explorer

- Browse the latest blocks on the blockchain
- View detailed block information (hash, timestamp, transactions)
- Search for blocks by block height or block hash
- View wallets, transactions, and other details for each block

### 💸 Transaction Analysis

- Search and view detailed transaction information
- Track transaction status and confirmations

### 📬 Address Lookup

- Search for blockchain addresses
- View balance and transaction history for addresses

### 💰 Send Money

- Send transactions to any blockchain address
- Monitor the status of your sent transactions
- View transaction fees and estimated confirmation times

## Technologies Used

- **Frontend**: HTML, CSS, TypeScript, Tailwind CSS, Vite
- **Blockchain**: ethers.js, ganache
- **Testing**: Vitest for unit testing and test-driven development (TDD)
- **Node.js**: npm-run-all for running multiple scripts concurrently.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ferenc02/Block-Explorer
   ```
2. Navigate to the project directory:
   ```bash
   cd block-explorer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development environment:

   ```bash
   npm run dev
   ```

   This will start Vite and Ganache.

   If there are errors related to tailwind styles, install the latest Microsoft Visual C++ Redistributable:
   https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170

5. If you want to populate the blockchain with random transactions, run the following command:

   ```bash
   npm run generateTransactions
   ```

   This will populate the blockchain with 20 random transactions. Can be changed in the script (Note: You have to run this command in parallel with the development environment.)

6. Run vitest to run the test cases:

   ```bash
   npm run test
   ```

   This will run the test cases and display the results in the terminal. (Note: The test cases will only run if the ganache server is started.)

## Usage

- **PostCSS**: Styles are automatically compiled and updated when you modify the `src/styles.css` file or add any Tailwind classes in the HTML.
- **Tailwind**: The project uses Tailwind CSS for styling, which is why vite is used for this project.
- **ethers.js**: Interacts with the Ethereum blockchain, used for fetching block and transaction data.
- **Ganache**: Serves as a local blockchain for development and testing, available at `http://127.0.0.1:8545`.
- **Vite**: Serves the project on `http://localhost:5173/` and provides hot module replacement for a smooth development experience while also compiling the typescript.

- **Vitest**: Runs the test cases and displays the results in the terminal.
