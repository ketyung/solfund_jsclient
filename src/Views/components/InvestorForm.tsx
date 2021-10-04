import React, {useState} from 'react';
import { Image, RadioChangeEvent } from 'antd';
import { Form, Input, Radio, Button, Modal } from 'antd';
import { IconChooser, ICONS } from './IconsChooser';
import {PublicKey} from '@solana/web3.js';

interface FundPoolFormProps {


    
    setValuesOf : (token_count : number, amount : number )=>void,


}


export const InvestorForm   : React.FC<FundPoolFormProps> = ({setValuesOf}) =>{
  
    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
    

    const tokenCountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;

        setTokenCount(parseInt(txt)); 
        setValuesOf(tokenCount, amount);
    
    };


    const amountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;

        setAmount(parseInt(txt));   
        setValuesOf(tokenCount, amount);
         
    };

    return <div>
    <Form layout="vertical">
    <Form.Item label="Number of tokens" required tooltip="This is a required field">
        <Input placeholder="number of tokens"  onChange={tokenCountOnChange}/>
    </Form.Item>

    <Form.Item label="Amount In SOL" required tooltip="This is a required field">
        <Input placeholder="amount in SOL" onChange={amountOnChange}/>
    </Form.Item>

  
</Form>
</div>

}
