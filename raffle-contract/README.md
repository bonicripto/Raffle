# Solana Raffle Smart Contract

This is the Anchor-based smart contract that powers the fully on-chain, autonomous raffle dApp.

## Setup

1.  **Navigate to Directory**: Open your terminal and navigate into this `raffle-contract` folder.
    ```bash
    cd raffle-contract
    ```
2.  **Install Dependencies**: Install the project's Node.js dependencies which are used for testing.
    ```bash
    yarn install
    ```

## Build

3.  **Build the Contract**: Compile the Rust code into a BPF binary that can be deployed to the Solana blockchain. This command also generates the crucial IDL and types file (`target/idl/solana_raffle_contract.json` and `target/types/solana_raffle_contract.ts`) that the frontend uses to communicate with the contract.
    ```bash
    anchor build
    ```

## Deploy

4.  **Deploy to Devnet**: Deploy the compiled program to the Solana devnet.
    ```bash
    anchor deploy
    ```

5.  **Get Program ID**: After deployment, the CLI will output the `Program ID`. This is the public address of your smart contract. **Copy this address.**

## Update Frontend

6.  **Configure Frontend**: Navigate back to the root project folder and open the `constants.ts` file. Find the `RAFFLE_PROGRAM_ID` constant and replace the placeholder address with the new `Program ID` you just copied.

7.  **Update IDL and Types**: 
    - Copy the new IDL file from `raffle-contract/target/idl/solana_raffle_contract.json`.
    - Paste its contents into the root `idl.json` file, replacing everything.
    - Copy the new types file from `raffle-contract/target/types/solana_raffle_contract.ts`.
    - Paste its contents into `types/idl.ts`, replacing everything in that file.

## Initialize Raffles

8.  **Initialize On-Chain**: Once the frontend is updated with your Program ID and new IDL, open the web app in your browser. A banner with an "Initialize Raffles" button will appear. Click this button and approve the transaction in your wallet. This will create all the necessary on-chain accounts for each raffle tier.

Your dApp is now fully configured and connected to your live smart contract!