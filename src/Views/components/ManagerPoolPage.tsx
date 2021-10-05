import React from 'react';
import {ManagerPoolView} from './ManagerPoolView'

interface ManagerPoolPageProp {

    address : string, 
}


export const ManagerPoolPage : React.FC <ManagerPoolPageProp> = ({address}) => {

    return <div>

    <ManagerPoolView address={address} />
    
    </div>
}