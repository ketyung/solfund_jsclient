import React from 'react';
import './css/HomePageView.css';
import { ManagerPoolView } from './ManagerPoolView';
import { InvestorPoolView } from './InvestorPoolView';
export const HomePageView : React.FC = () => {

   
    const connectWalletDiv = () => {

        return  <div className="connectWallet">
        Connect your wallet, be a fund manager or invest in any fund pools!
        </div>
  
    }


   

    return <div>
        <InvestorPoolView/><br/>
        <ManagerPoolView/>
        <br/>
    </div>
}