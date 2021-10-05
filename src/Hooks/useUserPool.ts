import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId} from './useSolana';
import { extract_user_pool, UserPool } from '../state';


export default function useUserPool(){

    const [connection, publicKey, , createAccount, loading, setLoading] = useSolana();

    const UserPoolID : string = "__MGR_POOL";

    async function userPoolIdPubKey(id : string | null) : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, id ? id : UserPoolID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, id ? id : UserPoolID, programId);

    }


    async function read(pubkey : null | string, 
        completionHandler : (result : UserPool | Error) => void ){

        setLoading(true);
        
        let UserPoolPKey = pubkey ? new web3.PublicKey(pubkey) : await userPoolIdPubKey(null);

        try {

            let acc = await connection.getAccountInfo(UserPoolPKey);
        
            if ( acc != null ){
    
                extract_user_pool(acc.data, 
                    (res : UserPool | Error) =>  {
    
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
        catch(e) {

            if ( e instanceof Error){

                completionHandler(e);
            }

            setLoading(false);
        }
        
    
    }

    async function createUserPoolAccount( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        // PUBKEY_BYTES + 1 + (PUBKEY_BYTES * MANAGER_POOL_SIZE_LIMIT)
        let size : number  = 32 + 1 + (32 * 10); // hard-coded first 

        let UserPoolPKey = await userPoolIdPubKey(null);

        let acc = await connection.getAccountInfo(UserPoolPKey);
        // create only when it's null
        if ( acc == null ){

            await createAccount(publicKey, publicKey, UserPoolPKey, programId, UserPoolID, size, 
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


    

    return [createUserPoolAccount, loading, read, userPoolIdPubKey, UserPoolID] as const;
   
}