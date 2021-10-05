import React from 'react';
import useSolana from '../../Hooks/useSolana';
import './css/HomePageView.css';
import { ManagerPoolView } from './ManagerPoolView';
export const HomePageView : React.FC = () => {

   
    const connectWalletDiv = () => {

        return  <div className="connectWallet">
        Connect your wallet, be a fund manager or invest in any fund pools!
        </div>
  
    }


   

    return <div><ManagerPoolView/></div>
}