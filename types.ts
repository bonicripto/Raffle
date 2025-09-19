
import type { PublicKey } from '@solana/web3.js';

export interface RaffleTier {
    id: string;
    ticketPrice: number;
    prizeAmount: number;
    burnAmount: number;
    reentryAmount: number;
    opsAmount: number;
}

export interface Participant {
    address: PublicKey; // Store as PublicKey for easier use with Anchor
}

// This mirrors the `RaffleStatus` enum in the smart contract
export type RaffleStatus = { open: {} } | { closed: {} };

// This represents the state fetched directly from a Raffle PDA Account
export interface Raffle extends RaffleTier {
    participants: Participant[];
    status: RaffleStatus;
    winner: PublicKey | null;
    round: number;
    // We add the PDA address to the frontend object for easy reference
    pda: PublicKey; 
}

export interface WinnerInfo {
    raffleName: string;
    winnerAddress: string;
    prizeAmount: number;
    burnAmount: number;
    reentryAmount: number;
    opsAmount: number;
    blockhash: string; // Keep blockhash for display purposes if available
}
