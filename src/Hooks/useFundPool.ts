import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_FUND_POOL, ACTION_CREATE, ACTION_REGISTER_ADDR} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { create_fund_pool } from '../models';

export default function useFundPool(){

    const [connection, publicKey,  sendIns, createAccount, loading, setLoading] = useSolana();

    const FUND_POOL_ID : string = "FUND_POOL";

    async function fundPoolIdPubKey() : Promise<web3.PublicKey> {

        if ( !publicKey) {

            let kp = web3.Keypair.generate();

            return await web3.PublicKey.createWithSeed( kp.publicKey, FUND_POOL_ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, FUND_POOL_ID, programId);

    }


    async function read(pubkey : null | string ){

        setLoading(true);
        
        let fundPkey = pubkey ? new web3.PublicKey(pubkey) : await fundPoolIdPubKey();
        let acc = await connection.getAccountInfo(fundPkey);
        
        console.log("marketPkey", fundPkey.toBase58());
        
        
        if ( acc != null ){

            console.log("acc.data", acc.data);
            alert("Len of data ::" + acc.data.length);
           
        }
        setLoading(false);
    
    }

    async function createFundPoolAccount( completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        let size : number  = 84 + (80 * 100) + (80 *100); // hard-coded first 

        let fundPoolPkey = await fundPoolIdPubKey();

        let acc = await connection.getAccountInfo(fundPoolPkey);
        // create only when it's null
        if ( acc == null ){

            await createAccount(publicKey, publicKey, fundPoolPkey, programId, FUND_POOL_ID, size, 
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


    

    async function createFundPool(lamports : number, token_count : number, 
        is_finalized : boolean, icon : number,
         completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        // use a random address first 

        let fundPoolPkey = await fundPoolIdPubKey();

        
        let acc = await connection.getAccountInfo(fundPoolPkey);
          
        let fund_pool_array : Uint8Array = create_fund_pool(
            publicKey, lamports, token_count, is_finalized, icon);

        console.log("fund_pool_array", fund_pool_array.length, fund_pool_array);
        
        let data = SolUtil.createBuffer(fund_pool_array,ACTION_CREATE,MODULE_FUND_POOL);

        if (acc != null ){

            let accounts : Array<web3.AccountMeta> = [

                { pubkey: fundPoolPkey, isSigner: false, isWritable: true },
                { pubkey: publicKey, isSigner: true, isWritable: false },
             
            ];

            sendIns(accounts, programId, data, (res : string | Error) =>  {

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

            completionHandler(new Error("No pool market account"));
            setLoading(false);
       
        }
    }

    

    return [createFundPoolAccount, createFundPool, loading, read] as const;
   
}