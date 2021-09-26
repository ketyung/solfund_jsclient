import React, {useState} from 'react';
import 'antd/dist/antd.css';
import { Button, Spin } from 'antd';
import { success,error } from '../../utils/Mesg';
import { Wallet } from "../Wallet";
import usePoolMarket from '../../Hooks/usePoolMarket';
import './css/common.css';

export const PoolMarketTestView : React.FC = () =>{

    const [createPoolMarketAccount, createPoolMarket, registreAddress, read, loading] = usePoolMarket();


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
              
              read("EG3gDphS8oWnjXYMVGc7mGKRoxdJzz3J944nZioJ8qvm");

          }} >Read Data</Button></p>
        
    </div>;

} 
