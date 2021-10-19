import {useEffect, useState} from 'react';
import usePythSolToUsd from './usePythSolToUsd';


export default function usePythSolToUsdAuto() {

    const [fetchSolToUsd, price] = usePythSolToUsd();
    
    const [toLoad,setToLoad] = useState(false);

    useEffect(() => {

        fetchSolToUsd();

        // make it slower, this guy seems to always cause
        // too many requests 
        const nextReloadTime = 5000 ;
        
        //console.log("nextReloadTime", nextReloadTime);

        setTimeout(()=> {

            setToLoad( !toLoad );
        
        }, nextReloadTime);
        
    }, [toLoad]);
    
    return [price] as const;
}