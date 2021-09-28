import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useFundPool from '../../Hooks/useFundPool';
import { Button, Spin, Modal,Popconfirm } from 'antd';
import { success,error } from '../../utils/Mesg';
import { Wallet } from "../Wallet";
import '../css/common.css';
import { FundPoolForm } from '../components/FundPoolForm';

export const FundPoolTestView : React.FC = () => {


    const [createFundPoolAccount, createFundPool, loading, read, deleteFundPool] = useFundPool();

    const [modalPresented, setModalPresented] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
    
    const [finalized, setFinalized] = useState(false);
 

    const setValuesOf = (token_count : number, amount : 
        number, is_finalized : boolean, icon : number ) => {

        setTokenCount(token_count);
        setAmount(amount);
        setSelectedIcon(icon);
        setFinalized(is_finalized); 
    }
  
    const onConfirm = ()=> {

        deleteFundPool(completion);
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
              
              createFundPoolAccount(completion);

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
          onOk={()=>{

                setModalPresented(false);
                createFundPool(amount,tokenCount,finalized,selectedIcon, completion);
          }}

          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}>
       
          <FundPoolForm setValuesOf={setValuesOf}/>


       </Modal>

    </div>;

}