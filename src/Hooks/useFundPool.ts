import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_FUND_POOL, ACTION_CREATE, ACTION_DELETE} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { createFundPoolBytes, FundPool, extract_fund_pool } from '../state';
import { POOL_MARKET_KEY } from './useMarket';
import useuserPool from'./useUserPool';
import * as splToken from "@solana/spl-token";
   
export default function useFundPool(){

   
    const [connection, publicKey,  sendIns, createAccount, loading, setLoading, sendTxs] = useSolana();

    const [,,,userPoolIdPubKey, UserPoolID] = useuserPool();
 
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


    async function deleteFundPool (address : web3.PublicKey | null, userPoolAccount : web3.PublicKey | null, 
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

            if (userPoolAccount) {

                accounts.push({ pubkey: userPoolAccount, isSigner: false, isWritable: true });
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

        genLastSeed();
        let lastSeed = getStoredLastSeed();

        let tkSeed = "TK"+lastSeed;

        const tokenKey = await web3.PublicKey.createWithSeed(publicKey, tkSeed, splToken.TOKEN_PROGRAM_ID);

        //const tokenMintKey = new web3.PublicKey((await connection.getParsedAccountInfo(tokenKey, 'singleGossip')));

        // print for comparison with the rust backend
        console.log("tokenKey", tokenKey.toBase58());

        const createTokenAccountIx = web3.SystemProgram.createAccount({
            programId: splToken.TOKEN_PROGRAM_ID,
            space: splToken.AccountLayout.span,
            lamports: await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span, 'singleGossip'),
            fromPubkey: publicKey, // initializer 
            newAccountPubkey: tokenKey
        });

        //const initTokenAccountIx = splToken.Token.createInitAccountInstruction(splToken.TOKEN_PROGRAM_ID, 
          //  tokenMintKey, tokenKey, publicKey);
   
        //const txTokensToAccountIx = splToken.Token
        //.createTransferInstruction(splToken.TOKEN_PROGRAM_ID, publicKey, tokenKey, 
        //publicKey, [], token_count);
    


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


               
        let userPoolPKey = await userPoolIdPubKey();
       

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: fundPoolAccKey, isSigner: false, isWritable: true },
            { pubkey: userPoolPKey, isSigner: false, isWritable: true },
            { pubkey: new web3.PublicKey(POOL_MARKET_KEY), isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey : tokenKey, isSigner : false, isWritable : true} // pass the last one as the token account 
        ];
        
        
    
        let fund_pool_data : Uint8Array = createFundPoolBytes( 
            publicKey, fundPoolAccKey,tokenKey,  lamports, token_count, is_finalized, icon);
        let data = SolUtil.createBuffer(fund_pool_data,ACTION_CREATE,MODULE_FUND_POOL);

        const createFpTxIns = new web3.TransactionInstruction({
        programId, keys: accounts,data: data, });
    
        const allTxs = new web3.Transaction();
        
        // add here for the createTokenAccount, initialize token acc, and transfer the token numbers to acc
        allTxs.add(createTokenAccountIx);//, initTokenAccountIx, txTokensToAccountIx);

        let upAcc = await connection.getAccountInfo(userPoolPKey);
        if (upAcc == null ){

            let upDataSize = 32 + 1 + (32 * 10);
       
            const upLp = await connection.getMinimumBalanceForRentExemption(upDataSize);
            const createMpAccTx = new web3.Transaction().add (
            web3.SystemProgram.createAccountWithSeed({
                fromPubkey: publicKey,
                basePubkey: publicKey,
                seed: UserPoolID,
                newAccountPubkey: userPoolPKey,
                lamports: upLp, space: upDataSize ,programId,
                }),
            );
            allTxs.add(createMpAccTx);
        }
        
        
        allTxs.add(
            createFundPoolAccTx,
            new web3.Transaction().add(createFpTxIns), 
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


  
    

    return [createFundPoolAccount, createFundPool, loading, read, deleteFundPool] as const;
   
}