import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool, extract_fund_pool } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView } from './FundPoolCardView';
import { Button, Modal, Spin } from 'antd';
import {FileAddOutlined, ShareAltOutlined, ReloadOutlined} from '@ant-design/icons';
import { FundPoolForm } from './FundPoolForm';
import useFundPool from '../../Hooks/useFundPool';
import { success,error } from '../../utils/Mesg';
import {ShareView} from './ShareView';

interface ManagerPoolViewProp {

    address : string | null, 
}

export const ManagerPoolView : React.FC <ManagerPoolViewProp> = ({address}) => {

    const [,,read, managerPoolKey] = useUserPool();

    const [connection] = useSolana();

    var tmpFundPools : Array<FundPool> = [];

    const [fundPools, setFundPools] = useState<Array<FundPool>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const setAddressPresented = ( address : web3.PublicKey) => {

    }

    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const [createFundPool] = useFundPool();

    const [tokenCount, setTokenCount] = useState(0);
    
    const [tokenToSol, setTokenToSol] = useState(0);

    const [commissionInSol, setCommissionInSol] = useState(0);
    
    const [, setFinalized] = useState(true);
 
    const [loaded, setLoaded] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [modalPresented, setModalPresented] = useState(false);

    const [poolPageAddress , setPoolPageAddress] = useState("");


    const setValuesOf = (token_count : number, token_to_sol : 
        number, is_finalized : boolean, icon : number, commission_in_sol : number  ) => {

        setTokenCount(token_count);
        setTokenToSol(token_to_sol);
        setSelectedIcon(icon);
        setFinalized(is_finalized); 
        setCommissionInSol(commission_in_sol);
    }

    /**
    const setShareView = ( presented : boolean) => {

        setShareModalPresented(true);
    } */

    const setIndvShareView = ( presented : boolean) => {

    }

    const [shareModalPresented, setShareModalPresented] = useState(false);


    const completion = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 3);
            setTimeout(()=>{

                readManagerPool();

            },500);

        }
    }
  


    async function readData(pubkey : web3.PublicKey){

        
        let fpAcc = await connection.getAccountInfo(pubkey);

        if (fpAcc != null){

            extract_fund_pool(fpAcc.data, fpAcc.lamports, (res : FundPool | Error) =>  {

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

    async function readManagerPool(){

        setFundPoolLoading(true);

        let addr =  address ? address : (await managerPoolKey(null)).toBase58();
        setPoolPageAddress(addr);

        read(addr ,
        
        (res : UserPool | Error) =>  {

            if (!(res instanceof Error)){
                
                for ( var r=0; r < res.addresses.length; r++){

                    readData(res.addresses[r]);
                }

                setFundPools(tmpFundPools);

                tmpFundPools.splice(0,tmpFundPools.length);
               

                setTimeout(()=>{
                    forceUpdate();
                    setFundPoolLoading(false);
                    setLoaded(true);
                }, 120);

            }
            else {

                forceUpdate();
                setLoaded(true);
            }
        
        }) 

    }


    useEffect(() => {

        if ( !loaded ){

            readManagerPool();
        }
        

    }, []);

    const fundPoolsView = 
    
    (fundPools?.map.length ?? 0) > 0 ? 

    fundPools?.map(  (fundPool, index) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        valueInSol = {fundPool.token_count * fundPool.token_to_sol_ratio}
        feeInLamports = {fundPool.fee_in_lamports}
        className="fundPoolNorm" key={"fundPool"+index}
        setAddressPresented={setAddressPresented}
        setShareView={setIndvShareView}
        />

    })
    
    :

    <div style={{color:"white", marginTop:"20px", display: loaded ? "block" : "none" }}>{

        address ?

        "No pool available, the fund manager has not created any pool in this address"
        :

        "You have NOT created any fund pool yet, please click on \"Create Fund Pool\" "+ 
        "to start creating and invite your investors"
        
        }
        
        </div>
    ;


    const topTitle = 

    address ?

    <div style={{color:'white'}}>
     <div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
       
     <div style={{display:"inline"}}>Pools By {address}</div>
    
     <Button shape="circle" className="shareButton" onClick={async ()=> {
              
            await readManagerPool();
        }}>
        <ReloadOutlined />
     </Button>
   

    <Button shape="circle" className="shareButton" onClick={async ()=> {
              
              setShareModalPresented(true);
          }}>
        <ShareAltOutlined />
    </Button>
   
   
   
    </div>

    :

    <div>

    <div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
    
    <span className="title">Fund Pools Managed By You</span>
    <Button className="addNewButton"  onClick={async ()=> {
            setModalPresented(true);
        }}>
        <FileAddOutlined/> Create Fund Pool
    </Button>
    
    <Button shape="circle" className="reloadButton" onClick={async ()=> {
            
            await readManagerPool();
        }}>
        <ReloadOutlined />
    </Button>
    

    <Button shape="circle" className="shareButton" onClick={async ()=> {
            setShareModalPresented(true);
        }}>
        <ShareAltOutlined />
    </Button>
   
    </div>



    return <div className="homeFundPoolDiv">
    <p>{topTitle}</p>

    {fundPoolsView}

    <Modal title={<label style={{ color: "white" }}>Create Fund Pool</label>}

          className="roundModal"
          style={{minWidth:"80%"}}
          visible={modalPresented}
          onOk={async ()=>{

                if ( tokenCount <= 0){

                    error("Invalid Token count!");
                    return; 
                }

                if (tokenToSol > 1){

                    error("Invalid token to SOL ratio, must be less than 1");
                    return; 
                }


                if (commissionInSol > 1){

                    error("Invalid commission value, must be less than 1");
                    return; 
                }

                setModalPresented(false);
                
                let ratioLp = tokenToSol * web3.LAMPORTS_PER_SOL;

                let commInLp = commissionInSol * web3.LAMPORTS_PER_SOL;


                //console.log("commInLP", commInLp);

                createFundPool(commInLp,tokenCount,ratioLp, true,
                selectedIcon, completion);
                
          }}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Sign &amp; Create"
          cancelButtonProps={{ disabled: false}}>
       
          <FundPoolForm setValuesOf={setValuesOf}/>

    </Modal>

    <Modal 
    title={<label style={{ color: "white" }}>Share All Pools Of {poolPageAddress}</label>}
        className="shareViewModal"
         visible={shareModalPresented}
          onCancel={()=>{

              setShareModalPresented(false);
            
          }}

          okText="OK"

          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>
          <ShareView address={"poolby/"+ poolPageAddress} quote="Solafund Fund Pool"
            hashtag="#solafund #solana #blockchain #mutual fund"
          />
    </Modal>
    </div>
}