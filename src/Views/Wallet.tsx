import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import './css/Wallet.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'wouter';

export const Wallet : React.FC = () => {

    const { publicKey } = useWallet();

    return <div>
        <WalletModalProvider>
            <div className="walletBar">
            <div className="topLink">
                <Link href="/">
                <a className="link">Home</a>
                </Link>
            </div>
            <div className="topLink">
                <Link href="/poolmarket">
                <a className="link">Pool Market</a>
                </Link>
            </div>
           
            <WalletMultiButton className="walletButton" />
            <WalletDisconnectButton className={!publicKey? "disconHidden" : "disconButton"} />
            </div>
        </WalletModalProvider>      
    </div>;
}
