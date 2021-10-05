import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool, extract_fund_pool } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView } from './FundPoolCardView';
import { Spin } from 'antd';
import useInvestor from '../../Hooks/useInvestor';
import {AlertOutlined} from '@ant-design/icons';

export const InvestorPoolView : React.FC = () => {

    const [,,read] = useUserPool();

    const[,investorPoolKey] = useInvestor();

    const [connection] = useSolana();

    var tmpFundPools : Array<FundPool> = [];

    const [fundPools, setFundPools] = useState<Array<FundPool>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const setAddressPresented = ( address : web3.PublicKey) => {

    }

    const [fundPoolLoading, setFundPoolLoading] = useState(false);


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

            setFundPoolLoading(true);

            read( (await investorPoolKey()).toBase58(),
            
            (res : UserPool | Error) =>  {
    
                if (!(res instanceof Error)){
        
                    
                    for ( var r=0; r < res.addresses.length; r++){

                        readData(res.addresses[r]);
                    }

                    setFundPools(tmpFundPools);

                    setTimeout(()=>{
                        forceUpdate();
                        setFundPoolLoading(false);
                    }, 500);

                }
                else {

                    setFundPoolLoading(false);
                }
            
            }) 

        }

        readManagerPool();

    }, []);

    const fundPoolsView =
    (fundPools?.map.length ?? 0) > 0 ?
    fundPools?.map(  (fundPool, index) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        className="fundPoolNorm"
        setAddressPresented={setAddressPresented}
        />

    })
    
    :

    <div className="emptyPortfolio">
    <AlertOutlined style={{marginRight:"20px"}}/>
    Your Portfolio is empty, look up in the market to start investing now
    </div>
    ;



    return <div className="homeFundPoolDiv">
    <p><div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
    <span className="title">Your Portfolio</span>   
    </p>

    {fundPoolsView}

    </div>
}