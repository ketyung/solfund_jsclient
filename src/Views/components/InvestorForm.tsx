import React, {useState} from 'react';
import { Form, Input, Radio, Button, Modal } from 'antd';

interface FundPoolFormProps {


    tokenToSol : number, 
    
    setValuesOf : (token_count : number, amount : number )=>void,

}


export const InvestorForm   : React.FC<FundPoolFormProps> = ({tokenToSol, setValuesOf}) =>{
  
    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
    

    const amountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;

        let am = parseFloat(txt); 

        let amval = isNaN(am) ? 0 : am ;
        setAmount(amval);
        
        let tkCount = amval / (tokenToSol > 0 ? tokenToSol : 1);

        setTokenCount(Math.floor(tkCount));

        setValuesOf(tokenCount, amount);
         
    };

    return <div>
    <Form layout="vertical">
   
        <Form.Item label="Amount In SOL" required tooltip="This is a required field">
            <Input placeholder="amount in SOL" onChange={amountOnChange}/>
        </Form.Item>

        <Form.Item label="Number of tokens you'll get" required tooltip="This is a required field">
            <div style={{maxWidth:"200px",padding:"10px",backgroundColor:"#238", 
            color:"white", borderRadius:"20px"}}>
                {tokenCount}
            </div>
        </Form.Item>

    </Form>
</div>

}
