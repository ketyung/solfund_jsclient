import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId} from './useSolana';
import { extract_manager_pool, ManagerPool } from '../models';


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


    async function readMgp(pubkey : null | string, 
        completionHandler : (result : ManagerPool | Error) => void ){

        setLoading(true);
        
        let managerPoolPKey = pubkey ? new web3.PublicKey(pubkey) : await managerPoolIdPubKey();
        let acc = await connection.getAccountInfo(managerPoolPKey);
        
        if ( acc != null ){

            extract_manager_pool(acc.data, 
                (res : ManagerPool | Error) =>  {

                    if (res instanceof Error){
            
                        setLoading(false);
                        completionHandler(res);
            
                    }
                    else {
            
                        setLoading(false);     
                        completionHandler(res);   
                    }
            
                }
            );

        }
        else {

            completionHandler( new Error("Specified Account NOT found!"));
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

        // PUBKEY_BYTES + 1 + (PUBKEY_BYTES * MANAGER_POOL_SIZE_LIMIT)
        let size : number  = 32 + 1 + (32 * 10); // hard-coded first 

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


    

    return [createManagerPoolAccount, loading, readMgp, managerPoolIdPubKey] as const;
   
}