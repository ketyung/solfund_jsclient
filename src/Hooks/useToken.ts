/**
 * Note - this is just the small part for testing
 * the Rust on-chain program for creating, minting spl token
 * By Christopher K Y Chee (ketyung@techchee.com)
 */

import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import * as splToken from "@solana/spl-token";
import { num_to_u64 } from '../state';

const tokenProgramId : web3.PublicKey = new web3.PublicKey("4jMJG9RfsdonDTShkHTxv2R7rGTqd3NC2Fqb9ckmrT3X");


export default function useToken(){

    const [connection, publicKey, , ,loading , setLoading, sendTxs] = useSolana();

  

    async function createTokenAccountAndMintTo(seed : string, tokenCount : number,
        completionHandler : (result : boolean | Error) => void) {

        if ( !publicKey) {

            completionHandler( new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        const tokenKey = await web3.PublicKey.createWithSeed(publicKey, seed, splToken.TOKEN_PROGRAM_ID);

        console.log("tokenKey", tokenKey.toBase58());

        const createTokenAccountIx = web3.SystemProgram.createAccount({
            programId: splToken.TOKEN_PROGRAM_ID,
            space: splToken.AccountLayout.span,
            lamports: await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span, 'singleGossip'),
            fromPubkey: publicKey, // initializer 
            newAccountPubkey: tokenKey
        });

        const newInsArray : Uint8Array = new Uint8Array(9);
            
        newInsArray[0] = 1; // 2 is counter
        let tbytes = num_to_u64(tokenCount);

        for (var r=0; r < tbytes.length; r++){

            newInsArray[1+r] = tbytes[r];
        }

        const dataBuffer = Buffer.from(newInsArray);

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey : tokenKey, isSigner : false, isWritable : true}, 
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ];
        
        
        const mintTkWithRustIx = new web3.TransactionInstruction({
        programId : tokenProgramId, keys: accounts, data: dataBuffer, });
        

        const allTxs = new web3.Transaction();
        
        allTxs.add(createTokenAccountIx);
        allTxs.add(mintTkWithRustIx);

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

    

    return [createTokenAccountAndMintTo, loading] as const;

}