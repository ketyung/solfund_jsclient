import React from 'react';
import './css/HomePage.css';
import { ManagerPoolView } from '../components/ManagerPoolView';
import { InvestorPoolView } from '../components/InvestorPoolView';
import useSolana from '../../Hooks/useSolana';
import {WalletOutlined} from '@ant-design/icons';
import {logo} from '../components/MenuView';

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
        <div>
        
        <div className="tempCenterLogo">
        {logo(200,200, {margin:"auto"})}
        </div>
       
       <div className="connectWallet">
        <WalletOutlined style={{marginRight:"20px"}}/> Connect your wallet, be a fund manager or invest in any fund pools!
        </div>
        <div className="tempInfo">
        Currently it works on the DevNet only !
        </div>

        <div style={{color:"wheat",marginTop:"40px"}}>
            Note: Some CSS isn't optimized for mobile yet, will do soon...
        </div>
        </div>
    
      
   

    return <div>
        {
            connectWalletDiv
        }
    </div>
}