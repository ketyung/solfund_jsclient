import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView2 } from './FundPoolCardView2';
import { Button, Modal, Spin, Image } from 'antd';
import {FileAddOutlined, ShareAltOutlined, ReloadOutlined} from '@ant-design/icons';
import { FundPoolForm } from './FundPoolForm';
import useFundPool from '../../Hooks/useFundPool';
import { success,error } from '../../utils/Mesg';
import {ShareView} from './ShareView';
import {PoolManageView} from './PoolManageView';
import {ICONS} from './IconsChooser';
import {PaginationView} from './CommonPagination';
import usePythSolToUsdAuto from '../../Hooks/usePythSolToUsdAuto';

interface ManagerPoolViewProp {

    address : string | null, 
}

export const ManagerPoolView : React.FC <ManagerPoolViewProp> = ({address}) => {

    const [,,read, managerPoolKey] = useUserPool();

    const [,wallet] = useSolana();

    const [fundPoolAddresses, setFundPoolAddresses] = useState<Array<web3.PublicKey>>([]);

    
    const setFundPoolPresented = ( fundPool : FundPool, managedByManager : boolean ) => {

        //setModalPresented(true);

        setSelectedFundPool(fundPool);

        if ((wallet?.toBase58() ?? "") === fundPool.manager.toBase58() ){

            setManageViewPresented(true);
        }

    }

    const [selectedFundPool, setSelectedFundPool] = useState<FundPool>();

    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const [createFundPool,fundPoolCreating] = useFundPool();

    const [tokenCount, setTokenCount] = useState(0);
    
    const [tokenToSol, setTokenToSol] = useState(0);

    const [commissionInSol, setCommissionInSol] = useState(0);
    
    const [, setFinalized] = useState(true);
 
    const [loaded, setLoaded] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [modalPresented, setModalPresented] = useState(false);
    
    const [manageViewPresented, setManageViewPresented] = useState(false);
    
    const [poolPageAddress , setPoolPageAddress] = useState("");

    const [solToUsd] = usePythSolToUsdAuto();

    const [currentPage, setCurrentPage] = useState(1);

    const numberPerPage = 6; 

    const pageOnChange = (page : number) =>{

        setCurrentPage(page);
    }


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

    fundPoolAddresses.slice( (currentPage - 1) * numberPerPage, 
    ((currentPage - 1) * numberPerPage) + numberPerPage ).map(  (poolAddr, index) => {

        return <FundPoolCardView2 address={poolAddr} solToUsd={solToUsd} 
        className={index % 3 === 0 ? "fundPoolBrk" : "fundPoolNorm"}
        key ={"fundPool" + index } managedByManager={ address ? false : true}
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

    <div style={{display: (fundPoolLoading || fundPoolCreating) ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
    
    <div className="title">Fund Pools Managed By You</div>
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

    <p>&nbsp;</p>

    {

        fundPoolAddresses.length > numberPerPage ?

        <PaginationView currentPage={currentPage} numberPerPage={numberPerPage} 
        pageOnChange={pageOnChange} total={fundPoolAddresses.length} />

        : <></>
    } 
   


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
    title={
     <div>
        <Image width={30} title="Icon" alt="Icon" style={{ verticalAlign: 'middle', 
        marginTop:"5px", marginRight:"20px"}}
          height={30} preview={false}
          src={(selectedFundPool?.icon ?? 0) >= 0 ? ICONS[selectedFundPool?.icon ?? 0] : "none"}
          fallback="data:image/png;base64,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"/>
        
      <label style={{ color: "white" , marginLeft:"10px"}}>Manage This Pool { (selectedFundPool?.address?.toBase58() ?? "") }</label>
      </div>
     }
        className="manageViewModal"
        visible={manageViewPresented}
          onCancel={()=>{

              setManageViewPresented(false);
            
          }}

          okText="OK"

          okButtonProps={{ disabled: true  }}
          cancelButtonProps={{ disabled: false }}>
         <PoolManageView fundPool={selectedFundPool}/>
    </Modal>
  
    </div>
}