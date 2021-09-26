import React, {useState} from 'react';
import 'antd/dist/antd.css';
import { Button, Spin, Modal } from 'antd';
import { success,error } from '../../utils/Mesg';
import { Wallet } from "../Wallet";
import usePoolMarket from '../../Hooks/usePoolMarket';
import { PoolMarket } from '../../models';
import './css/common.css';

export const PoolMarketTestView : React.FC = () =>{

    const [createPoolMarketAccount, createPoolMarket, registreAddress, read, loading] = usePoolMarket();

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
         <Wallet/>
          <br/>
          <br/>
          <div style={{display: loading ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>

          <p><Button className="commonButton" danger onClick={async ()=> {
              
              createPoolMarketAccount(completion2);

          }} >Create Pool Market Account</Button></p>
       
          <p><Button className="commonButton" block onClick={()=>{
              
              createPoolMarket(completion2);

          }} >Create Pool Market</Button></p>

          <p><Button className="commonButton" type="primary" onClick={()=>{
              
              registreAddress(null, completion2);

          }} >Register Random Address</Button></p>

          <p><Button className="commonButton" style={{height:"70px"}} type="primary" onClick={()=>{
              
              registreAddress("EG3gDphS8oWnjXYMVGc7mGKRoxdJzz3J944nZioJ8qvm", completion2);

          }} >Register Random Address,<br/> 
          EG3gDphS8oWnjXYMVGc7mGKRoxdJzz3J944nZioJ8qvm</Button></p>


        
          <p><Button className="commonButton" type="primary" onClick={()=>{
              
              read(null, 
                
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

        <Modal title="Basic Modal"
          visible={modelPresented}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: true }}>
        <div>Registered Addresses</div>

        {

            poolMarket?.fund_pools.map (( address , index) => {

                console.log("addr"+index, address.toBase58());
                return <div style={{textAlign: "justify"}}>
                {index + 1}. {address.toBase58()}
                </div>;

            })
        }


        </Modal>
        
    </div>;

} 
