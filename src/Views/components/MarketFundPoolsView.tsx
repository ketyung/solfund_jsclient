import React, {useEffect, useState} from 'react';
import useMarket from '../../Hooks/useMarket';
import useInvestor from '../../Hooks/useInvestor';
import { FundPool, Market } from '../../state';
import { error, success } from '../../utils/Mesg';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView2 } from './FundPoolCardView2';
import {Modal,Spin} from 'antd';
import {InvestorForm} from './InvestorForm';
import { ShareView } from './ShareView';
import './css/modal.css';

interface MarketFundPoolsProps {

    address : string,

    reload : boolean
}

export const MarketFundPoolsView : React.FC <MarketFundPoolsProps> = ({address, reload}) => {
    
   
    const [,read] = useMarket();

    const [fundPoolAddresses, setFundPoolAddresses] = useState<Array<web3.PublicKey>>();

    const [modalPresented, setModalPresented] = useState(false);

    const [shareModalPresented, setShareModalPresented] = useState(false);

    const [selectedFundPool, setSelectedFundPool] = useState<FundPool>();

    const [tokenCount ,setTokenCount] = useState(0);
    
    const [amount,setAmount] = useState(0);

    const [errorMessage,setErrorMessage] = useState<string|null>();
    
    const [loaded, setLoaded] = useState(false);

    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const [addInvestor,,investorLoading] = useInvestor();

    const completion = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 3);
            setModalPresented(false);
        }
    }
  


    const setValuesOf = (token_count : number, amount : 
        number, errorMessage : string | null  ) => {

        setTokenCount(token_count);
        setAmount(amount);
        setErrorMessage(errorMessage);
    }

    const setShareView = ( presented : boolean, address : web3.PublicKey) => {

      //  setSelectedAddress( address );
        setShareModalPresented(presented);
    }


    const setFundPoolPresented = ( fundPool : FundPool) => {

        setSelectedFundPool(fundPool);

        setModalPresented(true);
    }


    

    const fundPoolsView = 
    
    (fundPoolAddresses?.map.length ?? 0) > 0 ? 

    fundPoolAddresses?.map(  (address, index) => {

        return <FundPoolCardView2 address={address}  
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        key ={"fundPool2_" + index }
        setFundPoolPresented={setFundPoolPresented} setShareView={setShareView}/>
    })

    :

    <div style={{color:"white",fontSize: "20pt", marginTop:"20px", padding:"10px", display : loaded ? "block" : "none"}}>
        Nothing here...
    </div>



    async function readMarket (){

        setFundPoolLoading(true);
        
        await read (address, 

             (res : Market | Error) =>  {

                if (res instanceof Error){
        
                    error(res.message);
                    setLoaded(true);
                }
                else {
        

                    setFundPoolAddresses(res.fund_pools);

                    setFundPoolLoading(false);
  
                }
        
            }
        );
    }


    
    useEffect(() => {
        
        readMarket();
              
    }, [address,reload])
  

    return <div style={{display:"block",textAlign:"center",margin:"0px auto",padding:"auto"}}>
    <div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
   
    {
        fundPoolsView
    }
   
    <Modal 
    title={<label style={{ color: "white" }}>{ (selectedFundPool?.address?.toBase58() ?? "") }</label>}
        className="roundModal"
         visible={modalPresented}
          onCancel={()=>{

              setModalPresented(false);
            
          }}

          onOk={async ()=>{

               if ( errorMessage != null){
                   error(errorMessage);
               }
               else {

                    if ( amount === 0 ){

                        error("Invalid amount");
                        return;
                    }

                    if ( tokenCount === 0 ){

                        error("Invalid token count");
                        return;
                    }
                    
                    if (selectedFundPool?.address) {

                        await addInvestor(selectedFundPool.address, 
                            selectedFundPool.manager ?? web3.PublicKey.default, 
                            amount, tokenCount, completion);
                    }
                    else {

                        error("No selected address!");
                    }
               }
          }}

          okText="Sign & Invest"

          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}>
         <InvestorForm setValuesOf={setValuesOf} 
         tokenToSol={selectedFundPool?.token_to_sol_ratio ?? 0} 
         remainingToken={selectedFundPool?.rm_token_count ?? 0}
         loading={investorLoading}
         />
        
    </Modal>


    <Modal title={ "Share " + selectedFundPool?.address?.toBase58() ?? ""}
        className="shareViewModal"
         visible={shareModalPresented}
          onCancel={()=>{

              setShareModalPresented(false);
            
          }}

          okText="OK"

          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>
          <ShareView address={"fundpool/"+ selectedFundPool?.address?.toBase58() ?? ""} quote="Solafund Fund Pool"
            hashtag="#solafund #solana #blockchain #mutual fund"
          />
    </Modal>

    </div>;
}