
import React, { useState } from 'react';
import WalletContextProvider from './WalletContextProvider';
import Header from './Header';
import RaffleCard from './RaffleCard';
import WinnerModal from './WinnerModal';
import { useRaffles } from './useRaffles';
import type { Raffle, WinnerInfo } from './types';
import { useWallet } from '@solana/wallet-adapter-react';

// Define the component outside of App to prevent re-creation on re-renders
const RaffleLobby: React.FC = () => {
    const { publicKey } = useWallet();
    const [winnerInfo, setWinnerInfo] = useState<WinnerInfo | null>(null);

    const handleWinnerAnnounced = (info: WinnerInfo) => {
        setWinnerInfo(info);
    };

    const { raffles, buyTicket, distributePrize, initializeRaffles, needsInitialization, isProcessing, isLoading, isInitializing } = useRaffles(handleWinnerAnnounced);

    const handleBuyTicket = async (raffle: Raffle) => {
        if (!publicKey) {
            alert('Please connect your wallet first.');
            return;
        }
        await buyTicket(raffle);
    };

    const handleDistributePrize = async (raffle: Raffle) => {
        if (!publicKey) {
            alert('Please connect your wallet to distribute the prize.');
            return;
        }
        await distributePrize(raffle);
    };

    const InitializationBanner = () => (
         <div className="container mx-auto px-4 py-4">
            <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-white">One-Time Setup Required</h3>
                    <p className="text-purple-200 text-sm">The on-chain accounts for some raffles need to be created.</p>
                </div>
                <button
                    onClick={initializeRaffles}
                    disabled={isInitializing}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform enabled:hover:scale-105 disabled:bg-none disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isInitializing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Initializing...
                        </>
                    ) : (
                       "Initialize Raffles"
                    )}
                </button>
            </div>
        </div>
    )
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 flex-col">
                <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-4 text-lg mt-4 text-gray-300">Loading raffles from Solana...</p>
            </div>
        );
    }

    return (
        <>
            {needsInitialization.length > 0 && <InitializationBanner />}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {raffles.map((raffle) => (
                        <RaffleCard
                            key={raffle.id}
                            raffle={raffle}
                            onBuyTicket={() => handleBuyTicket(raffle)}
                            onDistributePrize={() => handleDistributePrize(raffle)}
                            isProcessing={isProcessing[raffle.id]}
                            isConnected={!!publicKey}
                        />
                    ))}
                </div>
                {winnerInfo && (
                    <WinnerModal
                        winnerInfo={winnerInfo}
                        onClose={() => setWinnerInfo(null)}
                    />
                )}
            </div>
        </>
    );
};

const App: React.FC = () => {
  return (
    <WalletContextProvider>
        <div className="min-h-screen bg-transparent text-white">
            <Header />
            <main className="pt-8">
                <RaffleLobby />
            </main>
        </div>
    </WalletContextProvider>
  );
};

export default App;
