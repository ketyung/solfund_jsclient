import React, {useEffect, useState} from 'react';
import useMarket from '../../Hooks/useMarket';
import useSolana from '../../Hooks/useSolana';
import { FundPool, Market } from '../../state';
import { error } from '../../utils/Mesg';
import { Card } from 'antd';
import { extract_fund_pool } from '../../state';
import * as web3 from '@solana/web3.js';


interface MarketFundPoolsProps {

    address : string
}

export const MarketFundPoolsView : React.FC <MarketFundPoolsProps> = ({address}) => {
    
    const [connection] = useSolana();

    const [,read] = useMarket();

    var fundPools : Array<FundPool> = [];



    async function readData(pubkey : web3.PublicKey){

        
        let fpAcc = await connection.getAccountInfo(pubkey);

        if (fpAcc != null){

            extract_fund_pool(fpAcc.data, (res : FundPool | Error) =>  {

                if (!(res instanceof Error)){
        
                    fundPools.push(res);
                }
            });

        }

    }


    const fundPoolsView = fundPools?.map(  (fundPool , index) => {

        return <div className="fundPool">        

        <Card type="inner" title="Address">
         <span style={{maxWidth:"200px",textOverflow:"ellipsis"}}>
             {fundPool.address.toBase58()}
         </span>
        </Card>        
        </div>        

    });



    useEffect(() => {
    
        async function readAddr (){

            await read (address, 
        
                (res : Market | Error) =>  {
    
                    if (res instanceof Error){
            
                        error(res.message);
                    }
                    else {
            
                        for ( var r=0; r < res.fund_pools.length; r++){

                            readData(res.fund_pools[r]);
                        }

                        //console.log("fps:", fundPools);

                    }
            
                }
            );
        }
        
        readAddr();
     
    }, [address])
  

    return <div>
    {

        fundPoolsView
  
    }
    </div>;
}