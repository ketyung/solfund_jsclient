import React, {useEffect, useState} from 'react';
import useMarket from '../../Hooks/useMarket';
import useSolana from '../../Hooks/useSolana';
import { FundPool, Market } from '../../state';
import { error } from '../../utils/Mesg';
import { extract_fund_pool } from '../../state';
import * as web3 from '@solana/web3.js';
import {FundPoolCardView} from './FundPoolCardView';
import {Modal,Spin} from 'antd';
import {InvestorForm} from './InvestorForm';
import './css/modal.css';

interface MarketFundPoolsProps {

    address : string
}

export const MarketFundPoolsView : React.FC <MarketFundPoolsProps> = ({address}) => {
    
    const [connection] = useSolana();

    const [,read] = useMarket();

    var tmpFundPools : Array<FundPool> = [];

    const [fundPools, setFundPools] = useState<Array<FundPool>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const [modalPresented, setModalPresented] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState<web3.PublicKey>();

    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
   
    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const setValuesOf = (token_count : number, amount : 
        number ) => {

        setTokenCount(token_count);
        setAmount(amount);
    }


    const setAddressPresented = ( address : web3.PublicKey) => {

        setSelectedAddress(address);

        setModalPresented(true);
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


    const fundPoolsView = fundPools?.map(  (fundPool, index) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        setAddressPresented={setAddressPresented}
        />

    });



    useEffect(() => {
    
        async function readAddr (){

            setFundPoolLoading(true);
            
            await read (address, 
        
                (res : Market | Error) =>  {
    
                    if (res instanceof Error){
            
                        error(res.message);
                    }
                    else {
            
                        for ( var r=0; r < res.fund_pools.length; r++){

                            readData(res.fund_pools[r]);
                        }

                        setFundPools(tmpFundPools);

                        setTimeout(()=>{
                            forceUpdate();
                            setFundPoolLoading(false);   
                        }, 500);

                       
                    }
            
                }
            );
        }
        
        readAddr();
     
    }, [address])
  

    return <div style={{display:"block",textAlign:"center",margin:"0px auto",padding:"auto"}}>
    <div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
   
    {

        fundPoolsView
  
    }
   
    <Modal title={ selectedAddress?.toBase58() ?? ""}
        className="roundModal"
         visible={modalPresented}
          onCancel={()=>{

              setModalPresented(false);
            
          }}

          okText="Sign & Invest"

          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}>
         <InvestorForm setValuesOf={setValuesOf} />
        
    </Modal>

    </div>;
}