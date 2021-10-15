import React, {useState} from 'react';
import 'antd/dist/antd.css';
import { Button, Spin } from 'antd';
import useMarket from '../../Hooks/useMarket';
import '../css/common.css';
import { POOL_MARKET_KEY } from '../../utils/Keys';
import { MarketFundPoolsView } from '../components/MarketFundPoolsView';
import {ReloadOutlined, /*FileAddOutlined */} from '@ant-design/icons';


export const MarketPage : React.FC = () =>{

    const [/*createMarketAccount */, , loading] = useMarket();

    const [reload, setReload] = useState(false);

  

    return <div>
          <div style={{display: loading ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>

          <Button shape="circle" style={{position:"fixed",  top:"100px",left:"40px", zIndex:1000}} onClick={async ()=> {    
              
              setReload(!reload);
              
          }} ><ReloadOutlined/></Button>
       

          {
              /**
          <Button shape="circle" style={{position:"fixed", display:"none", top:"200px",left:"40px", zIndex:1000}} onClick={async ()=> {    
              createMarketAccount(completion2);
          }} ><FileAddOutlined/></Button> */
        
        }
        
        
          <div style={{margin:"auto",padding:"10px",textAlign:"center"}}>
          <MarketFundPoolsView address={POOL_MARKET_KEY} reload={reload} />
          </div>         
        
          
    </div>;

} 
