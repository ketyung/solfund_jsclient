import React, {useState, useEffect} from 'react';
import useFundPool from '../../Hooks/useFundPool';
import {FundPool} from '../../state';
import { error } from '../../utils/Mesg';

interface FundPoolViewProps {

    address : string
}

export const FundPoolView : React.FC <FundPoolViewProps> = ({address}) => {

    const [,,loading, read] = useFundPool();

    const [fundPool, setFundPool] = useState<FundPool>();

    useEffect(() => {
        
        read (address, 
            
            (res : FundPool | Error) =>  {

                if (res instanceof Error){
        
                    error(res.message);
                }
                else {
        
                    setFundPool(res);
                }
        
            }
        );

    }, [address])
  
    return <div>
        


    </div>;

}