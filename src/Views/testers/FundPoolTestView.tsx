import React, {useState} from 'react';
import 'antd/dist/antd.css';
import useFundPool from '../../Hooks/useFundPool';
import { Button, Spin, Modal } from 'antd';
import { success,error } from '../../utils/Mesg';
import { Wallet } from "../Wallet";
import { Form, Input, Radio } from 'antd';
import { IconChooser } from './IconsChooser';
import './css/common.css';



export const FundPoolTestView : React.FC = () => {


    const [createFundPoolAccount, createFundPool, loading] = useFundPool();

    const [modalPresented, setModalPresented] = useState(false);

    const [iconModalPresented, setIconModalPresented] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);


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

          <p><Button className="commonButton" danger onClick={async ()=> {
              
              createFundPoolAccount(completion);

          }} >Create Fund Pool Account</Button></p>
       
         <p><Button className="commonButton" danger onClick={async ()=> {
              
              setModalPresented(true);

          }} >Create Fund Pool</Button></p>
       


       <Modal title="Create Fund Pool"
          style={{minWidth:"80%"}}
          visible={modalPresented}
          onCancel={()=>{setModalPresented(false);}}
          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: false }}>
       
        <Form layout="vertical">

            <Form.Item label="Number of tokens" required tooltip="This is a required field">
                <Input placeholder="number of tokens" />
            </Form.Item>
        
            <Form.Item label="Amount In SOL" required tooltip="This is a required field">
                <Input placeholder="amount in SOL" />
            </Form.Item>

            <Form.Item label="Is Finalized?">
            <Radio.Group>
              <Radio.Button value="no">No</Radio.Button>
              <Radio.Button value="yes">Yes</Radio.Button>
            </Radio.Group>
            </Form.Item>

            <Form.Item label="Icon" name="requiredMarkValue">
            <Button onClick={async ()=> {
              
              setIconModalPresented(true);

            }} >Choose Icon</Button>

            <Modal title="Create Fund Pool"
                    style={{minWidth:"60%"}}
                    visible={iconModalPresented}
                    onCancel={()=>{setIconModalPresented(false);}}
                    okButtonProps={{ disabled: true }}
                    cancelButtonProps={{ disabled: false }}>

                <IconChooser selectedIcon={selectedIcon} presented={iconModalPresented} />
                
            </Modal>

            </Form.Item>

        </Form>



       </Modal>

    </div>;

}