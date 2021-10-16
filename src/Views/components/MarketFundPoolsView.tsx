import React, {useEffect, useState} from 'react';
import useMarket from '../../Hooks/useMarket';
import useInvestor from '../../Hooks/useInvestor';
import { FundPool, Market } from '../../state';
import { error, success } from '../../utils/Mesg';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView2 } from './FundPoolCardView2';
import {Modal,Spin, Image} from 'antd';
import { ShareView } from './ShareView';
import './css/modal.css';
import {InvestmentModalForm, ShareModalForm} from '../components/CommonModalForms';

interface MarketFundPoolsProps {

    address : string,

    reload : boolean
}

export const MarketFundPoolsView : React.FC <MarketFundPoolsProps> = ({address, reload}) => {
    
   
    const [,read] = useMarket();

    const [fundPoolAddresses, setFundPoolAddresses] = useState<Array<web3.PublicKey>>([]);

    const [modalPresented, setModalPresented] = useState(false);

    const [shareModalPresented, setShareModalPresented] = useState(false);

    const [selectedFundPool, setSelectedFundPool] = useState<FundPool>();

    const [selectedAddress , setSelectedAddress] = useState<web3.PublicKey>();
    
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

        setSelectedAddress( address );
        setShareModalPresented(presented);
    }


    const setFundPoolPresented = ( fundPool : FundPool, managedByManager: boolean) => {

        setSelectedFundPool(fundPool);

        setModalPresented(true);
    }


    const submitInvestor = async () => {

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

                 await addInvestor(selectedFundPool, 
                     amount, tokenCount, completion);
             }
             else {

                 error("No selected address!");
             }
        }
    }


    

    const fundPoolsView = 
    
    fundPoolAddresses.map.length > 0 ? 

    fundPoolAddresses.map(  (address, index) => {

        return <FundPoolCardView2 address={address}  
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        key ={"fundPool2_" + index } managedByManager={false} 
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
        
                    let addrs = res.fund_pools.reverse();

                    setFundPoolAddresses(addrs);
                    setLoaded(true);
                    setFundPoolLoading(false);
  
                }
        
            }
        );
    }


    
    useEffect(() => {

        if ( reload ){

            setFundPoolAddresses([]);
        }
        
        readMarket();
              
    }, [address,reload])
  

    return <div style={{display:"block",textAlign:"center",margin:"0px auto",padding:"auto"}}>
    <div style={{display: fundPoolLoading ? "block" : "none", clear:"both",margin : "10px"}}>
    <Spin size="default"/></div>
   
    {
        fundPoolsView
    }
   
  
   <InvestmentModalForm modalPresented={modalPresented} setModalPresented={setModalPresented}
    submitInvestor={submitInvestor} selectedFundPool={selectedFundPool} investorLoading={investorLoading}
    setValuesOf={setValuesOf}
    />


    <ShareModalForm address={selectedAddress?.toBase58() ?? ""} modalPresented={shareModalPresented}
    setModalPresented={setShareModalPresented} />

    
    </div>;
}