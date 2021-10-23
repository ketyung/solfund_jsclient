import React from 'react';
import {
    WalletModalProvider,
  //  WalletDisconnectButton,
    WalletMultiButton,
    
} from '@solana/wallet-adapter-react-ui';
import './css/Wallet.css';
//import { useWallet } from '@solana/wallet-adapter-react';
import { MenuView } from './MenuView';

export const Wallet : React.FC = () => {

   // const { publicKey } = useWallet();

    
    return <div>    
    <WalletModalProvider>
        <div className="walletBar">
           <MenuView/>
           <WalletMultiButton className="walletButton" />
           {
            /** // remove the disconnect button 
            <WalletDisconnectButton className={!publicKey? "disconHidden" : "disconButton"} />
            */      
           }
           
        </div>
    </WalletModalProvider>      
    </div>;
}
