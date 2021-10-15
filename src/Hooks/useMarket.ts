import * as web3 from '@solana/web3.js';
import {programId, MODULE_MARKET, ACTION_CREATE} from './useSolana';
import useSolana from './useSolana';
import { extract_market, Market} from '../state';
import { SolUtil } from '../utils/SolUtil';
import { MARKET_SEED_ID } from '../utils/Keys';


export default function useMarket(){

    const [connection, publicKey, , , loading, setLoading, sendTxs] = useSolana();

   
    async function poolMarketIdPubKey() : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, MARKET_SEED_ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, MARKET_SEED_ID, programId);

    }

    async function createMarket( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        let size : number  = (32 * 100) + 2 + 32 ; // hard-coded first 

        let marketPkey = await poolMarketIdPubKey();

        console.log("marketKey", marketPkey.toBase58());
        

        let acc = await connection.getAccountInfo(marketPkey);
        // create only when it's null
        if ( acc == null ){

            let marketKey = await web3.PublicKey.createWithSeed(publicKey, MARKET_SEED_ID, programId);
    
            const lp = await connection.getMinimumBalanceForRentExemption(size) ;

            const createAccTx = new web3.Transaction().add(
                web3.SystemProgram.createAccountWithSeed({
                fromPubkey: publicKey,
                basePubkey: publicKey,
                seed: MARKET_SEED_ID,
                newAccountPubkey: marketKey,
                lamports: lp, space: size ,programId,
                }),
            );


            const newInsArray : Uint8Array = new Uint8Array(32);
       
            const pkbytes = publicKey.toBytes();
    
            for (var r=0; r < pkbytes.length; r++){
    
                newInsArray[r] = pkbytes[r];
            }
    
            let data = SolUtil.createBuffer(pkbytes,ACTION_CREATE,MODULE_MARKET);

            let accounts : Array<web3.AccountMeta> = [
                { pubkey: marketKey, isSigner: false, isWritable: true },
                { pubkey: publicKey, isSigner: true, isWritable: false },
            ];

            const createMkIns = new web3.TransactionInstruction({programId, keys: accounts, data: data, });
    
            const allTxs = new web3.Transaction();
            allTxs.add(
                createAccTx,
                new web3.Transaction().add(createMkIns), 
            );

            sendTxs(allTxs, (res : string | Error) =>  {

                if (res instanceof Error){
        
                    completionHandler(res);
                    setLoading(false);
        
                }
                else {
        
                    console.log("Completed!", res);
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
        
      //  console.log("mKey", marketPkey.toBase58());
        
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



    return [createMarket, read, loading, poolMarketIdPubKey] as const;
   
}