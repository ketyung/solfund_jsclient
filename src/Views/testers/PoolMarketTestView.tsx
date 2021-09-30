import React, {useState} from 'react';
import 'antd/dist/antd.css';
import { Button, Spin, Modal } from 'antd';
import { success,error } from '../../utils/Mesg';
import usePoolMarket from '../../Hooks/usePoolMarket';
import { PoolMarket } from '../../state';
import '../css/common.css';
import { POOL_MARKET_KEY } from '../../Hooks/usePoolMarket';

export const PoolMarketTestView : React.FC = () =>{

    const [createPoolMarketAccount, read, loading] = usePoolMarket();

    const [poolMarket, setPoolMarket] = useState<PoolMarket>();

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
              
              createPoolMarketAccount(completion2);

          }} >Create Pool Market Account</Button></p>
       
         
          <p><Button className="commonButton" type="primary" onClick={()=>{
              
             
              read(POOL_MARKET_KEY, 
                
                (res : PoolMarket | Error) =>  {

                    if (res instanceof Error){
            
                        error((res as Error).message, 5 );
                        setModalPresented(false);
                    }
                    else {
            
                        setPoolMarket(res);
                        setModalPresented(true);
                    }
            
                }
            );

          }} >Read Data</Button></p>

        <Modal title={"Registered Addresses : " + poolMarket?.pool_size }
          style={{minWidth:"80%"}}
          visible={modelPresented}
          onCancel={()=>{

            setModalPresented(false);

          }}

          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: false }}>
          {

            poolMarket?.fund_pools.map (( address , index) => {

               // console.log("addr"+index, address.toBase58());
                return <div style={{textAlign: "justify", margin:"10px"}}>
                {index + 1}. {address.toBase58()}
                </div>;

            })
        }


        </Modal>
        
    </div>;

} 
