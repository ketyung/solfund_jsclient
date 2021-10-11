import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_FUND_POOL, ACTION_CREATE, ACTION_DELETE} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { createFundPoolBytes, FundPool, extract_fund_pool } from '../state';
import { POOL_MARKET_KEY } from '../utils/Keys';
import useuserPool from'./useUserPool';
import * as splToken from "@solana/spl-token";
   
export default function useFundPool(){

   
    const [connection, publicKey,  sendIns, , loading, setLoading, sendTxs] = useSolana();

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

        setStoredLastSeed(seedStr);
    }


    async function read(pubkey : string,
        completionHandler : (result : FundPool | Error) => void  ){

        setLoading(true);
        
        let fundPkey = new web3.PublicKey(pubkey) ;
        
        try {

            let acc = await connection.getAccountInfo(fundPkey);
            
            if ( acc != null ){

                extract_fund_pool(acc.data, 
                    acc.lamports, 
                    completionHandler);

                /**
                console.log("acc.lamp", acc.lamports,
                "in SOL", (acc.lamports / web3.LAMPORTS_PER_SOL).toFixed(5));
                 */

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



    async function addRequiredTokenIxsAndAccs(seed : string, 
        tx : web3.Transaction, 
        accounts : Array<web3.AccountMeta>) {

        if ( !publicKey)
        {
            return ;
        }

        const mint = await web3.PublicKey.createWithSeed(publicKey, seed, splToken.TOKEN_PROGRAM_ID);
       

        tx.add(
            web3.SystemProgram.createAccountWithSeed({
                fromPubkey: publicKey,
                basePubkey : publicKey,
                seed: seed,
                newAccountPubkey: mint,
                space: splToken.MintLayout.span,
                lamports: await splToken.Token.getMinBalanceRentForExemptMint(connection),
                programId: splToken.TOKEN_PROGRAM_ID,
            }),
            splToken.Token.createInitMintInstruction(
                splToken.TOKEN_PROGRAM_ID, // program id,
                mint, // mint account public key
                9, // decimals
                publicKey, // mint authority
                null // freeze authority
            ),

        );

        const accSeed = seed + "Acc";

        const mintAcc = await web3.PublicKey.createWithSeed(publicKey, accSeed,  splToken.TOKEN_PROGRAM_ID);
      
        const acc = await connection.getAccountInfo(mintAcc);

        if ( acc === null){


            tx.add(
    
                web3.SystemProgram.createAccountWithSeed({
                    fromPubkey: publicKey,
                    basePubkey : publicKey,
                    seed: accSeed,
                    newAccountPubkey: mintAcc,
                    space: splToken.AccountLayout.span,
                    lamports: await splToken.Token.getMinBalanceRentForExemptAccount(connection) ,
                    programId: splToken.TOKEN_PROGRAM_ID,
                }),

                splToken.Token.createInitAccountInstruction(
                    splToken.TOKEN_PROGRAM_ID, 
                    mint, // mint
                    mintAcc, // token account public key
                    publicKey  // signer 
                ),
        
            
            );   
        
        //    console.log("need2CreateAcc", mintAcc.toBase58());
        }
       
        accounts.push(

            { pubkey : mint, isSigner : false, isWritable : false}, 
            { pubkey : mintAcc, isSigner : false, isWritable : true}, 
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
         
        );


    
    }
    

    async function createFundPool(fee_in_lamports : number, token_count : number, 
        token_to_sol_ratio : number, is_finalized : boolean, icon : number, 
         completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        genLastSeed();
        let lastSeed = getStoredLastSeed();


        let fundPoolAccKey = await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);
    
        let accDataSize : number  = 196 + (80 * 100) + (80 *100) + 2; // hard-coded first 
 
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


               
        let userPoolPKey = await userPoolIdPubKey(null);
       

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: fundPoolAccKey, isSigner: false, isWritable: true },
            { pubkey: userPoolPKey, isSigner: false, isWritable: true },
            { pubkey: new web3.PublicKey(POOL_MARKET_KEY), isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
        ];
        
        
    
        let fund_pool_data : Uint8Array = createFundPoolBytes( 
            publicKey, fundPoolAccKey, fee_in_lamports, token_count, 
            token_to_sol_ratio, is_finalized, icon);
        let data = SolUtil.createBuffer(fund_pool_data,ACTION_CREATE,MODULE_FUND_POOL);

     
        const allTxs = new web3.Transaction();
        
    
        // add create manager pool ix if null
        let upAcc = await connection.getAccountInfo(userPoolPKey);
        if (upAcc == null ){

            let upDataSize = 32 + 1 + (32 * 50);
       
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
        
        // add create fund pool account ix
        allTxs.add(
            createFundPoolAccTx,
        );

        // add the required token mint & account
        await addRequiredTokenIxsAndAccs("Tk_"+lastSeed, allTxs, accounts );

        //console.log("accounts:", accounts);

        // add the instruction for executing the Rust program

        const createFpTxIns = new web3.TransactionInstruction({
            programId, keys: accounts,data: data, });
        
        allTxs.add(
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


  
    

    return [createFundPool, loading, read, deleteFundPool] as const;
   
}