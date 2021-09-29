import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_FUND_POOL, ACTION_CREATE, ACTION_DELETE} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { create_fund_pool } from '../models';
import { POOL_MARKET_KEY } from './usePoolMarket';
import { useState, useEffect } from 'react';


   
export default function useFundPool(){

   
    const [connection, publicKey,  sendIns, createAccount, loading, setLoading] = useSolana();

 
    function setStoredLastSeed(seed : string){

        localStorage.setItem("storedLastSeed", seed);

    }

    function getStoredLastSeed() : string {

        return localStorage.getItem("storedLastSeed") ?? "";


    }

    function genLastSeed()  {

        let seed = "FP_"+ (Math.random() + 1).toString(36).substring(5) +
        (Math.random() + 3).toString(36).substring(5);

        setStoredLastSeed(seed);
    }


    async function read(pubkey : null | string ){

        if (!publicKey){
            setLoading(false);
            return; 
        }

        setLoading(true);
        
        let lastSeed = getStoredLastSeed();

        let fundPkey = pubkey ? new web3.PublicKey(pubkey) :  
        await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);

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

        let size : number  = 84 + (80 * 100) + (80 *100) + 2; // hard-coded first 

        genLastSeed();

        let lastSeed = getStoredLastSeed();

        let fundPoolPkey = await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);

        let acc = await connection.getAccountInfo(fundPoolPkey);
        // create only when it's null

        console.log("lastSeed@CreateAcc", lastSeed);

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


    async function deleteFundPool (manager_pool_account : web3.PublicKey | null, 
        completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        let lastSeed = getStoredLastSeed();

        let fundPoolPkey = await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);
 
        let acc = await connection.getAccountInfo(fundPoolPkey);
       
        let data = SolUtil.createBuffer(new Uint8Array(0),ACTION_DELETE,MODULE_FUND_POOL);

        if (acc != null ){

            let accounts : Array<web3.AccountMeta> = [

                { pubkey: fundPoolPkey, isSigner: false, isWritable: true },
            ];

            if (manager_pool_account) {

                accounts.push({ pubkey: manager_pool_account, isSigner: false, isWritable: true });
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
        is_finalized : boolean, icon : number, manager_pool_account : web3.PublicKey | null, 
         completionHandler : (result : boolean | Error) => void) {

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            return; 
        }

        setLoading(true);

        // use a random address first 

        let lastSeed = getStoredLastSeed();

        console.log("lastSeed@createFundPool", lastSeed);

        let fundPoolPkey = await web3.PublicKey.createWithSeed(publicKey, lastSeed, programId);
 
        let acc = await connection.getAccountInfo(fundPoolPkey);
          
        let fund_pool_array : Uint8Array = create_fund_pool(
            publicKey, fundPoolPkey, lamports, token_count, is_finalized, icon);

        //console.log("fund_pool_array", fund_pool_array.length, fund_pool_array);
        
        let data = SolUtil.createBuffer(fund_pool_array,ACTION_CREATE,MODULE_FUND_POOL);

        if (acc != null ){

            let accounts : Array<web3.AccountMeta> = [

                { pubkey: fundPoolPkey, isSigner: false, isWritable: true },
            ];

            if (manager_pool_account) {

                accounts.push({ pubkey: manager_pool_account, isSigner: false, isWritable: true });
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

    

    return [createFundPoolAccount, createFundPool, loading, read, deleteFundPool] as const;
   
}