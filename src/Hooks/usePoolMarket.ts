import * as web3 from '@solana/web3.js';
import {programId} from './useSolana';
import useSolana from './useSolana';

export default function usePoolMarket(){

    const [connection, publicKey,  sendIns, createAccount, loading, setLoading] = useSolana();

    const POOL_MARKET_ID : string = "_POOL_MARKET";

    async function poolMarketIdPubKey() : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, POOL_MARKET_ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, POOL_MARKET_ID, programId);

    }

    async function createPoolMarketAccount( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        let size : number  = 322; // hard-coded first 

        let marketPkey = await poolMarketIdPubKey();

        let acc = await connection.getAccountInfo(marketPkey);
        // create only when it's null
        if ( acc == null ){

            await createAccount(publicKey, publicKey, marketPkey, programId, POOL_MARKET_ID, size, 
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

}