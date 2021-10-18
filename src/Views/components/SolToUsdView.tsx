/**
 * This is the View that will fetch
 * the price oracle of sol to usd 
 * which will periodically refresh by the specified interval
 * ketyung@techchee.com
 */

import React, {useEffect, useState} from 'react';
import './css/SolToUsdView.css';
import usePythSolToUsd from '../../Hooks/usePythSolToUsd';

interface SolToUsdViewProp {

    valueInSol : number;
    
    id : number; 
}


export const SolToUsdView : React.FC<SolToUsdViewProp> = ({ valueInSol, id }) => {

    const [fetchSolToUsd, price] = usePythSolToUsd();
    
    const [toLoad,setToLoad] = useState(false);

    useEffect(() => {

        fetchSolToUsd();

        // make it slower, seem to cause
        // too many requests often
        const nextReloadTime = 3000 + (id * 100);
        
        //console.log("nextReloadTime", nextReloadTime);

        setTimeout(()=> {

            setToLoad( !toLoad );

        }, nextReloadTime);
        
    }, [toLoad])
    
    return <div className="solToUsd">
    { (price > 0) ? "$"+(price * valueInSol).toFixed(3) : " ..... "}
    </div>

}