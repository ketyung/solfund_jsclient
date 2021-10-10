/**
 * Note - this is just the small part for testing
 * the Rust on-chain program for creating, minting spl token
 * By Christopher K Y Chee (ketyung@techchee.com)
 */

import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import * as splToken from "@solana/spl-token";
import { num_to_u64 } from '../state';
const myProgramId : web3.PublicKey = new web3.PublicKey("4jMJG9RfsdonDTShkHTxv2R7rGTqd3NC2Fqb9ckmrT3X");


export default function useToken(){

    const [connection, publicKey, , ,loading , setLoading, sendTxs, wallet] = useSolana();

  
    const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: web3.PublicKey = new web3.PublicKey(
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
      );
      
    
    async function findAssociatedTokenAddress(walletAddress: web3.PublicKey, 
    tokenMintAddress: web3.PublicKey): Promise<web3.PublicKey> {
        return (await web3.PublicKey.findProgramAddress(
            [
                walletAddress.toBuffer(),
                splToken.TOKEN_PROGRAM_ID.toBuffer(),
                tokenMintAddress.toBuffer(),
            ],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        ))[0];
    }


    async function getAssociatedTokenAddress(seed : string ) : Promise <web3.PublicKey|null> {


        if ( !publicKey){

            return null ;
        }

        const tokenKey = await web3.PublicKey.createWithSeed(publicKey, seed, splToken.TOKEN_PROGRAM_ID);

        try {

            let f = await findAssociatedTokenAddress(publicKey, tokenKey);
            
            return f ;

        } 
        catch(err){

            console.log("err::", err);
            return null;
        }
    }





    async function createTokenAccountAndMintTo(seed : string, tokenCount : number,
        completionHandler : (result : boolean | Error) => void) {

        if ( !publicKey) {

            completionHandler( new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        
       // const tokenAcc = web3.Keypair.generate();

        //console.log("tokenKey", tokenKey.toBase58());

        //let accPubkey = new web3.Account();

        const tokenKey = await web3.PublicKey.createWithSeed(publicKey, seed, splToken.TOKEN_PROGRAM_ID);


        const createTokenAccountIx = web3.SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: seed,
            newAccountPubkey: tokenKey,
            lamports: await splToken.Token.getMinBalanceRentForExemptAccount(connection), 
            space: splToken.AccountLayout.span , programId: splToken.TOKEN_PROGRAM_ID
        });

         /**
  
        const initTokenAccountIx =  splToken.Token.createInitAccountInstruction(
            splToken.TOKEN_PROGRAM_ID, // program id, always token program id
            tokenKey, // mint
            tokenAcc.publicKey, // token account public key
            publicKey
        );
       */


        const newInsArray : Uint8Array = new Uint8Array(9);
            
        newInsArray[0] = 1; // 2 is counter
        let tbytes = num_to_u64(tokenCount);

        for (var r=0; r < tbytes.length; r++){

            newInsArray[1+r] = tbytes[r];
        }

        const dataBuffer = Buffer.from(newInsArray);

        // console.log("signer.acc", publicKey.toBase58());
        // console.log("tk.acc", tokenKey.toBase58());
        // console.log("tk.prog", splToken.TOKEN_PROGRAM_ID.toBase58());
        
        //let tokenAcc = await findAssociatedTokenAddress(publicKey, tokenKey);

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey : tokenKey, isSigner : false, isWritable : true}, 
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
           // { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: true},
            
        ];
        
        
        const mintTkWithRustIx = new web3.TransactionInstruction({
        programId : myProgramId, keys: accounts, data: dataBuffer, });
        

        const allTxs = new web3.Transaction();
        
        allTxs.add(createTokenAccountIx);
       // allTxs.add(initTokenAccountIx);
        allTxs.add(mintTkWithRustIx);

       // allTxs.feePayer = publicKey;

      
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


    async function createTokenAccountAndMintTo2(seed : string, tokenCount : number,
        completionHandler : (result : boolean | Error) => void) {

        if ( !publicKey) {

            completionHandler( new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        
       
        
        const tokenKey = await web3.PublicKey.createWithSeed(publicKey, seed, splToken.TOKEN_PROGRAM_ID);

        let mint0 = await findAssociatedTokenAddress(publicKey, tokenKey);
    
        console.log("findAsso", mint0.toBase58());

       //let mint = splToken.Token.createMint(connection, wallet, 
       // publicKey, publicKey, 9, splToken.TOKEN_PROGRAM_ID);


        const createTokenAccountIx = web3.SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: seed,
            newAccountPubkey: tokenKey,
            lamports: await splToken.Token.getMinBalanceRentForExemptAccount(connection), 
            space: splToken.AccountLayout.span , programId: splToken.TOKEN_PROGRAM_ID
        });

      
        // depcreated !???
        //let mint = new web3.Account();

        //console.log("mint.xx::", mint.publicKey.toBase58());

        let mint3 = await splToken.Token.getAssociatedTokenAddress(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
            splToken.TOKEN_PROGRAM_ID, tokenKey, publicKey);

        
        console.log("getAsso::", mint3.toBase58());


        const initTokenAccountIx =  splToken.Token.createInitAccountInstruction(
            splToken.TOKEN_PROGRAM_ID, // program id, always token program id
            mint3, // mint
            tokenKey, // token account public key
            publicKey
        );
     
        /** *
        const mintIx = splToken.Token.createMintToInstruction(splToken.TOKEN_PROGRAM_ID,
            mint.publicKey, tokenKey, publicKey, [], tokenCount);

 */
        //let accounts : Array<web3.AccountMeta> = [
          //  { pubkey: publicKey, isSigner: true, isWritable: false },
        //    { pubkey : tokenKey, isSigner : false, isWritable : true}, 
           // { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
          //  { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
           
       // ];
        
        

        const allTxs = new web3.Transaction();
        
        allTxs.add(createTokenAccountIx);
        allTxs.add(initTokenAccountIx);
       // allTxs.add(mintIx);
        allTxs.feePayer = publicKey;

      
        sendTxs(allTxs, (res : string | Error) =>  {

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

    

    return [createTokenAccountAndMintTo, createTokenAccountAndMintTo2, loading,
         getAssociatedTokenAddress,] as const;

}