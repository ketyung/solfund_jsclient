import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import './css/Wallet.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useRoute } from 'wouter';

export const Wallet : React.FC = () => {

    const { publicKey } = useWallet();

    const [matchHome] = useRoute("/");

    const [matchPoolMarket] = useRoute("/poolmarket");

    const [matchTokenTest] = useRoute("/tokentest");


    return <div>
        <WalletModalProvider>
            <div className="walletBar">
            <div className={matchHome ? "topLinkSel" : "topLink"}>
                <Link href="/">
                <a className="link">Home</a>
                </Link>
            </div>
            <div className={matchPoolMarket ? "topLinkSel" : "topLink"}>
                <Link href="/poolmarket">
                <a className="link">Market</a>
                </Link>
            </div>
            <div className={matchTokenTest ? "topLinkSel" : "topLink"}>
                <Link href="/tokentest">
                <a className="link">Token</a>
                </Link>
            </div>
           
            <WalletMultiButton className="walletButton" />
            <WalletDisconnectButton className={!publicKey? "disconHidden" : "disconButton"} />
            </div>
        </WalletModalProvider>      
    </div>;
}
