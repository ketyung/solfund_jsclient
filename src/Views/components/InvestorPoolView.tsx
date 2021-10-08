import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool, extract_fund_pool, FundPoolInvestor } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView } from './FundPoolCardView';
import { Spin } from 'antd';
import useInvestor from '../../Hooks/useInvestor';
import {AlertOutlined} from '@ant-design/icons';

export const InvestorPoolView : React.FC = () => {

    const [,,read] = useUserPool();

    const[,investorPoolKey,,readInvestor] = useInvestor();

    const [connection] = useSolana();

    var tmpFundPools : Array<FundPool> = [];

    const [fundPools, setFundPools] = useState<Array<FundPool>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const [loaded, setLoaded] = useState(false);

    const setAddressPresented = ( address : web3.PublicKey) => {

    }

    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const setShareView = ( _presented : boolean) => { }


    async function readData(pubkey : web3.PublicKey){

        
        readInvestor(pubkey.toBase58(), (res : FundPoolInvestor | Error) =>{

            if ( !(res instanceof Error)){

                console.log("res::", res);
            }
            else {

                console.log("err.x", res);
            }
        })
       
    }


    useEffect(() => {

        async function readUserPool(){

            setFundPoolLoading(true);

            read( (await investorPoolKey()).toBase58(),
            
            (res : UserPool | Error) =>  {
    
                if (!(res instanceof Error)){
        
                
                    for ( var r=0; r < res.addresses.length; r++){

                        readData(res.addresses[r]);

                        console.log("addr.x:", res.addresses[r].toBase58());
                    }

                    setFundPools(tmpFundPools);

                    tmpFundPools.splice(0,tmpFundPools.length);
                   

                    setTimeout(()=>{
                        forceUpdate();
                        setFundPoolLoading(false);
                        setLoaded(true);
                    
                    }, 500);

                }
                else {

                    setFundPoolLoading(false);
                    setLoaded(true);

                }
            
            }) 

        }

        readUserPool();

    }, []);

    const fundPoolsView =
    (fundPools?.map.length ?? 0) > 0 ?
    fundPools?.map(  (fundPool ) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        valueInSol = {fundPool.token_count * fundPool.token_to_sol_ratio}
        className="fundPoolNorm"
        setAddressPresented={setAddressPresented}
        setShareView={setShareView}
        />

    })
    
    :

    <div className="emptyPortfolio" style={{display : loaded ? "block" : "none"}}>
    <div className="text">
    <AlertOutlined style={{marginRight:"20px"}}/>
    Your Portfolio is empty, look up in the market to start investing now
    </div>
    </div>
    ;



    return <div className="homeFundPoolDiv">
    <p><div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
    <span className="title">Your Portfolio</span>   
    </p>

    {fundPoolsView}

    </div>
}