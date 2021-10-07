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
import { ShareView } from './ShareView';
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

    const [shareModalPresented, setShareModalPresented] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState<web3.PublicKey>();

    const [selectedTokenToSol, setSelectedTokenToSol] = useState(0);


    const [,setTokenCount] = useState(0);
    
    const [,setAmount] = useState(0);
   
    const [loaded, setLoaded] = useState(false);

    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const setValuesOf = (token_count : number, amount : 
        number ) => {

        setTokenCount(token_count);
        setAmount(amount);
    }

    const setShareView = ( presented : boolean, address : web3.PublicKey) => {

        setSelectedAddress( address );
        setShareModalPresented(presented);
    }


    const setAddressPresented = ( address : web3.PublicKey) => {

        setSelectedAddress(address);

        let tkToSol = getSelectedFundPool(address)?.token_to_sol_ratio ?? 0 ;

        console.log(".matched.sel.addr::", 
        address.toBase58(), "ratio::",
        tkToSol);

        setSelectedTokenToSol( tkToSol);

        setModalPresented(true);
    }


    function getSelectedFundPool (address : web3.PublicKey) : FundPool | null {

        let fps = fundPools ?? [];

        for (var r=0; r < fps.length; r++){

            let fp = fps[r];

            if ( fp.address.toBase58() === address.toBase58()){

                return fp ;
            }
        } 

        return null; 
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


    const fundPoolsView = 
    
    (fundPools?.map.length ?? 0) > 0 ? 

    fundPools?.map(  (fundPool, index) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        valueInSol = {fundPool.token_count * fundPool.token_to_sol_ratio}
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        setAddressPresented={setAddressPresented} setShareView={setShareView}
        />

    })

    :

    <div style={{color:"white",fontSize: "20pt", marginTop:"20px", padding:"10px", display : loaded ? "block" : "none"}}>
        Nothing here...
    </div>



    useEffect(() => {
    
        async function readAddr (){

            setFundPoolLoading(true);
            
            await read (address, 
        
                (res : Market | Error) =>  {
    
                    if (res instanceof Error){
            
                        error(res.message);
                        setLoaded(true);
                    }
                    else {
            
                        for ( var r=0; r < res.fund_pools.length; r++){

                            readData(res.fund_pools[r]);
                        }

                        setFundPools(tmpFundPools);

                        tmpFundPools.splice(0,tmpFundPools.length);
                        
                        setTimeout(()=>{
                            forceUpdate();
                            setFundPoolLoading(false);   
                            setLoaded(true);

                           // console.log("markets.fp", fundPools?.map);
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
   
    <Modal title={ (selectedAddress?.toBase58() ?? "") + "  (Token To SOL ratio: "+selectedTokenToSol+")"}
        className="roundModal"
         visible={modalPresented}
          onCancel={()=>{

              setModalPresented(false);
            
          }}

          okText="Sign & Invest"

          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}>
         <InvestorForm setValuesOf={setValuesOf} 
         tokenToSol={selectedTokenToSol} />
        
    </Modal>


    <Modal title={ "Share " + selectedAddress?.toBase58() ?? ""}
        className="shareViewModal"
         visible={shareModalPresented}
          onCancel={()=>{

              setShareModalPresented(false);
            
          }}

          okText="OK"

          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>
          <ShareView address={"fundpool/"+ selectedAddress?.toBase58() ?? ""} quote="Solafund Fund Pool"
            hashtag="#solafund #solana #blockchain #mutual fund"
          />
    </Modal>

    </div>;
}