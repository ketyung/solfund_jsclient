import React from 'react';
import { Button } from 'antd';
import './css/PoolManageView.css';

export const PoolManageView : React.FC  = () => {

    return <div>
       
        <div style={{margin:"10px",fontWeight:"bolder", color:"white"}}>
        <Button className="manageButton" onClick={async ()=> {
              
          }}>Remove This Pool From Market</Button>
        </div>

        <div style={{margin:"10px",fontWeight:"bolder", color:"white"}}>
        <Button className="manageButton" onClick={async ()=> {
              
          }}>Invest In DEX
       </Button>
        </div>
        
    </div>
}