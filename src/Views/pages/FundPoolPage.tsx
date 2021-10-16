import React, {useState, useEffect} from 'react';
import useFundPool from '../../Hooks/useFundPool';
import {FundPool} from '../../state';
import * as web3 from '@solana/web3.js';
import {FundPoolCardView} from '../components/FundPoolCardView';
import './css/FundPoolPage.css';
import {Menu, Dropdown, Button} from 'antd';
import { error, success } from '../../utils/Mesg';
import {InvestmentModalForm, ShareModalForm} from '../components/CommonModalForms';
import useInvestor from '../../Hooks/useInvestor';


interface FundPoolViewProps {

    address : string
}

export const FundPoolPage : React.FC <FundPoolViewProps> = ({address}) => {

    const [,,read] = useFundPool();

    const [fundPool, setFundPool] = useState<FundPool>();

    const [tokenCount ,setTokenCount] = useState(0);
    
    const [amount,setAmount] = useState(0);

    const [errorMessage,setErrorMessage] = useState<string|null>();
   
    const [addInvestor,,investorLoading] = useInvestor();

    const setValuesOf = (token_count : number, amount : 
      number, errorMessage : string | null  ) => {

      setTokenCount(token_count);
      setAmount(amount);
      setErrorMessage(errorMessage);
    }

    const [modalPresented, setModalPresented] = useState(false);

    const [shareModalPresented, setShareModalPresented] = useState(false);

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
           
           if (fundPool?.address) {

               await addInvestor(fundPool, 
                   amount, tokenCount, completion);
           }
           else {

               error("No selected address!");
           }
      }
    }

    const completion = (res : boolean | Error) =>  {

      if (res instanceof Error){

          error((res as Error).message, 5 );

      }
      else {

          success("Success!", 3);
          setModalPresented(false);
          readAddr();

      }
  }


    const setAddressPresented = ( address : web3.PublicKey) => {

        setModalPresented(true);

    }


    const cluster = "devnet"; // temporary hard coded here first

    const menu = (
        <Menu theme="dark" style={{borderRadius:"10px",minWidth:"160px", textAlign:"center"}}>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" 
            href={"https://explorer.solana.com/address/"+address+"?cluster="+cluster}>
              View On Explorer
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href={
                "https://solscan.io/account/"+address+"?cluster="+cluster
            }>
              View On Solscan 
            </a>
          </Menu.Item>
        </Menu>
      );
    

    async function readAddr(){

       
       await read (address, 
          
          (res : FundPool | Error) =>  {

              if (res instanceof Error){
      
                  error(res.message);
              }
              else {
      
                  setFundPool(res);
                  console.log("red.adrr");

              }

       
          }
      );
 
    }

    useEffect(() => {
    
        readAddr();

    }, [address])
  
    return <div style={{margin:"auto", textAlign:"center"}}>
    
    <FundPoolCardView address={fundPool?.address.toBase58() ?? ""}
        manager={fundPool?.manager.toBase58() ?? ""} lamports={fundPool?.lamports ?? 0}
        tokenCount={fundPool?.token_count ?? 0} 
        valueInSol ={(fundPool?.token_to_sol_ratio ?? 0) * (fundPool?.token_count ?? 0)  }
        icon={fundPool?.icon ?? 0} 
        className="fundPool" feeInLamports={fundPool?.fee_in_lamports ?? 0}
        setAddressPresented={setAddressPresented}
        setShareView={setShareModalPresented}
        />
    <div className="investorDiv">
    <div className="topBar">
    <div className="barItem">Investors ({fundPool?.investors.length ?? 0})</div>
    <div className="barItem">

    <Dropdown overlay={menu} placement="bottomCenter">
      <Button style={{color:"white", background:"transparent", 
      border:"0px", marginTop:"0px", fontWeight:"bolder", 
      paddingTop:"0px", paddingBottom:"10px"}}>Transactions</Button>
    </Dropdown>

    </div>
    </div>
    {

        fundPool?.investors.map(( inv, idx ) =>{

            return <div className="investorRow" key={"invRow" + idx} 
            title={inv.address.toBase58()}>
            <span className="no">{idx+1}</span> 
            <span className="key">{inv.investor.toBase58()}</span>  
            <span className="tokenCount">{inv.token_count} Tokens</span>
            <span className="percentage">{((inv.token_count/fundPool.token_count) * 100).toFixed(2)} %</span>
              
            </div>

        })
    }
    </div>
    <InvestmentModalForm modalPresented={modalPresented} setModalPresented={setModalPresented}
    submitInvestor={submitInvestor} selectedFundPool={fundPool} investorLoading={investorLoading}
    setValuesOf={setValuesOf}
    />

    <ShareModalForm address={fundPool?.address?.toBase58() ?? ""} modalPresented={shareModalPresented}
    setModalPresented={setShareModalPresented} />


    </div>;

}