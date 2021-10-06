import React from 'react';
import 'antd/dist/antd.css';
import { Button, Spin } from 'antd';
import { success,error } from '../../utils/Mesg';
import useMarket from '../../Hooks/useMarket';
import '../css/common.css';
import { POOL_MARKET_KEY } from '../../Hooks/useMarket';
import { MarketFundPoolsView } from './MarketFundPoolsView';
import {FileAddOutlined} from '@ant-design/icons';


export const PoolMarketPageView : React.FC = () =>{

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


          <Button shape="circle" style={{position:"fixed", display:"none", top:"100px",left:"40px", zIndex:1000}} onClick={async ()=> {    
              createMarketAccount(completion2);
          }} ><FileAddOutlined/></Button>
          
        
        
          <div style={{margin:"auto",padding:"10px",textAlign:"center"}}>
          <MarketFundPoolsView address={POOL_MARKET_KEY} />
          </div>         
        
          
    </div>;

} 
