import React, {useState} from 'react';
import useFundPool from '../../Hooks/useFundPool';

interface FundPoolViewProps {

    address : string
}

export const FundPoolView : React.FC <FundPoolViewProps> = ({address}) => {

    const [,,loading, read] = useFundPool();


    return <div>
        


    </div>;

}