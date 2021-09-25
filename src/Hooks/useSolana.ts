import * as web3 from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import {solanaNet} from '../utils/SolUtil';


export default function useSolana() {

    const connection = new web3.Connection(web3.clusterApiUrl(solanaNet),'confirmed');

    // the connected wallet pubkey
    const { publicKey, sendTransaction } = useWallet();

    const [loading, setLoading] = useState(false);


    async function createAccount(fromPubkey : web3.PublicKey,
        basePubkey : web3.PublicKey, newAccPubKey : web3.PublicKey, 
        programId : web3.PublicKey, seed : string, dataSize : number,
        completionHandler : (result : boolean | Error) => void) {
       
       const lamports = await connection.getMinimumBalanceForRentExemption(dataSize) ;
   
       const transaction = new web3.Transaction().add(
           web3.SystemProgram.createAccountWithSeed({
           fromPubkey: fromPubkey,
           basePubkey: basePubkey,
           seed: seed,
           newAccountPubkey: newAccPubKey,
           lamports,
           space: dataSize,
           programId,
           }),
       );

       await sendTransaction(transaction, connection)
       .then( value => {
   
           connection.confirmTransaction(value, 'processed').then(_ => {

               completionHandler(true);
               return;

           })
           .catch( e => {

               completionHandler(e);
               return;

           });

       }).catch( err => {

           completionHandler(err);
           return;
       });

     
       
   }


   async function sendIns(keys : Array<web3.AccountMeta>, 
    programId : web3.PublicKey, data : Buffer,
    completionHandler : (result : string | Error) => void){

        const instruction = new web3.TransactionInstruction({
        programId, 
        
        keys: keys,
      
        data: data, });

        const transaction = new web3.Transaction().add(instruction);


        sendTransaction(transaction, connection)
        .then( value => {

            connection.confirmTransaction(value, 'processed').then (_ =>{

                completionHandler("success!");
                setLoading(false);

            })
            .catch(err => {

                completionHandler(err);
                setLoading(false);
                
            });

        })
        .catch(err => {

            completionHandler(err);
            setLoading(false);
                
        });

    }


   

    return [connection, publicKey,  sendIns, createAccount, loading, setLoading] as const;



}