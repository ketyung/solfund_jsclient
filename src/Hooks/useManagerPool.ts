import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId} from './useSolana';

export default function useManagerPool(){

    const [connection, publicKey, , createAccount, loading, setLoading] = useSolana();

    const ID : string = "__MANAGER_POOL";

    async function managerPoolIdPubKey() : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, ID, programId);

    }


    async function read(pubkey : null | string ){

        setLoading(true);
        
        let managerPoolPKey = pubkey ? new web3.PublicKey(pubkey) : await managerPoolIdPubKey();
        let acc = await connection.getAccountInfo(managerPoolPKey);
        
        if ( acc != null ){

            console.log("acc.data", acc.data);
            alert("Len of data ::" + acc.data.length);
           
        }
        setLoading(false);
    
    }

    async function createManagerPoolAccount( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        let size : number  = 2; // hard-coded first 

        let managerPoolPKey = await managerPoolIdPubKey();

        let acc = await connection.getAccountInfo(managerPoolPKey);
        // create only when it's null
        if ( acc == null ){

            await createAccount(publicKey, publicKey, managerPoolPKey, programId, ID, size, 
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


    

    return [createManagerPoolAccount, loading, read, managerPoolIdPubKey] as const;
   
}