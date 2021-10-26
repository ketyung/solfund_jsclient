import React, {useState} from 'react';
import { Input, Button } from 'antd';
import { getMarket } from '../../Raydium/utils/market';
import useSolana from '../../Hooks/useSolana';

export const RaydiumTestView : React.FC = () => {

    const [marketAddress, setMarketAddtess] = useState("");

    const [ connection ] = useSolana();

    const addressOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;
        
        setMarketAddtess(txt);
      
    };



    return <div style={{color:"white"}}>
        <p>
            <span>Market Address</span>
            <span style={{marginLeft:"20px"}}>
            <Input placeholder="market address" onChange={addressOnChange} 
            style={{maxWidth:"500px",backgroundColor:"#113", color:"wheat"}} />
            </span>
        </p>

        <p>
            <Button shape="round" onClick={async ()=>{

                let market = await getMarket(connection, marketAddress);
                console.log("market is::", market);
                
            }}>
                Get Market
            </Button>
        </p>

    </div>

}