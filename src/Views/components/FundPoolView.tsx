import React, {useState, useEffect} from 'react';
import useFundPool from '../../Hooks/useFundPool';
import {FundPool} from '../../state';
import { error } from '../../utils/Mesg';
import * as web3 from '@solana/web3.js';
import {FundPoolCardView} from './FundPoolCardView';
import './css/FundPoolView.css';

interface FundPoolViewProps {

    address : string
}

export const FundPoolView : React.FC <FundPoolViewProps> = ({address}) => {

    const [,,read] = useFundPool();

    const [fundPool, setFundPool] = useState<FundPool>();

    const setAddressPresented = ( address : web3.PublicKey) => {

    }

    const setShareView = ( presented : boolean) => {

    }

    
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
        className="fundPool"
        setAddressPresented={setAddressPresented}
        setShareView={setShareView}
        />
    <div className="investorDiv">
    <div className="investorTitle">Investors</div>
    {
        fundPool?.investors.map(( inv, idx ) =>{

            return <div className="investorRow">
            <span>{idx+1}.</span> 
            <span>{inv.investor.toBase58()}</span>  
            <span>{inv.token_count}</span>  
            </div>

        })
    }
    </div>
    </div>;

}