import React, {useState} from 'react';
import 'antd/dist/antd.css';
import { Button, Spin, Modal } from 'antd';
import { success,error } from '../../utils/Mesg';
import useMarket from '../../Hooks/useMarket';
import { Market } from '../../state';
import '../css/common.css';
import { POOL_MARKET_KEY } from '../../Hooks/useMarket';
import { MarketFundPoolsView } from '../components/MarketFundPoolsView';


export const PoolMarketTestView : React.FC = () =>{

    const [createMarketAccount, , loading] = useMarket();

    const completion2 = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 5);

            console.log("succ::",res );
        }
    }


    return <div>
          <div style={{display: loading ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>

          <p><Button className="commonButton" danger onClick={async ()=> {
              
              createMarketAccount(completion2);

          }} >Create Market</Button></p>
       
          <div style={{margin:"auto",padding:"10px",textAlign:"center"}}>
          <MarketFundPoolsView address={POOL_MARKET_KEY} />
          </div>         
        
        
    </div>;

} 
