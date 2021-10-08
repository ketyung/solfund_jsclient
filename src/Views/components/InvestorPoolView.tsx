import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import { UserPool, FundPool, FundPoolInvestor } from '../../state';
import * as web3 from '@solana/web3.js';
import { Button, Spin } from 'antd';
import useInvestor from '../../Hooks/useInvestor';
import useFundPool from '../../Hooks/useFundPool';
import {AlertOutlined,ReloadOutlined} from '@ant-design/icons';
import { InvestorFundCardViewProps, InvestorFundCardView } from './InvestorFundCardView';
import './css/InvestorFundCardView.css';

export const InvestorPoolView : React.FC = () => {

    const [,,read] = useUserPool();

    const[,investorPoolKey,,readInvestor] = useInvestor();

    const[,,readFundPool] = useFundPool();

    var tmpInvestorPools : Array<InvestorFundCardViewProps> = [];

    const [investorPools, setInvestorPools] = useState<Array<InvestorFundCardViewProps>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const [loaded, setLoaded] = useState(false);

    const [investorPoolLoading, setInvestorPoolLoading] = useState(false);


    async function readData(pubkey : web3.PublicKey){

        readInvestor(pubkey.toBase58(), (res : FundPoolInvestor | Error) =>{

            if ( !(res instanceof Error)){
                //tokenCount, poolTokenCount, poolAddress, poolManager,  icon, className
               
                readFundPool(res.pool_address.toBase58(), (fp : FundPool |Error)=>{

                    if ( !(fp instanceof Error)){

                        let invPool : InvestorFundCardViewProps = {

                            tokenCount : res.token_count, 
                            poolTokenCount : fp?.token_count,
                            poolAddress : fp.address.toBase58(), 
                            poolManager : fp.manager.toBase58(),
                            icon : fp.icon, 
                            className: "",
    
                        };

                        tmpInvestorPools.push(invPool);
                    }

                    
                })
            }
            else {

                console.log("err.x", res);
            }
        })
       
    }

    async function readInvestorPool(){

        setInvestorPoolLoading(true);

        read( (await investorPoolKey()).toBase58(),
        
        (res : UserPool | Error) =>  {

            if (!(res instanceof Error)){
    
            
                for ( var r=0; r < res.addresses.length; r++){

                    readData(res.addresses[r]);

                }

                setInvestorPools(tmpInvestorPools);

                tmpInvestorPools.splice(0,tmpInvestorPools.length);
               

                setTimeout(()=>{
                    forceUpdate();
                    setInvestorPoolLoading(false);
                    setLoaded(true);
                
                }, 500);

            }
            else {

                setInvestorPoolLoading(false);
                setLoaded(true);

            }
        
        }) 

    }

    useEffect(() => {

        readInvestorPool();

    }, []);

    const investorPoolsView =
    (investorPools?.map.length ?? 0) > 0 ?
    investorPools?.map(  (invPool, index ) => {

        return <InvestorFundCardView  tokenCount={invPool.tokenCount} poolTokenCount={invPool.poolTokenCount}
        poolAddress={invPool.poolAddress} poolManager={invPool.poolManager} 
        className={(index % 3 === 0) ? "investorPoolNorm" : "investorPoolBrk"} icon={invPool.icon} />

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
    <p><div style={{display: investorPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
    <span className="title">Your Portfolio</span>   

    <Button shape="circle" style={{marginLeft:"10px"}} onClick={async ()=> {
            await readInvestorPool();}}>
        <ReloadOutlined />
    </Button>
    
    </p>

    {investorPoolsView}

    </div>
}