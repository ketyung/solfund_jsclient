import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import './css/Wallet.css';
import { useWallet } from '@solana/wallet-adapter-react';


export const Wallet : React.FC = () => {

    const { publicKey } = useWallet();

    return <div>
        <WalletModalProvider>
            <div className="walletBar">
            <WalletMultiButton className="walletButton" />
            <WalletDisconnectButton className={!publicKey? "disconHidden" : "disconButton"} />
            </div>
        </WalletModalProvider>      
    </div>;
}
