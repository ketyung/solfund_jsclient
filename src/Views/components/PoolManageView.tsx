import React from 'react';
import { Button } from 'antd';
import './css/PoolManageView.css';
import {FundPool} from '../../state';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';

interface PoolManageViewProps {

    fundPool : FundPool | undefined, 
}


export const PoolManageView : React.FC <PoolManageViewProps> = ({fundPool}) => {

    return <div>

        <div style={{marginBottom:"20px",fontWeight:"bolder", color:"white"}}>
          <div className="fundAmount">
          Available Fund {((fundPool?.lamports ?? 0)/LAMPORTS_PER_SOL).toFixed(5)} SOL
          </div>
        </div> 
        <div style={{marginBottom:"20px",fontWeight:"bolder", color:"white"}}>
        <Button className="manageButton" onClick={async ()=> {
              
          }}>Invest In DEX
       </Button>
        </div>

       
        <div style={{marginBottom:"20px",fontWeight:"bolder", color:"white"}}>
        <Button className="manageButton" onClick={async ()=> {
              
          }}>Remove This Pool From Market</Button>
        </div>
 
    </div>
}