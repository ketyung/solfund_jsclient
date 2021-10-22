import React from "react";
import { Pagination, Button } from "antd";
import {LeftOutlined, RightOutlined} from '@ant-design/icons';

interface PaginationViewProps {

    currentPage : number;

    numberPerPage : number ;

    total : number ;

    pageOnChange : (page : number) => void; 
}


export const PaginationView : React.FC <PaginationViewProps> =  (
    {currentPage, numberPerPage, total, pageOnChange} ) => {


    const itemRender = (current : number, type : string, originalElement : React.ReactElement) => {

        if (type === 'prev') {
    
            return <Button shape="circle" style={{marginRight:"10px",backgroundColor:"#223", color:"wheat"}}>
                <LeftOutlined/>
            </Button>;
        }
        if (type === 'next') {
        
            return <Button shape="circle" style={{marginLeft:"10px",backgroundColor:"#223", color:"wheat"}}>
                <RightOutlined/>
            </Button>;
        
        }
        if ( type === "page"){
    
            return <div style={{display:"inline-block",minWidth:"30px",
            backgroundColor:"#223", color:"wheat", fontWeight:"bolder", border:0}}>
            {current}</div>;
        }
    
        return originalElement;
        
    }
    

    return  <Pagination current={currentPage} pageSize={numberPerPage} 
    style={{marginTop:"30px",margin:"auto"}} itemRender={itemRender}
    onChange={pageOnChange} total={total} />;

} 
