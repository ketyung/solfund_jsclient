import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_FUND_POOL, ACTION_CREATE, ACTION_DELETE} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { createFundPoolBytes, FundPool, extract_fund_pool } from '../state';
import { POOL_MARKET_KEY } from './usePoolMarket';
import useManagerPool from'./useManagerPool';

   
export default function useFundPool(){

   
    const [connection, publicKey,  sendIns, createAccount, loading, setLoading, sendTxs] = useSolana();

    const [,,,managerPoolIdPubKey, ID] = useManagerPool();
 
    function setStoredLastSeed(seed : string){

        localStorage.setItem("storedLastSeed", seed);

    }

    function getStoredLastSeed() : string {

        return localStorage.getItem("storedLastSeed") ?? "";
    }

    function genLastSeed()  {

        let seed = () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4();
        }

        let seedStr = "FP_"+seed();

        console.log("seedStr", seedStr);

        setStoredLastSeed(seedStr);
    }


    async function read(pubkey : string,
        completionHandler : (result : FundPool | Error) => void  ){

        setLoading(true);
        
        let lastSeed = getStoredLastSeed();

        let fundPkey = new web3.PublicKey(pubkey) ;
        
        try {

            let acc = await connection.getAccountInfo(fundPkey);
            
            if ( acc != null ){

                extract_fund_pool(acc.data, completionHandler);
                setLoading(false);
        
            }
            else {

                completionHandler(new Error("Account not found"));
                setLoading(false);
            }
        }
        catch( e  ){

            if (e instanceof Error){

                completionHandler(e);
          
            }
            
            setLoading(false);
        }
        
        
    
    }

    async function createFundPoolAccount( seed : string | null,  completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);

        // 84 + (80 * FUND_POOL_INVESTOR_LIMIT) + (80 * FUND_POOL_WITHDRAWER_LIMIT)  + 2
        let size : number  = 84 + (80 * 100) + (80 *100) + 2; // hard-coded first 

        if ( !seed ) genLastSeed();

        let lastSeed = seed ? seed : getStoredLastSeed();

        let fundPoolPkey = await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);

        let acc = await connection.getAccountInfo(fundPoolPkey);
        // create only when it's null

       // console.log("lastSeed@CreateAcc", lastSeed);

        if ( acc == null ){

            await createAccount(publicKey, publicKey, fundPoolPkey, programId, lastSeed, size, 
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


    async function deleteFundPool (address : web3.PublicKey | null, managerPoolAccount : web3.PublicKey | null, 
        completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        
        let fundPoolPkey = address ? address :
        await web3.PublicKey.createWithSeed(publicKey,getStoredLastSeed(), programId);
 
        let acc = await connection.getAccountInfo(fundPoolPkey);
       
        let data = SolUtil.createBuffer(new Uint8Array(0),ACTION_DELETE,MODULE_FUND_POOL);

        if (acc != null ){

            let accounts : Array<web3.AccountMeta> = [

                { pubkey: fundPoolPkey, isSigner: false, isWritable: true },
            ];

            if (managerPoolAccount) {

                accounts.push({ pubkey: managerPoolAccount, isSigner: false, isWritable: true });
            }

            let mkey = new web3.PublicKey(POOL_MARKET_KEY);
            accounts.push({ pubkey: mkey, isSigner: false, isWritable: true });

            accounts.push({ pubkey: publicKey, isSigner: true, isWritable: false });

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
    

    async function createFundPool(lamports : number, token_count : number, 
        is_finalized : boolean, icon : number, 
         completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

    

       let mpDataSize = 32 + 1 + (32 * 10);
       let managerPoolPKey = await managerPoolIdPubKey();
       const mgLp = await connection.getMinimumBalanceForRentExemption(mpDataSize);
       const createMpAccTx = new web3.Transaction().add (
        web3.SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: ID,
            newAccountPubkey: managerPoolPKey,
            lamports: mgLp, space: mpDataSize ,programId,
            }),
        );
        
        genLastSeed();
        let lastSeed = getStoredLastSeed();

        let fundPoolAccKey = await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);
    
        let accDataSize : number  = 84 + (80 * 100) + (80 *100) + 2; // hard-coded first 
 
        const acLp = await connection.getMinimumBalanceForRentExemption(accDataSize) ;

        const createFundPoolAccTx = new web3.Transaction().add(
            web3.SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: lastSeed,
            newAccountPubkey: fundPoolAccKey,
            lamports: acLp, space: accDataSize ,programId,
            }),
        );


        let accounts : Array<web3.AccountMeta> = [
            { pubkey: fundPoolAccKey, isSigner: false, isWritable: true },
            { pubkey: managerPoolPKey, isSigner: false, isWritable: true },
            { pubkey: new web3.PublicKey(POOL_MARKET_KEY), isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false }
        ];
        
        

        let fund_pool_array : Uint8Array = createFundPoolBytes( 
            publicKey, fundPoolAccKey, lamports, token_count, is_finalized, icon);
        let data = SolUtil.createBuffer(fund_pool_array,ACTION_CREATE,MODULE_FUND_POOL);

        const txIns = new web3.TransactionInstruction({
        programId, keys: accounts,data: data, });
    
        const allTxs = new web3.Transaction().add(
            createMpAccTx,
            createFundPoolAccTx,
            new web3.Transaction().add(txIns), 
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


    async function send(data : Buffer , signer : web3.PublicKey,  
        fundPoolPkey : web3.PublicKey,  managerPoolAccount : web3.PublicKey | null,
        completionHandler : (result : boolean | Error) => void) {

        let accounts : Array<web3.AccountMeta> = [

            { pubkey: fundPoolPkey, isSigner: false, isWritable: true },
        ];

        if (managerPoolAccount) {

            accounts.push({ pubkey: managerPoolAccount, isSigner: false, isWritable: true });
        }

        let mkey = new web3.PublicKey(POOL_MARKET_KEY);
        accounts.push({ pubkey: mkey, isSigner: false, isWritable: true });

        accounts.push({ pubkey: signer, isSigner: true, isWritable: false });

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
    

    return [createFundPoolAccount, createFundPool, loading, read, deleteFundPool] as const;
   
}