import React, {useState} from 'react';
import { Form, Input, Image, Button, Modal } from 'antd';
import { IconChooser, ICONS } from './IconsChooser';


interface FundPoolFormProps {


    setValuesOf : (token_count : number, amount : 
        number, is_finalized : boolean, icon : number,
        commission_in_sol : number )=>void,


}


export const FundPoolForm   : React.FC<FundPoolFormProps> = ({setValuesOf}) =>{


    const [iconModalPresented, setIconModalPresented] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(0);

    const [tokenCount, setTokenCount] = useState(0);
  
    const SUGGESTED_TOKEN_COUNT : number = 100000;

    const [tokenToSol, setTokenToSol] = useState(1/SUGGESTED_TOKEN_COUNT);

    const [valueInSol, setValueInSol] = useState(0);
    
    const [finalized, setFinalized] = useState(false);
 
    const [commissionInSol, setCommissionInSol] = useState(0);
    
    const tokenCountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;
        let v = parseInt(txt);
      
        setTokenCount(v); 
      
        setValuesOf(tokenCount, tokenToSol, finalized, selectedIcon, commissionInSol);

        let ts = parseFloat(""+tokenToSol);

        if (isNaN(ts)){
            ts = 1/SUGGESTED_TOKEN_COUNT;
        }
        
        setValueInSol ( tokenCount * ts );

      
    };


    const tokenToSolOnChange = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;
        let ts = parseFloat(txt);
        if (isNaN(ts)){
            ts = 1/SUGGESTED_TOKEN_COUNT;
        }
        setTokenToSol(ts);   
        setValuesOf(tokenCount, tokenToSol, finalized, selectedIcon, commissionInSol);
        
        setValueInSol ( tokenCount * ts);
        
    };


    const commissionOnChange  = (e: React.FormEvent<HTMLInputElement>): void => {

        let txt = e.currentTarget.value;
        let v = parseFloat(txt);
        if (isNaN(v)){
            v = 0.00001;
        }
        setCommissionInSol(v);   
        setValuesOf(tokenCount, tokenToSol, finalized, selectedIcon, v);
        
    };

    /** // may need in the future
    const finalizedOnChange = (e: RadioChangeEvent): void => {

        let txt = e.target.value;

        let b = txt === "yes" ? true : false ;

        setFinalized(b);
        setValuesOf(tokenCount, tokenToSol, finalized, selectedIcon);
       
    }; */


    const setSelected = (selected : number) => {

        //console.log("selected.val", selected);

        setSelectedIcon(selected);
        setIconModalPresented(false);
        setValuesOf(tokenCount, tokenToSol, finalized, selected, commissionInSol);
    
    }

    return <div className="fundPoolForm">
    <Form layout="vertical" style={{color:"white"}}>

    <Form.Item label={<label style={{ color: "white" }}>Number Of Tokens</label>} 
        required tooltip="This is a required field">
        <Input placeholder={""+SUGGESTED_TOKEN_COUNT}  style={{maxWidth:"600px"}} onChange={tokenCountOnChange}/>
    </Form.Item>

    <Form.Item label={<label style={{ color: "white" }}>Token to SOL ratio</label>} 
        required tooltip="This is a required field">
        <Input placeholder={""+ (1/SUGGESTED_TOKEN_COUNT)} style={{maxWidth:"200px"}} onChange={tokenToSolOnChange}/>

        <div style={{display:"inline-block",marginLeft:"20px", color:"white"}}>Equivalent Value In SOL:</div>
        <div style={{backgroundColor:"#008", color:"white",minWidth:"60px",textAlign:"center",
        padding:"10px", borderRadius:"20px",marginLeft:"10px", display:"inline-block"}}>{valueInSol.toFixed(2)}</div>
    </Form.Item>

    <Form.Item>

    <div style={{marginLeft:"10px", display:"inline-block", color:"white"}}>
        Commission : 
    </div> 
    <div style={{display:"inline-block"}}>
        <Input placeholder="0.001" style={{display:"inline",maxWidth:"80px",margin:"10px"}} 
        onChange={commissionOnChange}
        /> 
        <label style={{color:"white", fontWeight:"bolder"}}>SOL</label>
    </div>


    <div style={{marginLeft:"80px", display:"inline-block"}}>
  
    <Image style={{margin: "12px 10px 10px 2px", padding:"1px"}}
        width={40}
        height={40} preview={false}
        src={selectedIcon >= 0 ? ICONS[selectedIcon] : "none"}
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />

    <Button style={{margin: "10px", padding:"4px", minWidth:"150px",borderRadius:"20px"}}
    onClick={async ()=> {
      
      setIconModalPresented(true);

    }} >Choose Icon</Button>

    </div>

    <Modal title={<label style={{ color: "white" }}>Choose An Icon</label>}
    className="roundModal"
            style={{minWidth:"60%"}}
            visible={iconModalPresented}
            onCancel={()=>{setIconModalPresented(false);}}
            okButtonProps={{ disabled:true }}
            cancelButtonProps={{ disabled: false }}>

        <IconChooser selectedIcon={selectedIcon} setSelected={setSelected} />
        
    </Modal>
    </Form.Item>
  
    {
    /** // may need this in the future 
    <Form.Item label="Is Finalized?">
    <Radio.Group onChange={finalizedOnChange} value="yes">
      <Radio.Button value="no">No</Radio.Button>
      <Radio.Button value="yes">Yes</Radio.Button>
    </Radio.Group>
    </Form.Item>
     */
    }
   
  

</Form>
</div>

}
