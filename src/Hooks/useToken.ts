/**
 * Note - this is just the small part for me to test and understand
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


    async function txTo(mintStr : string, accSeed : string,  
    tokenAcc : string, pdaAcc : string, 
    
    tokenCount : number,completionHandler : (result : boolean | Error) => void){

        if ( !publicKey){

            return ;
        }

        let mint = new web3.PublicKey(mintStr);

        let tx = new web3.Transaction();

        const receiverAcc = await web3.PublicKey.createWithSeed(publicKey, accSeed,  splToken.TOKEN_PROGRAM_ID);
      
        const acc = await connection.getAccountInfo(receiverAcc);

        if ( acc === null){


            tx.add(
    
                web3.SystemProgram.createAccountWithSeed({
                    fromPubkey: publicKey,
                    basePubkey : publicKey,
                    seed: accSeed,
                    newAccountPubkey: receiverAcc,
                    space: splToken.AccountLayout.span,
                    lamports: await splToken.Token.getMinBalanceRentForExemptAccount(connection) ,
                    programId: splToken.TOKEN_PROGRAM_ID,
                }),

                splToken.Token.createInitAccountInstruction(
                    splToken.TOKEN_PROGRAM_ID, 
                    mint, // mint
                    receiverAcc, // token account public key
                    publicKey  // signer 
                ),
        
            
            );   
        
            console.log("need2CreateAcc", receiverAcc.toBase58());
        }

        /* From Rust side 
           let signer_account = next_account_info(account_info_iter)?;
    let receiver_account = next_account_info(account_info_iter)?; 
    let token_account = next_account_info(account_info_iter)?; 
    let token_program = next_account_info(account_info_iter)?;

        */

        let tokenAccount = new web3.PublicKey(tokenAcc);
        let pdaAccount = new web3.PublicKey(pdaAcc);

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: pdaAccount, isSigner: false, isWritable: false },
            { pubkey : receiverAcc, isSigner : false, isWritable : true}, 
            { pubkey : tokenAccount, isSigner : false, isWritable : true}, 
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: publicKey, isSigner: true, isWritable: false },
        
           // { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: true},
        ];


        const newInsArray : Uint8Array = new Uint8Array(9);
            
        newInsArray[0] = 2; 
        let tbytes = num_to_u64(tokenCount * 1e9);

        for (var r=0; r < tbytes.length; r++){

            newInsArray[1+r] = tbytes[r];
        }

        const dataBuffer = Buffer.from(newInsArray);


        const txRustIx = new web3.TransactionInstruction({
            programId : myProgramId, keys: accounts, data: dataBuffer, });

        tx.add(txRustIx);
        tx.feePayer = publicKey;


        sendTxs(tx, (res : string | Error) =>  {

            if (res instanceof Error){
    
                completionHandler(res);
                setLoading(false);
    
            }
            else {
    
                let acc = connection.getAccountInfo(mint);
                if (acc){

                    acc.then( d =>{

                        console.log("acc.owner::", d?.owner.toBase58(), "lamports", d?.lamports);
                    });

                    console.log("acc::", acc);
                }
                
                completionHandler(true);
                setLoading(false);        
            }
    
        });

        
    }


    async function createAndMintTo(seed : string, tokenCount : number, 
        completionHandler : (result : boolean | Error) => void) {

        if ( !publicKey){

            return ;
        }

        const accSeed = seed + "Acc";

       
      
       const mint = await web3.PublicKey.createWithSeed(publicKey, seed, splToken.TOKEN_PROGRAM_ID);
       //const mint = new web3.PublicKey("7ik9MMH8yrAtxACHp6NkdzzJ4C3Gkgzw4xrv6YLHwGGa");
       let tx = new web3.Transaction();

        console.log("mint", mint.toBase58());
        
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
    

        //let fundAcc = new web3.PublicKey("97sWPorA4XXuf4GYzhSFEmPpFWQQKi2nPR4qxnRku3Ss");

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
        
            console.log("need2CreateAcc", mintAcc.toBase58());
        }
        
            /** 
        splToken.Token.createAssociatedTokenAccountInstruction(splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            splToken.TOKEN_PROGRAM_ID, mint, mintAcc, publicKey, publicKey)*/

            /**
        let ata = await splToken.Token.getAssociatedTokenAddress(
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID, // associated token program id
            splToken.TOKEN_PROGRAM_ID, // token program id
            mint, // mint
            publicKey // token account auth 
        );
       
        console.log("ata::", ata.toBase58()); */
      
        /** // use the Rust side to mint intead!
        tx.add(
            splToken.Token.createMintToInstruction(
              splToken.TOKEN_PROGRAM_ID, // token program id
              mint, // mint
              mintAcc, // 
              publicKey, // mint
               [],
              tokenCount * 1e9 
            )
          ); */

        // use rust to mint!
        let accounts : Array<web3.AccountMeta> = [
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey : mint, isSigner : false, isWritable : false}, 
            { pubkey : mintAcc, isSigner : false, isWritable : true}, 
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
         
           // { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: true},
        ];


        const newInsArray : Uint8Array = new Uint8Array(9);
            
        newInsArray[0] = 1; // 2 is transfer
        let tbytes = num_to_u64(tokenCount * 1e9);

        for (var r=0; r < tbytes.length; r++){

            newInsArray[1+r] = tbytes[r];
        }

        const dataBuffer = Buffer.from(newInsArray);


        const mintTkWithRustIx = new web3.TransactionInstruction({
            programId : myProgramId, keys: accounts, data: dataBuffer, });
            
    
        tx.add(mintTkWithRustIx);
        tx.feePayer = publicKey;


        sendTxs(tx, (res : string | Error) =>  {

            if (res instanceof Error){
    
                completionHandler(res);
                setLoading(false);
    
            }
            else {
    
                let acc = connection.getAccountInfo(mint);
                if (acc){

                    acc.then( d =>{

                        console.log("acc.owner::", d?.owner.toBase58(), "lamports", d?.lamports);
                    });

                    console.log("acc::", acc);
                }
               
                completionHandler(true);
                setLoading(false);        
            }
    
        });

        //let txhash = await CONNECTION.sendTransaction(tx, [mint, FEE_PAYER]);
        //console.log(`txhash: ${txhash}`);
    }


    

    return [createAndMintTo, loading, getAssociatedTokenAddress,txTo] as const;

}