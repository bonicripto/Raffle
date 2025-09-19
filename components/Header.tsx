import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2c44] bg-[#10111a]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            <h1 className="text-2xl font-bold text-white">Raffle</h1>
          </div>
          <div className="flex items-center">
            <WalletMultiButton className="wallet-adapter-button-trigger" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;