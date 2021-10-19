/**
 * The original way of https://github.com/pyth-network/pyth-client-js 
 * fetching the price oracle seems to be too fast and causing 
 * many times of too many request problem & crashed when tested on the devnet
 * therefore I built this custom react hook which is meant 
 * for manually or triggered by action to fetch it 
 * By Christopher K Y Chee (ketyung@techchee.com)
 */
import React from 'react';
import {
    parseBaseData,
    parsePriceData,
    parseProductData, 
    getPythProgramKeyForCluster,
    AccountType,
} from '@pythnetwork/client';
import useSolana from './useSolana';
import * as web3 from '@solana/web3.js';

export default function usePythSolToUsd() {

    const[connection] = useSolana();

    const [price, setPrice] = React.useState(0); 

    const pythProgramId = getPythProgramKeyForCluster("devnet");

    async function fetchSolToUsd() {

        const accounts = await connection.getProgramAccounts(pythProgramId, "finalized");

        for (const account of accounts) {
            handleAccount(account.account);
        }      
    }

    function handleAccount(account: web3.AccountInfo<Buffer>){

        const base = parseBaseData(account.data)
        if (base){
            // only interested in product
            if (AccountType[base.type] === 'Product') {

                handleProductAccount(account);
            }
        }

    }

    async function handleProductAccount(account: web3.AccountInfo<Buffer>){
        const {priceAccountKey, product} = parseProductData(account.data);

       // console.log("priceAccKey::", priceAccountKey.toBase58(), product.symbol);

        if ( product.symbol === "SOL/USD") {

            // only interested in SOL/USD 

            const priceAccount = await connection.getAccountInfo(priceAccountKey);

            if ( priceAccount ){

                handlePriceAccount(priceAccount);
            }
           
        }

    }

    function handlePriceAccount(account: web3.AccountInfo<Buffer>) {

        const priceData = parsePriceData(account.data);
        // console.log("priceData::", priceData.price);
        //let confidence = Math.abs(priceData.confidence);
        //if ( confidence > 0.05){

        setPrice(priceData.price);
        //} 
      
    }

    return [fetchSolToUsd, price] as const;

}