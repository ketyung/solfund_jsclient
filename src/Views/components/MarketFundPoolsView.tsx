import React, {useEffect, useState} from 'react';
import useMarket from '../../Hooks/useMarket';
import useInvestor from '../../Hooks/useInvestor';
import { FundPool, Market } from '../../state';
import { error, success } from '../../utils/Mesg';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView2 } from './FundPoolCardView2';
import {Modal,Spin, Image} from 'antd';
import {InvestorForm} from './InvestorForm';
import { ShareView } from './ShareView';
import {ICONS} from './IconsChooser';
import './css/modal.css';

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


    const setFundPoolPresented = ( fundPool : FundPool) => {

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

                 await addInvestor(selectedFundPool.address, 
                     selectedFundPool.manager ?? web3.PublicKey.default, 
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
        
                    let addrs = res.fund_pools.reverse();

                    setFundPoolAddresses(addrs);
                    setLoaded(true);
                    setFundPoolLoading(false);
  
                }
        
            }
        );
    }


    
    useEffect(() => {
        
        readMarket();
              
    }, [address,reload])
  

    return <div style={{display:"block",textAlign:"center",margin:"0px auto",padding:"auto"}}>
    <div style={{display: fundPoolLoading ? "block" : "none", clear:"both",margin : "10px"}}>
    <Spin size="default"/></div>
   
    {
        fundPoolsView
    }
   
    <Modal 
    title={
    <div>
      <Image width={30} title="Icon" alt="Icon" style={{ verticalAlign: 'middle', 
      marginTop:"5px", marginRight:"20px"}}
        height={30} preview={false}
        src={(selectedFundPool?.icon ?? 0) >= 0 ? ICONS[selectedFundPool?.icon ?? 0] : "none"}
        fallback="data:image/png;base64,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"/>
      
    <label style={{ color: "white" , marginLeft:"10px"}}>{ (selectedFundPool?.address?.toBase58() ?? "") }</label>
    </div>
    }
        className="roundModal"
         visible={modalPresented}
          onCancel={()=>{

              setModalPresented(false);
            
          }}

          onOk={()=>{

             submitInvestor();

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


    <Modal 
    title={<label style={{ color: "white" }}>{ "Share " + selectedAddress?.toBase58() ?? ""}</label>}
        className="shareViewModal"
         visible={shareModalPresented}
          onCancel={()=>{

              setShareModalPresented(false);
            
          }}

          okText="OK"

          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>
          <ShareView address={"fundpool/"+ selectedFundPool?.address?.toBase58() ?? ""} 
          quote="Solafund Fund Pool" hashtag="#solafund #solana #blockchain #mutual fund"
          />
    </Modal>

    </div>;
}