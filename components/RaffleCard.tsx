
import React from 'react';
import type { Raffle } from '../types';
import { MAX_TICKETS, TOKEN_SYMBOL } from '../constants';
import TicketIcon from './icons/TicketIcon';

interface RaffleCardProps {
    raffle: Raffle;
    onBuyTicket: () => void;
    onDistributePrize: () => void;
    isProcessing: boolean;
    isConnected: boolean;
}

const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toString();
};

const ParticipantAvatar: React.FC<{ address: string, index: number }> = ({ address, index }) => {
    const shortAddress = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
    return (
        <div className="group relative">
            <div className={`w-8 h-8 rounded-full bg-gray-700 border-2 border-[#151620] flex items-center justify-center text-xs font-mono`}>
                {address.substring(0, 2)}
            </div>
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {shortAddress}
            </div>
        </div>
    );
};

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onBuyTicket, onDistributePrize, isProcessing, isConnected }) => {
    const progress = (raffle.participants.length / MAX_TICKETS) * 100;
    const isRaffleClosed = 'closed' in raffle.status;

    const renderButton = () => {
        if (isRaffleClosed) {
            return (
                <button
                    onClick={onDistributePrize}
                    disabled={!isConnected || isProcessing}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform enabled:hover:scale-105 enabled:hover:shadow-lg enabled:hover:shadow-green-500/50 disabled:bg-none disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Distributing...
                        </>
                    ) : (
                       "Distribute Prize"
                    )}
                </button>
            );
        }

        return (
            <button
                onClick={onBuyTicket}
                disabled={!isConnected || isProcessing || raffle.participants.length >= MAX_TICKETS}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform enabled:hover:scale-105 enabled:hover:shadow-lg enabled:hover:shadow-purple-500/50 disabled:bg-none disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <TicketIcon className="w-5 h-5 mr-2" />
                        Buy Ticket
                    </>
                )}
            </button>
        );
    };

    return (
        <div className={`bg-[#151620]/50 rounded-xl border border-[#2a2c44] shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:border-purple-500 hover:shadow-purple-500/10 hover:-translate-y-1 ${isRaffleClosed ? 'border-green-500' : ''}`}>
            <div>
                 <div className="text-center">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>Round: {raffle.round}</span>
                        <span>Tier: {raffle.id}</span>
                    </div>
                    <p className="text-base text-gray-400">Prize Pool</p>
                    <h2 className="text-4xl font-bold text-white mt-1">
                        {formatNumber(raffle.prizeAmount)} <span className="text-2xl font-medium text-purple-400">{TOKEN_SYMBOL}</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Ticket Price: {formatNumber(raffle.ticketPrice)} {TOKEN_SYMBOL}
                    </p>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium text-gray-300">Participants</span>
                        <span className="font-semibold text-white">{raffle.participants.length}/{MAX_TICKETS}</span>
                    </div>
                    <div className="w-full bg-[#2a2c44] rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="mt-4 min-h-[40px]">
                    <div className="flex items-center justify-center h-10">
                        {raffle.participants.length > 0 ? (
                             <div className="flex -space-x-3">
                                {raffle.participants.map((p, index) => (
                                    <ParticipantAvatar key={`${p.address.toBase58()}-${index}`} address={p.address.toBase58()} index={index} />
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-gray-500 italic">Be the first to join!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {renderButton()}
            </div>
        </div>
    );
};

export default RaffleCard;
