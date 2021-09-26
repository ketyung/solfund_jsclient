import * as web3 from '@solana/web3.js';
import {programId} from './useSolana';
import useSolana from './useSolana';

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


    }

}