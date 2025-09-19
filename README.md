
# Solana Raffle Smart Contract

This is the Anchor-based smart contract that powers the fully on-chain, autonomous raffle dApp.

## Setup

1.  **Install Dependencies**: Make sure you have the Rust toolchain, Solana CLI, and Anchor framework installed. Then, install the project's Node.js dependencies:
    ```bash
    npm install
    ```

## Build

2.  **Build the Contract**: Compile the Rust code into a BPF binary that can be deployed to the Solana blockchain. This command also generates the crucial IDL file (`target/idl/solana_raffle_contract.json`) that the frontend uses to communicate with the contract.
    ```bash
    anchor build
    ```

## Deploy

3.  **Deploy to Devnet**: Deploy the compiled program to the Solana devnet.
    ```bash
    anchor deploy
    ```

4.  **Get Program ID**: After deployment, the CLI will output the `Program ID`. This is the public address of your smart contract. **Copy this address.**

## Update Frontend

5.  **Configure Frontend**: Open the frontend project and navigate to the `constants.ts` file. Find the `RAFFLE_PROGRAM_ID` constant and replace the placeholder address with the new `Program ID` you just copied.

## Initialize Raffles

6.  **Initialize On-Chain**: Once the frontend is updated with your Program ID, open the web app in your browser. A banner with an "Initialize Raffles" button will appear. Click this button and approve the transaction in your wallet. This will create all the necessary on-chain accounts for each raffle tier.

Your dApp is now fully configured and connected to your live smart contract!
