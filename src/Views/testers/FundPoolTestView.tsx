import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useFundPool from '../../Hooks/useFundPool';
import useManagerPool from '../../Hooks/useManagerPool';
import { Button, Spin, Modal,Popconfirm } from 'antd';
import { success,error } from '../../utils/Mesg';
import { Wallet } from "../components/Wallet";
import '../css/common.css';
import { FundPoolForm } from '../components/FundPoolForm';
import { ManagerPool } from '../../models';

export const FundPoolTestView : React.FC = () => {


    const [createFundPoolAccount, createFundPool, loading, read, deleteFundPool] = useFundPool();

    const [createManagerPoolAccount,,readMgp,managerPoolIdPubKey] = useManagerPool(); 

    const [modalPresented, setModalPresented] = useState(false);

    const [mgpPresented, setMgpPresented] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
    
    const [finalized, setFinalized] = useState(false);
 
    const [pool, setPool] = useState<ManagerPool>();


    const setValuesOf = (token_count : number, amount : 
        number, is_finalized : boolean, icon : number ) => {

        setTokenCount(token_count);
        setAmount(amount);
        setSelectedIcon(icon);
        setFinalized(is_finalized); 
    }
  
    const onConfirm = async ()=> {

        let mp_acc = await managerPoolIdPubKey();
        deleteFundPool(mp_acc, completion);
    }


    const completion = (res : boolean | Error) =>  {

        if (res instanceof Error){

            error((res as Error).message, 5 );

        }
        else {

            success("Success!", 5);

        }
    }

    return <div>
        <Wallet/>
          <br/>
          <br/>
          <div style={{display: loading ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>

          <p><Button className="commonButton" onClick={async ()=> {
              
              createManagerPoolAccount(completion);

          }} >Create Manager Pool Account</Button></p>

        <p><Button className="commonButton" type="primary" onClick={async ()=>{
              
             let pk = await managerPoolIdPubKey();
              readMgp(pk.toBase58(), (res : ManagerPool | Error) =>  {

                    if (res instanceof Error){
            
                        error((res as Error).message, 5 );
                        setMgpPresented(false);
                    }
                    else {
            
                        setPool(res);
                        setMgpPresented(true);
                    }
            
                }
            );

          }} >Read Manager Pool's Data</Button></p>
       
          <p><Button className="commonButton" onClick={async ()=> {
              
              createFundPoolAccount(null, completion);

          }} >Create Fund Pool Account</Button></p>
       
        <p><Button className="commonButton" onClick={async ()=> {
              
              read(null);

          }} >Read Account</Button></p>
       
         <p><Button className="commonButton" danger onClick={async ()=> {
              
              setModalPresented(true);

          }} >Create Fund Pool</Button></p>
       

         <p>
         <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={onConfirm}   
            okText="Yes"
            cancelText="No">
             <Button className="commonButton" danger>Delete Fund Pool</Button>
        </Popconfirm>     
        </p>
       

       <Modal title="Create Fund Pool"
          style={{minWidth:"80%"}}
          visible={modalPresented}
          onOk={async ()=>{
                setModalPresented(false);
                let mp_acc = await managerPoolIdPubKey();
                createFundPool(amount,tokenCount,finalized,
                selectedIcon, mp_acc,true, completion);
          }}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: false }}
          okText = "Create"
          cancelButtonProps={{ disabled: false }}>
       
          <FundPoolForm setValuesOf={setValuesOf}/>

       </Modal>

       <Modal title={"Registered Addresses : " + pool?.addresses.length }
          style={{minWidth:"80%"}}
          visible={mgpPresented}
          onCancel={()=>{

            setMgpPresented(false);

          }}

          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: false }}>
          {

            pool?.addresses.map (( address , index) => {

                return <div style={{textAlign: "justify", margin:"10px"}}>
                {index + 1}. {address.toBase58()}
                </div>;

            })
        }

        </Modal>
      

    </div>;

}