import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useFundPool from '../../Hooks/useFundPool';
import useUserPool from '../../Hooks/useUserPool';
import { Button, Spin, Modal,Popconfirm} from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { success,error } from '../../utils/Mesg';
import '../css/common.css';
import { FundPoolForm } from '../components/FundPoolForm';
import { UserPool } from '../../state';
import * as web3 from '@solana/web3.js';
//import { Link } from 'wouter';


export const FundPoolTestView : React.FC = () => {


    const [createFundPool, loading, , deleteFundPool] = useFundPool();

    const [,,,UserPoolIdPubKey] = useUserPool(); 

    const [modalPresented, setModalPresented] = useState(false);

    const [mgpPresented, setMgpPresented] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [tokenCount, setTokenCount] = useState(0);
    
    const [amount, setAmount] = useState(0);
    
    const [finalized, setFinalized] = useState(false);
 
    const [pool, setPool] = useState<UserPool>();


    const setValuesOf = (token_count : number, amount : 
        number, is_finalized : boolean, icon : number ) => {

        setTokenCount(token_count);
        setAmount(amount);
        setSelectedIcon(icon);
        setFinalized(is_finalized); 
    }
  
    const onConfirm = async (selectedAddress : web3.PublicKey)=> {

        let mp_acc = await UserPoolIdPubKey(null);
              
        deleteFundPool(selectedAddress, mp_acc, completion);
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
          <div style={{display: loading ? "block" : "none", margin : "10px"}}><Spin size="large"/></div>
   
         <p><Button className="commonButton" danger onClick={async ()=> {
              
              setModalPresented(true);

          }} >Create Fund Pool</Button></p>
       
 

       <Modal title="Create Fund Pool"
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

                return <div style={{textAlign: "justify", margin:"10px 10px 20px"}}>

                {index + 1}. {address.toBase58()}

                <span style={{float:"right",marginLeft:"20px"}}>

                <Popconfirm
                    title="Are you sure to delete this?"
                    onConfirm={()=>{

                        onConfirm(address);
                    }}   
                    okText="Yes"
                    cancelText="No">
                    <Button shape="circle">
                    <DeleteOutlined/>
                    </Button>
    
                </Popconfirm>     
      
                </span>

                <span style={{float:"right",marginRight:"10px",marginLeft:"20px"}}>
                <a href={"/fundpool/"+ address.toBase58()} target="_new">
                <Button shape="circle">
                    <EyeOutlined/>
                </Button>
                </a>
                </span>
              
                </div>;

            })
        }

        </Modal>
      

    </div>;

}