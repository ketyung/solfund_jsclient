import React, {useMemo} from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {getPhantomWallet,getSolflareWallet,getSolletWallet} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { PoolMarketTestView } from './PoolMarketTestView';

export const PoolMarketPage : React.FC = () => {

    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSolletWallet({ network }),
        getSolflareWallet(),
       ], [network]);


    return <div>
        <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
        <PoolMarketTestView/>
        </WalletProvider>
        </ConnectionProvider>
    </div>
}