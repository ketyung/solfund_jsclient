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

    const [createMarketAccount, read, loading] = useMarket();

    const [market, setMarket] = useState<Market>(Market.default());

    const [modelPresented, setModalPresented] = useState(false);

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
       
         
          <p><Button className="commonButton" type="primary" onClick={()=>{
              
                setModalPresented(true);

                /**
                read(POOL_MARKET_KEY, (res : Market | Error) =>  {

                    if (res instanceof Error){
            
                        console.log("Error!", res);
                    
                    }
                    else {
            
                        setMarket(market);
                        console.log("mark", market.fund_pools);

                        setModalPresented(true);
                    }
            
                }); */
                    
          }} >Read Data</Button></p>

        <Modal title={"Registered Addresses : "  }
          style={{minWidth:"80%"}}
          visible={modelPresented}
          onCancel={()=>{

            setModalPresented(false);

          }}

          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: false }}>
          
          <MarketFundPoolsView address={POOL_MARKET_KEY} />

        </Modal>
        
    </div>;

} 
