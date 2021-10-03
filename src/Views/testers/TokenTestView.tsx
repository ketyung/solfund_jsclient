import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useToken from '../../Hooks/useToken';
import { Button, Spin, Modal, Form, Input } from 'antd';
import { success,error } from '../../utils/Mesg';
import '../css/common.css';
import * as web3 from '@solana/web3.js';


export const TokenTestView : React.FC = () => {


    const [, createAndMintTk2, tokenProcessing] = useToken();

    const [modalPresented, setModalPresented] = useState(false);

    const [tokenCount, setTokenCount] = useState(0);
    
    const [seed, setSeed] = useState("");
    

    const tokenCountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;

        setTokenCount(parseInt(txt)); 
      
    };

    const seedOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;
        setSeed(txt);
      
    };

    const completion = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 5);

        }
    }

    return <div>
          <div style={{display: tokenProcessing 
            ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>

          <p><Button className="commonButton" onClick={async ()=> {
              
                setModalPresented(true);

          }} >Create And Mint Token</Button></p>

       
      
       <Modal title="Create And Mint Token"
          style={{minWidth:"80%"}}
          visible={modalPresented}
          onOk={async ()=>{
                setModalPresented(false);
      
               //createAndMintToken(seed, tokenCount, completion);

               createAndMintTk2(seed, tokenCount, completion  );
               
          }}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Create"
          cancelButtonProps={{ disabled: false }}>
       
       <Form layout="vertical">

            <Form.Item label="Seed" required tooltip="This is a required field">
                <Input placeholder="seed"  onChange={seedOnChange}/>
            </Form.Item>

            <Form.Item label="Number of tokens" required tooltip="This is a required field">
                <Input placeholder="number of tokens"  onChange={tokenCountOnChange}/>
            </Form.Item>

        </Form>

       </Modal>

      

    </div>;

}