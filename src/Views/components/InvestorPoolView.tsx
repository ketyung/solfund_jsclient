import React, {useEffect, useState} from 'react';
import useUserPool from '../../Hooks/useUserPool';
import { UserPool } from '../../state';
import * as web3 from '@solana/web3.js';
import { Button, Spin } from 'antd';
import useInvestor from '../../Hooks/useInvestor';
import {AlertOutlined,ReloadOutlined} from '@ant-design/icons';
import { InvestorFundCardView } from './InvestorFundCardView';
import './css/InvestorFundCardView.css';
import { PaginationView } from './CommonPagination';

export const InvestorPoolView : React.FC = () => {

    const [,,read] = useUserPool();

    const[,investorPoolKey] = useInvestor();

    const [addresses, setAddresses] = useState<Array<web3.PublicKey>>([]);

    const [loaded, setLoaded] = useState(false);

    const [investorPoolLoading, setInvestorPoolLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const numberPerPage = 6; 

    const pageOnChange = (page : number) =>{

        setCurrentPage(page);
    }


    async function readInvestorPool(){

        setInvestorPoolLoading(true);

        read( (await investorPoolKey()).toBase58(),
        
        (res : UserPool | Error) =>  {

            if (!(res instanceof Error)){
            

                let addrs = res.addresses.reverse();

                setAddresses(addrs);
                setInvestorPoolLoading(false);
                setLoaded(true);
         
            }
            else {

                setInvestorPoolLoading(false);
                setLoaded(true);
            }
        
        }) 

    }

    useEffect(() => {

        readInvestorPool();
       
    }, []);

    const start = (currentPage - 1) * numberPerPage;

    const end =  ((currentPage - 1) * numberPerPage) + numberPerPage;
   
    const investorPoolsView =
    
    (addresses.length ?? 0) > 0 ?
    
    addresses.slice( start , end ).map(  
        (address, index ) => {

        return <InvestorFundCardView  address={address} 
        key={"InvPool"+index} className={(index % 3 === 0) ? "investorPoolNorm" : "investorPoolBrk"} />

    })
    
    :

    <div className="emptyPortfolio" style={{display : loaded ? "block" : "none"}}>
    <div className="text">
    <AlertOutlined style={{marginRight:"20px"}}/>
    Your Portfolio is empty, look up in the market to start investing now
    </div>
    </div>
    ;



    return <div className="homeFundPoolDiv">
    <p><div style={{display: investorPoolLoading ? "inline" : "none", margin : "10px"}}><Spin size="default"/></div>
    <span className="title">Your Portfolio</span>   

    <Button shape="circle" style={{marginLeft:"10px"}} onClick={async ()=> {
            await readInvestorPool();}}>
        <ReloadOutlined />
    </Button>
    
    </p>

    {investorPoolsView}
    <p>&nbsp;</p>
    
    {

        addresses.length > 0 ?

        <PaginationView currentPage={currentPage} numberPerPage={numberPerPage} 
        pageOnChange={pageOnChange} total={addresses.length} />

        :

        <></>
    }
   
    </div>
}