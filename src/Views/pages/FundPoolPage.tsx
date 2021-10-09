import React, {useState, useEffect} from 'react';
import useFundPool from '../../Hooks/useFundPool';
import {FundPool} from '../../state';
import { error } from '../../utils/Mesg';
import * as web3 from '@solana/web3.js';
import {FundPoolCardView} from '../components/FundPoolCardView';
import './css/FundPoolPage.css';
import {Menu, Dropdown, Button} from 'antd';


interface FundPoolViewProps {

    address : string
}

export const FundPoolPage : React.FC <FundPoolViewProps> = ({address}) => {

    const [,,read] = useFundPool();

    const [fundPool, setFundPool] = useState<FundPool>();

    const setAddressPresented = ( address : web3.PublicKey) => {

    }

    const setShareView = ( presented : boolean) => {

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
    
    useEffect(() => {
    
        read (address, 
        
            (res : FundPool | Error) =>  {

                if (res instanceof Error){
        
                    error(res.message);
                }
                else {
        
                    setFundPool(res);
                }
        
            }
        );
        //readAddr();

    }, [address])
  
    return <div style={{margin:"auto", textAlign:"center"}}>
    
    <FundPoolCardView address={fundPool?.address.toBase58() ?? ""}
        manager={fundPool?.manager.toBase58() ?? ""} lamports={fundPool?.lamports ?? 0}
        tokenCount={fundPool?.token_count ?? 0} 
        valueInSol ={(fundPool?.token_to_sol_ratio ?? 0) * (fundPool?.token_count ?? 0)  }
        icon={fundPool?.icon ?? 0} 
        className="fundPool" feeInLamports={fundPool?.fee_in_lamports ?? 0}
        setAddressPresented={setAddressPresented}
        setShareView={setShareView}
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
            </div>

        })
    }
    </div>
    </div>;

}