
import React from 'react';
import type { WinnerInfo } from '../types';
import { TOKEN_SYMBOL } from '../constants';

interface WinnerModalProps {
    winnerInfo: WinnerInfo;
    onClose: () => void;
}

const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
};

const WinnerModal: React.FC<WinnerModalProps> = ({ winnerInfo, onClose }) => {
    const shortWinnerAddress = `${winnerInfo.winnerAddress.substring(0, 6)}...${winnerInfo.winnerAddress.substring(winnerInfo.winnerAddress.length - 6)}`;
    const shortBlockhash = `${winnerInfo.blockhash.substring(0, 10)}...`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#151620] border border-purple-500/50 rounded-2xl shadow-xl max-w-lg w-full text-white transform transition-all animate-fade-in-up">
                <div className="p-8 text-center border-b border-[#2a2c44]">
                    <h2 className="text-3xl font-bold gradient-text">Winner Announced!</h2>
                    <p className="text-gray-400 mt-1">For the {winnerInfo.raffleName}</p>
                </div>
                <div className="px-8 py-6">
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-400">Congratulations to:</p>
                        <p className="text-xl font-mono font-bold text-green-400 break-all mt-2">{shortWinnerAddress}</p>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-[#2a2c44]">
                        <h3 className="text-lg font-semibold mb-3 text-center">Prize Distribution</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-300">Winner's Prize:</span>
                                <span className="font-semibold text-green-400">{formatNumber(winnerInfo.prizeAmount)} {TOKEN_SYMBOL}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-300">Automatic Re-entry:</span>
                                <span className="font-semibold">{formatNumber(winnerInfo.reentryAmount)} {TOKEN_SYMBOL}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-300">Token Burn:</span>
                                <span className="font-semibold">{formatNumber(winnerInfo.burnAmount)} {TOKEN_SYMBOL}</span>
                            </li>
                             <li className="flex justify-between">
                                <span className="text-gray-300">Operational Costs:</span>
                                <span className="font-semibold">{formatNumber(winnerInfo.opsAmount)} {TOKEN_SYMBOL}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>Winner selected using Solana blockhash: <span className="font-mono text-gray-400">{shortBlockhash}</span></p>
                    </div>
                </div>
                 <div className="p-6 bg-[#10111a]/50 rounded-b-2xl text-center">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-8 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinnerModal;
