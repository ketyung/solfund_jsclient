import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool, extract_fund_pool } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView } from './FundPoolCardView';


export const ManagerPoolView : React.FC = () => {

    const [,loading,read, managerPoolKey] = useUserPool();

    const [connection] = useSolana();

    var tmpFundPools : Array<FundPool> = [];

    const [fundPools, setFundPools] = useState<Array<FundPool>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const setAddressPresented = ( address : web3.PublicKey) => {

    }


    async function readData(pubkey : web3.PublicKey){

        
        let fpAcc = await connection.getAccountInfo(pubkey);

        if (fpAcc != null){

            extract_fund_pool(fpAcc.data, (res : FundPool | Error) =>  {

                if (!(res instanceof Error)){
        
                    if ( res.address.toBase58() !== web3.PublicKey.default.toBase58()){

                        if (tmpFundPools.indexOf(res) === -1 ){

                            tmpFundPools.push(res);
                        }
                    }
                   
                }
            });

        }

    }


    useEffect(() => {

        async function readManagerPool(){

            read( (await managerPoolKey(null)).toBase58(),
            
            (res : UserPool | Error) =>  {
    
                if (!(res instanceof Error)){
        
                    
                    for ( var r=0; r < res.addresses.length; r++){

                        readData(res.addresses[r]);
                    }

                    setFundPools(tmpFundPools);

                    setTimeout(forceUpdate, 500);

                }
            
            }) 

        }

        readManagerPool();

    }, []);

    const fundPoolsView = fundPools?.map(  (fundPool, index) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        setAddressPresented={setAddressPresented}
        />

    });



    return <div>
    <h2 style={{fontWeight:"bolder", color:"white"}}>Your Fund Pools</h2>
    {fundPoolsView}
    </div>
}