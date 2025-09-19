
import type { RaffleTier } from './types';
import { PublicKey } from '@solana/web3.js';

// --- TOKEN AND PROGRAM ADDRESSES ---

// !!! IMPORTANT: REPLACE THIS WITH YOUR $777 TOKEN MINT ADDRESS !!!
// The address of the $777 SPL token mint.
export const TOKEN_MINT_ADDRESS = new PublicKey('REPLACE_WITH_YOUR_TOKEN_MINT_ADDRESS_HERE');

// !!! IMPORTANT: REPLACE THIS WITH YOUR PROGRAM ID AFTER DEPLOYING !!!
// The Program ID of the deployed Solana Raffle Smart Contract.
export const RAFFLE_PROGRAM_ID = new PublicKey('REPLACE_WITH_YOUR_PROGRAM_ID_HERE');


// --- STATIC WALLET ADDRESSES ---

// !!! IMPORTANT: VERIFY THIS IS YOUR CORRECT OPERATIONAL WALLET !!!
// Wallet that receives operational fees from each raffle.
export const RAFFLE_OPERATIONAL_WALLET = new PublicKey('9hDk2ZvK2LrsZd9TN8hBhct2YFzUmpTJecFAr2QwBs9P');

// A designated wallet for burning a portion of the tokens from each raffle.
export const BURN_WALLET = new PublicKey('11111111111111111111111111111111');

// --- CONFIGURATION ---

export const TOKEN_SYMBOL = '$777';
export const TOKEN_DECIMALS = 6;
export const MAX_TICKETS = 12;

// --- PDA SEEDS ---
// These are the seeds used by the smart contract to derive Program-Derived Addresses (PDAs).
// They must match the seeds defined in the Rust program.

export const RAFFLE_ACCOUNT_SEED = "RAFFLE_ACCOUNT_SEED";
export const RAFFLE_VAULT_SEED = "RAFFLE_VAULT_SEED";


export const RAFFLE_TIERS: RaffleTier[] = [
    {
        id: 'tier-1',
        ticketPrice: 10000,
        prizeAmount: 100000,
        burnAmount: 8000,
        reentryAmount: 10000,
        opsAmount: 2000,
    },
    {
        id: 'tier-2',
        ticketPrice: 100000,
        prizeAmount: 1000000,
        burnAmount: 80000,
        reentryAmount: 100000,
        opsAmount: 20000,
    },
    {
        id: 'tier-3',
        ticketPrice: 1000000,
        prizeAmount: 10000000,
        burnAmount: 800000,
        reentryAmount: 1000000,
        opsAmount: 200000,
    },
    {
        id: 'tier-4',
        ticketPrice: 10000000,
        prizeAmount: 100000000,
        burnAmount: 8000000,
        reentryAmount: 10000000,
        opsAmount: 2000000,
    },
];
