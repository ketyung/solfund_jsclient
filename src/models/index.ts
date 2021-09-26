import * as web3 from '@solana/web3.js';

export const extract_pool_market = (data : Uint8Array) => {

    //let pool_market = new PoolMarket();

    let keys = data.slice(0,data.length - 2);
    //let pool_size = data.slice(data.length - 2 , 2);

    let no_of_keys = keys.length / 32 ;

    console.log("keys.len", keys.length);

    for (var r =0; r < no_of_keys; r++){

        let offset = r * 32 ;
        let key_arr = keys.slice(offset, offset + 32);
        let pkey = new web3.PublicKey(key_arr);

        console.log("pkey"+r, pkey.toBase58());
    }

}


export class PoolMarket {

    fund_pools : Array<web3.PublicKey> = [];

    pool_size : number = 0 ;

}