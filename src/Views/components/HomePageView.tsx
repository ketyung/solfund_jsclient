import React from 'react';
import './css/HomePageView.css';
import { ManagerPoolView } from './ManagerPoolView';
import { InvestorPoolView } from './InvestorPoolView';
import useSolana from '../../Hooks/useSolana';
import {WalletOutlined} from '@ant-design/icons';

export const HomePageView : React.FC = () => {

   
    const [,publicKey] = useSolana();

    const connectWalletDiv = 
    
        publicKey ?

        <div>
        
        <InvestorPoolView/><br/><br/>
        <ManagerPoolView/>
        <br/>
 
        </div>
  
        :
        <div className="connectWallet">
        <WalletOutlined style={{marginRight:"20px"}}/> Connect your wallet, be a fund manager or invest in any fund pools!
        </div>
  
    

   

    return <div>
        {
            connectWalletDiv
        }
    </div>
}