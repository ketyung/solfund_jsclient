import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useToken from '../../Hooks/useToken';
import { Button, Spin, Modal, Form, Input } from 'antd';
import { success,error } from '../../utils/Mesg';
import '../css/common.css';
//import * as web3 from '@solana/web3.js';


export const TokenTestView : React.FC = () => {


    const [createAndMintToken, , tokenProcessing, getTokenAddress, createMint3] = useToken();

    const [modalPresented, setModalPresented] = useState(false);

    const [modal2Presented, setModal2Presented] = useState(false);

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


    const tokenForm =  <Form layout="vertical">
    <Form.Item label="Seed" required tooltip="This is a required field">
        <Input placeholder="seed"  onChange={seedOnChange}/>
    </Form.Item>

    <Form.Item label="Number of tokens" required tooltip="This is a required field">
        <Input placeholder="number of tokens"  onChange={tokenCountOnChange}/>
    </Form.Item>
    </Form>


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

          }} >Create And Mint Token 1 (Rust Tkprog)</Button></p>


        <p><Button className="commonButton" onClick={async ()=> {
              
              setModal2Presented(true);

        }} >Create Mint 3</Button></p>

        
        <p><Button className="commonButton" onClick={async ()=> {
                               
                let address = await getTokenAddress(seed);

                //if (address){
                    success("Token Address is :"+ address?.toBase58());
                //}
               // else {
                 //   error("Failed to get token address");
               // }
        }} >Get Token Address With Mint</Button></p>
   

       <Modal title="Create And Mint Token 1"
          style={{minWidth:"80%"}}
          visible={modalPresented}
          onOk={async ()=>{
                setModalPresented(false);
      
                createAndMintToken(seed, tokenCount, completion);

             //  createAndMintTk2(seed, tokenCount, completion  );
               
          }}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Create"
          cancelButtonProps={{ disabled: false }}>
          {tokenForm}
      
       </Modal>

      
       <Modal title="Create Mint 3"
          style={{minWidth:"80%"}}
          visible={modal2Presented}
          onOk={async ()=>{
                setModal2Presented(false);
      
               //createAndMintToken(seed, tokenCount, completion);

               //createAndMintTk2(seed, tokenCount, completion  );
               
               createMint3(seed, tokenCount, completion);
          }}
          onCancel={()=>{setModal2Presented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Create"
          cancelButtonProps={{ disabled: false }}>
          {tokenForm}
      
       </Modal>

      
      
    </div>;

}