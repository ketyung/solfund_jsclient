import * as web3 from '@solana/web3.js';
import {programId, MODULE_POOL_MARKET, ACTION_CREATE, ACTION_REGISTER_ADDR} from './useSolana';
import useSolana from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { extract_pool_market } from '../models';

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


    async function read(){

        let marketPkey = await poolMarketIdPubKey();
        let acc = await connection.getAccountInfo(marketPkey);
        
        if ( acc != null ){

            extract_pool_market(acc.data);

        }
    }


    async function createPoolMarket(completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        // use a random address first 

        let marketPkey = await poolMarketIdPubKey();
        let acc = await connection.getAccountInfo(marketPkey);
          

        let data = SolUtil.createBuffer(new Uint8Array(0),ACTION_CREATE,MODULE_POOL_MARKET);

        if (acc != null ){

            let accounts : Array<web3.AccountMeta> = [

                { pubkey: marketPkey, isSigner: false, isWritable: true },
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

    async function registerAddress(completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        // use a random address first 

        let randomPk = await web3.PublicKey.createWithSeed(publicKey, 
            "xxxx" + Math.floor(Math.random() * 1000), programId);

        let marketPkey = await poolMarketIdPubKey();
        let acc = await connection.getAccountInfo(marketPkey);
          
        if (acc != null ){

            let accounts : Array<web3.AccountMeta> = [

                { pubkey: marketPkey, isSigner: false, isWritable: true },
                { pubkey: publicKey, isSigner: true, isWritable: false },
           ];

            let data = SolUtil.createBuffer(randomPk.toBytes(),ACTION_REGISTER_ADDR,MODULE_POOL_MARKET);

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

    return [createPoolMarketAccount, createPoolMarket, registerAddress, read, loading] as const;
   
}