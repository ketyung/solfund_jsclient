import React, {useState} from 'react';
import { Button, Modal } from 'antd';
import './css/PoolManageView.css';
import {FundPool} from '../../state';
import { TokenSwapView } from './TokenSwapView';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';

interface PoolManageViewProps {

    fundPool : FundPool | undefined, 
}


export const PoolManageView : React.FC <PoolManageViewProps> = ({fundPool}) => {


    const [modalPresented, setModalPresented] = useState(false);

    return <div>

        <div style={{marginBottom:"20px",fontWeight:"bolder", color:"white"}}>
          <div className="fundAmount">
          Available Fund {((fundPool?.lamports ?? 0)/LAMPORTS_PER_SOL).toFixed(5)} SOL
          </div>
        </div> 
        <div style={{marginBottom:"20px",fontWeight:"bolder", color:"white"}}>
        <Button className="manageButton" onClick={async ()=> {
              
              setModalPresented(true);

          }}>Swap Tokens
       </Button>
        </div>

       
        <div style={{marginBottom:"20px",fontWeight:"bolder", color:"white"}}>
        <Button className="manageButton" onClick={async ()=> {
              
          }}>Remove This Pool From Market</Button>
        </div>
 

        <Modal  title={<label style={{ color: "white" }}>Swap Token</label>}
        className="manageViewModal"
         visible={modalPresented}
          onCancel={()=>{

              setModalPresented(false);
            
          }}
          okText="OK"
          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>

          <TokenSwapView/>

        </Modal>

    </div>
}