import React, {useEffect, useState} from 'react';
import useMarket from '../../Hooks/useMarket';
import useSolana from '../../Hooks/useSolana';
import { FundPool, Market } from '../../state';
import { error } from '../../utils/Mesg';
import { Card } from 'antd';
import { extract_fund_pool } from '../../state';


interface MarketFundPoolsProps {

    address : string
}

export const MarketFundPoolsView : React.FC <MarketFundPoolsProps> = ({address}) => {

    
    const [connection] = useSolana();

    const [,read] = useMarket();

    const [market, setMarket] = useState<Market>();


    useEffect(() => {
    
        read (address, 
        
            (res : Market | Error) =>  {

                if (res instanceof Error){
        
                    error(res.message);
                }
                else {
        
                  //  setMarket(res);

                    //console.log("market.rd!", res);
                }
        
            }
        );
     
    }, [address])
  

    return <div>
    {

        market?.fund_pools.map( async (fundPool , index) => {

            let fpAcc = await connection.getAccountInfo(fundPool);

            if ( fpAcc != null) {

                extract_fund_pool(fpAcc.data, (res : FundPool | Error) =>  {

                    if (!(res instanceof Error)){
            
            
                        return <div className="fundPool">        

                        <Card type="inner" title="Address">
                         <span style={{maxWidth:"200px",textOverflow:"ellipsis"}}>
                             {res.address.toBase58()}</span>
                        </Card>        
           
                      </div>
    
                    }
                    
                });
              
            }


        })

  
    }

    </div>;
}