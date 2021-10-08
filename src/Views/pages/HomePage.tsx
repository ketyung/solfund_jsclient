import React from 'react';
import './css/HomePage.css';
import { ManagerPoolView } from '../components/ManagerPoolView';
import { InvestorPoolView } from '../components/InvestorPoolView';
import useSolana from '../../Hooks/useSolana';
import {WalletOutlined} from '@ant-design/icons';

export const HomePage : React.FC = () => {

   
    const [,publicKey] = useSolana();

    const connectWalletDiv = 
    
        publicKey ?

        <div>
        
        <InvestorPoolView/><br/><br/>
        <ManagerPoolView address={null}/>
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