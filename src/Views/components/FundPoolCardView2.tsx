import React, {useState, useEffect} from 'react';
import * as web3 from '@solana/web3.js';
import {Image} from 'antd';
import {ICONS} from './IconsChooser';
import './css/FundPoolCardView.css';
import './css/SolToUsdView.css';
import {format_pub_key_shorter} from '../../state/';
import {Button} from 'antd';
import {UserAddOutlined, ShareAltOutlined, InfoOutlined, SettingOutlined} from '@ant-design/icons';
import {Link} from 'wouter';
import {extract_fund_pool, FundPool} from '../../state';
import useSolana from '../../Hooks/useSolana';

interface FundPoolCardView2Props {

    address : web3.PublicKey,

    className : string,

    managedByManager : boolean, 

    solToUsd : number,

    setFundPoolPresented : ( fundPool : FundPool, managedByManager : boolean) => void ,

    setShareView: (presented : boolean, address : web3.PublicKey) => void ,

    
}

export const FundPoolCardView2 : React.FC <FundPoolCardView2Props> = ({address, 
    className, managedByManager, solToUsd, 
    setFundPoolPresented, setShareView}) => {

    const [fundPool, setFundPool] = useState<FundPool>();

    const [connection] = useSolana();

    const fundValue = (fundPool?.lamports ?? 0)/web3.LAMPORTS_PER_SOL;

    async function readData(pubkey : web3.PublicKey){

        let fpAcc = await connection.getAccountInfo(pubkey);

        if (fpAcc != null){

            extract_fund_pool(fpAcc.data, 
                (res : FundPool | Error) =>  {

                if (!(res instanceof Error)){
        
                    if ( res.address.toBase58() === address.toBase58()){

                       let pda = connection.getAccountInfo(res.pool_pda);
                          
                       pda.then( value => {

                           res.lamports = value?.lamports ?? 0;
                           setFundPool(res);
    
                       }).catch(_ => {


                           setFundPool(res);
                       });

                    }
                   
                }
            });

        }

    }

    useEffect(() => {
        
        readData(address);
              
    }, [address]);
  

    //tokenCount, lamports,feeInLamports, valueInSol, icon

    return <div className={className}>
    
        <div>
        <Button shape="circle" style={{float:"right"}} onClick={()=>{

            if ( fundPool ){

                setFundPoolPresented(fundPool, managedByManager);

            }
        
        }} title={managedByManager ? "Manage This Pool" :  "Invest In This Fund"} >
        {managedByManager ? <SettingOutlined /> :  <UserAddOutlined />}

        </Button>
        <span>
        <Image width={50} title="Icon" alt="Icon" style={{ verticalAlign: 'middle' }}
        height={50} preview={false}
        src={(fundPool?.icon ?? 0) >= 0 ? ICONS[fundPool?.icon ?? 0] : "none"}
        fallback="data:image/png;base64,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"/>
        </span>
        <span title={address.toBase58()}
        style={{fontWeight: "bolder",margin:"10px 10px 50px 10px",height:"40px",padding:"5px 5px 30px 5px"}}>
        {className === "fundPool" ? address : format_pub_key_shorter(address.toBase58())}
        </span>
        </div>
        <div title={fundPool?.manager.toBase58()} className="item">Manager : { className === "fundPool" ? fundPool?.manager.toBase58() : 
        format_pub_key_shorter(fundPool?.manager.toBase58() ?? "...")}</div>
       
        <div className="item">Token : {fundPool?.token_count?? 0}</div>

        <div className="item">Fund : {fundValue.toFixed(3)} SOL
        {solToUsd > 0 ? <div className="solToUsdSmall">${(fundValue * solToUsd).toFixed(2)}</div> : <></>}
        </div>

        <div className="item">Commission: {((fundPool?.fee_in_lamports ?? 0)/web3.LAMPORTS_PER_SOL).toFixed(3)} SOL</div>
 

        <Button shape="circle" style={{float:"right", marginLeft:"20px"}}
        onClick={()=>{

            setShareView(true, new web3.PublicKey(address));
        }} 
        >
        <ShareAltOutlined />
        </Button>
       
        <Link href={"/fundpool/"+address}>
             
        <Button shape="circle" style={{float:"right"}}>
        <InfoOutlined />
        </Button>
        </Link>
      
    </div>;

}