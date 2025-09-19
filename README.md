# Solana Raffle dApp

This project contains a fully on-chain, autonomous raffle dApp built on the Solana blockchain using the Anchor framework.

## The Complete Workflow

Follow these steps to build the contract, deploy it, and connect it to the frontend.

### 1. Build the Smart Contract

First, compile the Rust code into a BPF binary that can be deployed to the Solana blockchain. This command also generates the crucial IDL (Interface Definition Language) file that the frontend needs.

```bash
# Navigate to the contract's directory
cd raffle-contract

# Build the contract
anchor build
```

### 2. Deploy to Devnet

Deploy the compiled program to the Solana devnet.

```bash
# Make sure you are still in the raffle-contract directory
anchor deploy
```

After deployment, the CLI will output the `Program ID`. This is the public address of your smart contract. **Copy this address.**

### 3. Configure the Frontend

Now, you need to tell the frontend application where your deployed program is and how to talk to it.

1.  **Set the Program ID**:
    *   Navigate back to the project's root folder (`cd ..`).
    *   Open the `constants.ts` file.
    *   Find the `RAFFLE_PROGRAM_ID` constant and replace the placeholder address with the new `Program ID` you just copied.

2.  **Update the IDL**:
    *   The `anchor build` command created a file at `raffle-contract/target/idl/solana_raffle_contract.json`. Open this file and copy its entire contents.
    *   Now, open `types/idl.ts` in the root folder.
    *   Paste the copied JSON content to completely replace the existing object assigned to the `export const idl = { ... };` variable.

### 4. Run the Frontend Application

With the configuration complete, you can install the dependencies and run the local development server.

```bash
# Make sure you are in the project's root directory
npm install
npm run dev
```

### 5. Initialize Raffles On-Chain

Once the web app is running in your browser:

1.  Connect your Solana wallet (e.g., Phantom) and ensure it's set to the **Devnet**.
2.  A banner with an "Initialize Raffles" button will appear. Click this button and approve the transaction in your wallet.

This one-time transaction creates all the necessary on-chain accounts for each raffle tier, making the dApp operational. Your application is now fully configured and live on devnet!
