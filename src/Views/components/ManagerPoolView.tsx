import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView2 } from './FundPoolCardView2';
import { Button, Modal, Spin } from 'antd';
import {FileAddOutlined, ShareAltOutlined, ReloadOutlined} from '@ant-design/icons';
import { FundPoolForm } from './FundPoolForm';
import useFundPool from '../../Hooks/useFundPool';
import { success,error } from '../../utils/Mesg';
import {ShareView} from './ShareView';
import {PoolManageView} from './PoolManageView';


interface ManagerPoolViewProp {

    address : string | null, 
}

export const ManagerPoolView : React.FC <ManagerPoolViewProp> = ({address}) => {

    const [,,read, managerPoolKey] = useUserPool();

    const [,wallet] = useSolana();

    const [fundPoolAddresses, setFundPoolAddresses] = useState<Array<web3.PublicKey>>([]);

    
    const setFundPoolPresented = ( fundPool : FundPool, managedByManager : boolean ) => {

        //setModalPresented(true);

        if ((wallet?.toBase58() ?? "") === fundPool.manager.toBase58() ){

            setManageViewPresented(true);
        }

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
    
    const [manageViewPresented, setManageViewPresented] = useState(false);
    

    const [poolPageAddress , setPoolPageAddress] = useState("");


    const setValuesOf = (token_count : number, token_to_sol : 
        number, is_finalized : boolean, icon : number, commission_in_sol : number  ) => {

        setTokenCount(token_count);
        setTokenToSol(token_to_sol);
        setSelectedIcon(icon);
        setFinalized(is_finalized); 
        setCommissionInSol(commission_in_sol);
    }

    const setShareView = ( presented : boolean) => {

        
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
      
    async function readManagerPool(){

        setFundPoolLoading(true);

        let addr =  address ? address : (await managerPoolKey(null)).toBase58();
        setPoolPageAddress(addr);

        read(addr ,
        
        (res : UserPool | Error) =>  {

            if (!(res instanceof Error)){
                
                let addrs = res.addresses.reverse();

                setFundPoolAddresses(addrs);
                
                setFundPoolLoading(false);
                setLoaded(true);
                
            }
            else {

                setFundPoolLoading(false);
                setLoaded(true);
            }
        
        }) 

    }


    useEffect(() => {

        if ( !loaded ){

            readManagerPool();
        }
        

    }, [loaded]);

    const fundPoolsView = 
    
    (fundPoolAddresses.map.length ?? 0) > 0 ? 

    fundPoolAddresses.map(  (address, index) => {

        return <FundPoolCardView2 address={address}  
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        key ={"fundPool" + index } managedByManager={true}
        setFundPoolPresented={setFundPoolPresented} setShareView={setShareView}/>

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
          <ShareView address={"poolby/"+ poolPageAddress} quote="Solfund Fund Pool"
            hashtag="#Solfund #solana #blockchain #mutual fund"
          />
    </Modal>


    <Modal 
    title={<label style={{ color: "white" }}>Manage This Pool {poolPageAddress}</label>}
        className="shareViewModal"
         visible={manageViewPresented}
          onCancel={()=>{

              setManageViewPresented(false);
            
          }}

          okText="OK"

          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>
         <PoolManageView/>
    </Modal>
  
    </div>
}