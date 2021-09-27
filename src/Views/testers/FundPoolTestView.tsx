import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useFundPool from '../../Hooks/useFundPool';
import { Button, Spin, Modal } from 'antd';
import { success,error } from '../../utils/Mesg';
import { Wallet } from "../Wallet";

export const FundPoolTesterView : React.FC = () => {


    const [createFundPoolAccount, createFundPool, loading] = useFundPool();

    const [modelPresented, setModalPresented] = useState(false);

    const completion = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 5);

        }
    }

    return <div>
        <Wallet/>
          <br/>
          <br/>
          <div style={{display: loading ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>

          <p><Button className="commonButton" danger onClick={async ()=> {
              
              createFundPoolAccount(completion);

          }} >Create Fund Pool Account</Button></p>
       
         <p><Button className="commonButton" danger onClick={async ()=> {
              
              setModalPresented(true);

          }} >Create Fund Pool</Button></p>
       


       <Modal title="Create Fund Pool"
          style={{minWidth:"80%"}}
          visible={modelPresented}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: false }}>
       
       
       </Modal>

    </div>;

}