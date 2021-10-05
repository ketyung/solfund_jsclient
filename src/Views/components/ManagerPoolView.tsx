import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import useSolana from '../../Hooks/useSolana';
import { UserPool, FundPool, extract_fund_pool } from '../../state';
import * as web3 from '@solana/web3.js';
import { FundPoolCardView } from './FundPoolCardView';
import { Button, Modal, Spin } from 'antd';
import {FileAddOutlined} from '@ant-design/icons';
import { FundPoolForm } from './FundPoolForm';
import useFundPool from '../../Hooks/useFundPool';
import { success,error } from '../../utils/Mesg';

export const ManagerPoolView : React.FC = () => {

    const [,userPoolLoading,read, managerPoolKey] = useUserPool();

    const [connection] = useSolana();

    var tmpFundPools : Array<FundPool> = [];

    const [fundPools, setFundPools] = useState<Array<FundPool>>();

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const setAddressPresented = ( address : web3.PublicKey) => {

    }

    const [fundPoolLoading, setFundPoolLoading] = useState(false);

    const [createFundPool,, , deleteFundPool] = useFundPool();

    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
    
    const [finalized, setFinalized] = useState(false);
 
    const [pool, setPool] = useState<UserPool>();

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [modalPresented, setModalPresented] = useState(false);

    const setValuesOf = (token_count : number, amount : 
        number, is_finalized : boolean, icon : number ) => {

        setTokenCount(token_count);
        setAmount(amount);
        setSelectedIcon(icon);
        setFinalized(is_finalized); 
    }

    const completion = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 5);

        }
    }
  


    async function readData(pubkey : web3.PublicKey){

        
        let fpAcc = await connection.getAccountInfo(pubkey);

        if (fpAcc != null){

            extract_fund_pool(fpAcc.data, (res : FundPool | Error) =>  {

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


    useEffect(() => {

        async function readManagerPool(){

            setFundPoolLoading(true);

            read( (await managerPoolKey(null)).toBase58(),
            
            (res : UserPool | Error) =>  {
    
                if (!(res instanceof Error)){
        
                    
                    for ( var r=0; r < res.addresses.length; r++){

                        readData(res.addresses[r]);
                    }

                    setFundPools(tmpFundPools);

                    setTimeout(()=>{
                        forceUpdate();
                        setFundPoolLoading(false);
                   
                    }, 1000);

                }
            
            }) 

        }

        readManagerPool();

    }, []);

    const fundPoolsView = fundPools?.map(  (fundPool, index) => {

        return <FundPoolCardView address={fundPool.address.toBase58()}
        manager={fundPool.manager.toBase58()} lamports={fundPool.lamports}
        tokenCount={fundPool.token_count} icon={fundPool.icon} 
        className="fundPoolNorm"
        setAddressPresented={setAddressPresented}
        />

    });



    return <div className="homeFundPoolDiv">
    <p>

    <div style={{display: fundPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
   
    <span className="title">Your Fund Pools</span>
    <Button className="addNewButton"  onClick={async ()=> {
              
              setModalPresented(true);
          }}>
        <FileAddOutlined/> Create Fund Pool
    </Button>

    </p>

    {fundPoolsView}

    <Modal title="Create Fund Pool"   
         className="roundModal"
          style={{minWidth:"80%"}}
          visible={modalPresented}
          onOk={async ()=>{
                setModalPresented(false);
                
                let amountLp = amount * web3.LAMPORTS_PER_SOL;
                createFundPool(amountLp,tokenCount,finalized,
                selectedIcon, completion);
          }}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Create"
          cancelButtonProps={{ disabled: false }}>
       
          <FundPoolForm setValuesOf={setValuesOf}/>

       </Modal>
    </div>
}