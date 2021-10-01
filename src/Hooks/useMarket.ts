import * as web3 from '@solana/web3.js';
import {programId, MODULE_POOL_MARKET, ACTION_CREATE, ACTION_REGISTER_ADDR} from './useSolana';
import useSolana from './useSolana';
import { extract_market, Market} from '../state';

export const POOL_MARKET_KEY = "9jGazEpw8agjChuRE5LPKv3HACtsm8fFcrgBcNquoTsz";


export default function usePoolMarket(){

    const [connection, publicKey,  sendIns, createAccount, loading, setLoading] = useSolana();

    const ID : string = "__MARKET";

    async function poolMarketIdPubKey() : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, ID, programId);

    }

    async function createPoolMarketAccount( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        let size : number  = (32 * 100) + 2; // hard-coded first 

        let marketPkey = await poolMarketIdPubKey();

        let acc = await connection.getAccountInfo(marketPkey);
        // create only when it's null
        if ( acc == null ){

            await createAccount(publicKey, publicKey, marketPkey, programId, ID, size, 
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


    async function read(pubkey : null | string, completionHandler : (result : Market| Error) => void ){

        setLoading(true);
        
        let marketPkey = pubkey ? new web3.PublicKey(pubkey) : await poolMarketIdPubKey();
        
        try {
            let acc = await connection.getAccountInfo(marketPkey);

            if ( acc != null ){

                extract_market(acc.data, 
                    (res : Market| Error) =>  {

                        if (res instanceof Error){
                
                            setLoading(false);
                            completionHandler(res);
                
                        }
                        else {
                
                            console.log("Completed!", res);
                            setLoading(false);     
                            completionHandler(res);   
                        }
                
                    }
                );

            }
            else {

                completionHandler( new Error("Specified Account NOT found!"));
                setLoading(false);
            
            }
        }
        catch(e) {

            if ( e instanceof Error){

                completionHandler(e);
            }
            setLoading(false);

        }
    }



    return [createPoolMarketAccount, read, loading, poolMarketIdPubKey] as const;
   
}