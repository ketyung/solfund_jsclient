import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import './css/Wallet.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useRoute } from 'wouter';
import { HomeOutlined, FundOutlined, InfoCircleOutlined } from '@ant-design/icons';

export const Wallet : React.FC = () => {

    const { publicKey } = useWallet();

    const [matchHome] = useRoute("/");

    const [matchPoolMarket] = useRoute("/market");

    const [matchTokenTest] = useRoute("/tokentest");

    const [matchAbout] = useRoute("/about");


    return <div>
        <WalletModalProvider>
            <div className="walletBar">
            <div className={matchHome ? "topLinkSel" : "topLink"}>
                <Link href="/">
                <a className="link">Home <HomeOutlined /></a>
                </Link>
            </div>
            <div className={matchPoolMarket ? "topLinkSel" : "topLink"}>
                <Link href="/market">
                <a className="link">Market <FundOutlined /></a>
                </Link>
            </div>
            <div className={matchAbout ? "topLinkSel" : "topLink"}>
                <Link href="/about">
                <a className="link">About <InfoCircleOutlined /></a>
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
