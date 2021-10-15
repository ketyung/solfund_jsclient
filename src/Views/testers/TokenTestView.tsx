/**
 * This is only a test view for me to test & understand the token mint, initialize
 * , account creation & initialization and sending the instruction to the Rust side
 * to mint the tokens etc. And also token list etc. This will be removed in the future
 * By Christopher K Y Chee (ketyung@techchee.com)
 */

import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useToken from '../../Hooks/useToken';
import { Button, Spin, Modal, Form, Input } from 'antd';
import { success,error } from '../../utils/Mesg';
import '../css/common.css';
//import * as web3 from '@solana/web3.js';

export const TokenTestView : React.FC = () => {


    const [createAndMintToken, tokenProcessing,, txTo] = useToken();

    const [modalPresented, setModalPresented] = useState(false);

    const [modal2Presented, setModal2Presented] = useState(false);

    const [,setModal3Presented] = useState(false);

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
              
              setModal2Presented(true);

        }} >Create Mint And Mint To:</Button></p>

        
      

        <p><Button className="commonButton" onClick={async ()=> {
              
              let minStr = "HKjHDFWwbZBRATZGDejX35JxHfvxr4gCXJv4ptzqvVhy";
        
              let accSeed ="xxxx";

              let pdaAcc ="7P9EmT6qD1DRCXPmu1MHhouQtq55Ld3iAKEunLV88bKU";
              let tkAcc = "FSgcuznsj12jyUxXsksCL3iLkt6sHXbXMkWvrueSyDny";
              txTo(minStr,accSeed,tkAcc, pdaAcc, 450, completion);

        }} >tx To Me again!</Button></p>


        <p><Button className="commonButton" onClick={async ()=> {
              
              setModal3Presented(true);

        }}>Show Token List</Button></p>

       


        <p><a style={{color:"white"}} 
        href="https://solscan.io/account/4jMJG9RfsdonDTShkHTxv2R7rGTqd3NC2Fqb9ckmrT3X?cluster=devnet"
        target="_blank" rel="noreferrer">View on SolScan</a></p>

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

      
       <Modal title="Create Mint Only"
          style={{minWidth:"80%"}}
          visible={modal2Presented}
          onOk={async ()=>{
                setModal2Presented(false);
      
               createAndMintToken(seed, tokenCount, completion);

          }}
          onCancel={()=>{setModal2Presented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Create"
          cancelButtonProps={{ disabled: false }}>
          {tokenForm}
      
       </Modal>


      
    </div>;

}