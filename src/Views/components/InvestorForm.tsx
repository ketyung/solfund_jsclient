import React, {useState} from 'react';
import { Form, Input } from 'antd';
import { error } from '../../utils/Mesg';

interface FundPoolFormProps {


    tokenToSol : number, 

    remainingToken : number, 
    
    setValuesOf : (token_count : number, amount : number, errorMessage : string | null )=>void,

}


export const InvestorForm   : React.FC<FundPoolFormProps> = ({tokenToSol, 
    remainingToken, setValuesOf}) =>{
  
    const [tokenCount, setTokenCount] = useState(0);
    
    
   
    const amountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;

        let am = parseFloat(txt); 

        let amval = isNaN(am) ? 0 : am ;
        
        let tkCount = Math.floor(amval / (tokenToSol > 0 ? tokenToSol : 1));

        if (tkCount < remainingToken){
      
            setTokenCount(tkCount);
    
            setValuesOf(tkCount, amval, null );

        }
        else {

    
            let errorMessage  = "Your purchased amount has exceeded the available tokens :"+ remainingToken;
            setValuesOf(0, 0, errorMessage);
            error(errorMessage);

        }
         
    };

    return <div>
    <Form layout="vertical">

        <div style={{minWidth:"200px",backgroundColor:"#334",marginBottom:"20px", padding:"10px",borderRadius:"20px", color:"wheat"}}>
            Token To SOL Ratio : {tokenToSol} , Available Tokens : {remainingToken}
        </div>
   
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
