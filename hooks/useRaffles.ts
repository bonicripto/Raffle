import { useState, useCallback, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SYSVAR_SLOT_HASHES_PUBKEY, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import type { Raffle, WinnerInfo } from '../types';
import { RAFFLE_TIERS, TOKEN_MINT_ADDRESS, RAFFLE_OPERATIONAL_WALLET, BURN_WALLET, RAFFLE_PROGRAM_ID, RAFFLE_ACCOUNT_SEED, RAFFLE_VAULT_SEED } from '../constants';
import { idl, SolanaRaffleContract } from '../types/idl';

const initialRaffles: Raffle[] = RAFFLE_TIERS.map(tier => {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from(RAFFLE_ACCOUNT_SEED), Buffer.from(tier.id)],
        RAFFLE_PROGRAM_ID
    );
    return {
        ...tier,
        pda,
        participants: [],
        status: { open: {} },
        winner: null,
        round: 1,
    }
});

export const useRaffles = (onWinnerAnnounced: (info: WinnerInfo) => void) => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [raffles, setRaffles] = useState<Raffle[]>(initialRaffles);
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const [needsInitialization, setNeedsInitialization] = useState<string[]>([]);

    const provider = useMemo(() => {
        if (!wallet || !wallet.publicKey) return null;
        return new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        // Initialize the Program with the correctly typed IDL object.
        return new Program<SolanaRaffleContract>(idl, RAFFLE_PROGRAM_ID, provider);
    }, [provider]);

    const fetchRaffleState = useCallback(async () => {
        if (!program) {
            setIsLoading(false);
            setRaffles(initialRaffles);
            return;
        }

        setIsLoading(true);
        try {
            const rafflePdaAddresses = initialRaffles.map(r => r.pda);
            const accounts = await program.account.raffleAccount.fetchMultiple(rafflePdaAddresses);

            const uninitializedTiers: string[] = [];
            const newRaffles = accounts.map((account, index) => {
                const tier = RAFFLE_TIERS[index];
                if (account) {
                    return {
                        ...tier,
                        pda: rafflePdaAddresses[index],
                        participants: account.participants.slice(0, account.participantsCount).map(p => ({ address: p })),
                        status: account.status,
                        winner: account.winner.equals(SystemProgram.programId) ? null : account.winner,
                        round: account.round.toNumber(),
                    };
                }
                uninitializedTiers.push(tier.id);
                return initialRaffles[index];
            });

            setNeedsInitialization(uninitializedTiers);
            setRaffles(newRaffles as Raffle[]);
        } catch (error) {
            console.error("Failed to fetch raffle state:", error);
            setRaffles(initialRaffles);
        } finally {
            setIsLoading(false);
        }
    }, [program]);

    useEffect(() => {
        fetchRaffleState();
    }, [fetchRaffleState]);

    const initializeRaffles = useCallback(async () => {
        if (!program || !wallet.publicKey || needsInitialization.length === 0) return;
        setIsInitializing(true);
        try {
            for (const tierId of needsInitialization) {
                 const rafflePda = initialRaffles.find(r => r.id === tierId)!.pda;
                 await program.methods
                    .initializeRaffle(tierId)
                    .accounts({
                        raffle: rafflePda,
                        authority: wallet.publicKey,
                        systemProgram: web3.SystemProgram.programId,
                    })
                    .rpc();
                 console.log(`Initialized raffle for ${tierId}`);
            }
            alert('All raffles initialized successfully!');
            await fetchRaffleState();
        } catch (error) {
            console.error("Failed to initialize raffles:", error);
            alert("Initialization failed. Please check the console.");
        } finally {
            setIsInitializing(false);
        }
    }, [program, wallet.publicKey, needsInitialization, fetchRaffleState]);

    const buyTicket = useCallback(async (raffle: Raffle) => {
        if (!program || !wallet.publicKey) return;
        setIsProcessing(prev => ({ ...prev, [raffle.id]: true }));

        try {
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from(RAFFLE_VAULT_SEED), Buffer.from(raffle.id)],
                program.programId
            );
            const buyerAta = await getAssociatedTokenAddress(TOKEN_MINT_ADDRESS, wallet.publicKey);
            const vaultAta = await getAssociatedTokenAddress(TOKEN_MINT_ADDRESS, vaultPda, true);

            await program.methods
                .buyTicket(raffle.id)
                .accounts({
                    buyer: wallet.publicKey,
                    raffle: raffle.pda,
                    vault: vaultPda,
                    vaultAta: vaultAta,
                    buyerAta: buyerAta,
                    tokenMint: TOKEN_MINT_ADDRESS,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                    slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
                })
                .rpc();

            alert('Ticket purchased successfully!');
            await fetchRaffleState();
        } catch (error) {
            console.error("Failed to process ticket purchase:", error);
            alert("Transaction failed. Check console for details.");
        } finally {
            setIsProcessing(prev => ({ ...prev, [raffle.id]: false }));
        }
    }, [program, wallet.publicKey, fetchRaffleState]);

    const distributePrize = useCallback(async (raffle: Raffle) => {
        if (!program || !wallet.publicKey) return;
        const currentRaffleState = raffles.find(r => r.id === raffle.id);
        if (!currentRaffleState?.winner) {
            alert("Winner has not been selected by the contract yet. Please refresh.");
            return;
        }

        setIsProcessing(prev => ({ ...prev, [raffle.id]: true }));
        try {
            const winner = currentRaffleState.winner;
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from(RAFFLE_VAULT_SEED), Buffer.from(raffle.id)],
                program.programId
            );

            const [vaultAta, winnerAta, opsAta, burnAta] = await Promise.all([
                getAssociatedTokenAddress(TOKEN_MINT_ADDRESS, vaultPda, true),
                getAssociatedTokenAddress(TOKEN_MINT_ADDRESS, winner),
                getAssociatedTokenAddress(TOKEN_MINT_ADDRESS, RAFFLE_OPERATIONAL_WALLET),
                getAssociatedTokenAddress(TOKEN_MINT_ADDRESS, BURN_WALLET)
            ]);
            
            // Announce winner optimistically
            onWinnerAnnounced({
                raffleName: `${formatNumber(raffle.ticketPrice)} Pool (Round ${raffle.round})`,
                winnerAddress: winner.toBase58(),
                prizeAmount: raffle.prizeAmount,
                burnAmount: raffle.burnAmount,
                reentryAmount: raffle.reentryAmount,
                opsAmount: raffle.opsAmount,
                blockhash: "Determined by contract",
            });

            await program.methods
                .distributePrize(raffle.id)
                .accounts({
                    payer: wallet.publicKey,
                    raffle: raffle.pda,
                    vault: vaultPda,
                    vaultAta: vaultAta,
                    winner: winner,
                    winnerAta: winnerAta,
                    opsWallet: RAFFLE_OPERATIONAL_WALLET,
                    opsAta: opsAta,
                    burnWallet: BURN_WALLET,
                    burnAta: burnAta,
                    tokenMint: TOKEN_MINT_ADDRESS,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            alert(`Prize for ${raffle.id} round ${raffle.round} distributed!`);
            await fetchRaffleState();
        } catch (error) {
            console.error('Failed to distribute prize:', error);
            alert('Prize distribution failed. Check console for details.');
        } finally {
            setIsProcessing(prev => ({ ...prev, [raffle.id]: false }));
        }
    }, [program, wallet.publicKey, fetchRaffleState, onWinnerAnnounced, raffles]);

    const formatNumber = (num: number): string => {
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
        return num.toString();
    };

    return { raffles, buyTicket, distributePrize, initializeRaffles, needsInitialization, isProcessing, isLoading, isInitializing };
};
