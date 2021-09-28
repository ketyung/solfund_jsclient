import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId} from './useSolana';

export default function useCounter(){

    const [connection, publicKey, , createAccount, loading, setLoading] = useSolana();

    const COUNTER_ID : string = "_COUNTER";

    async function counterIdPubKey() : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, COUNTER_ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, COUNTER_ID, programId);

    }


    async function read(pubkey : null | string ){

        setLoading(true);
        
        let counterPKey = pubkey ? new web3.PublicKey(pubkey) : await counterIdPubKey();
        let acc = await connection.getAccountInfo(counterPKey);
        
        console.log("Pkey", counterPKey.toBase58());
        
        
        if ( acc != null ){

            console.log("acc.data", acc.data);
            alert("Len of data ::" + acc.data.length);
           
        }
        setLoading(false);
    
    }

    async function createCounterAccount( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        let size : number  = 2; // hard-coded first 

        let CounterPkey = await counterIdPubKey();

        let acc = await connection.getAccountInfo(CounterPkey);
        // create only when it's null
        if ( acc == null ){

            await createAccount(publicKey, publicKey, CounterPkey, programId, COUNTER_ID, size, 
            (res : boolean | Error) =>  {

                if (res instanceof Error){
        
                    completionHandler(res);
                    setLoading(false);
        
                }
                else {
        
                    completionHandler(true);
                    setLoading(false);        
                }
        
            });
        }
        else {

            completionHandler(true);
            setLoading(false);        
    
        }
    }


    

    return [createCounterAccount, loading, read, counterIdPubKey] as const;
   
}