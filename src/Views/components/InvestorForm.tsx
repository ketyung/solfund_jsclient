import React, {useState} from 'react';
import { Form, Input, Spin } from 'antd';
import { error } from '../../utils/Mesg';

interface FundPoolFormProps {


    tokenToSol : number, 

    remainingToken : number, 
    
    loading : boolean, 

    setValuesOf : (token_count : number, amount : number, errorMessage : string | null )=>void,

}


export const InvestorForm   : React.FC<FundPoolFormProps> = ({tokenToSol, 
    remainingToken, loading, setValuesOf}) =>{
  
    const [tokenCount, setTokenCount] = useState(0);
    
    const roundIt = function(num: number, decimalPlaces: number) {
        const factor = 10 ** decimalPlaces;
        return Math.round(num * factor) / factor;
    };
   
    const amountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;

        let am = parseFloat(txt); 

        let amval : number = roundIt( (isNaN(am) ? 0 : am), 2) ;
        
        var tkCount = Math.floor(amval / (tokenToSol > 0 ? tokenToSol : 1));

        tkCount = Math.floor(tkCount / 10) * 10;

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

        <div style={{minWidth:"200px",backgroundColor:"#254",marginBottom:"20px", padding:"10px",borderRadius:"20px", color:"wheat"}}>
            Token To SOL Ratio : {tokenToSol} , Available Tokens : {remainingToken} 
            <div style={{display: loading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
   
        </div>
   
        <Form.Item  
        label={<label style={{ color: "white" }}>Amount In SOL</label>} 
        required tooltip="This is a required field">
            <Input placeholder="amount in SOL" onChange={amountOnChange}/>
        </Form.Item>

        <Form.Item 
        label={<label style={{ color: "white" }}>Number Of Tokens You'll Get</label>} 
        required tooltip="This is a required field">
            <div style={{maxWidth:"200px",padding:"10px",backgroundColor:"#238", 
            color:"white", borderRadius:"20px"}}>
                {tokenCount}
            </div>
        </Form.Item>

    </Form>
</div>

}
