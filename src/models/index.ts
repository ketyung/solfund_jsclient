import * as web3 from '@solana/web3.js';

export const extract_pool_market = (data : Uint8Array, 
    completionHandler : (result : PoolMarket | Error) => void ) => {

    //let pool_market = new PoolMarket();

    let pool_size = data.slice(0 , 2);

    let keys = data.slice(2,data.length);
    
    let no_of_keys = keys.length / 32 ;

    //console.log("keys.len", keys.length);

    var validPkeys : Array<web3.PublicKey> = [];

    for (var r =0; r < no_of_keys; r++){

        let offset = r * 32 ;
        let key_arr = keys.slice(offset, offset + 32);
        let pkey = new web3.PublicKey(key_arr);

        if ( pkey.toBase58() !== web3.PublicKey.default.toBase58()){

            validPkeys.push(pkey);
        }
    }

    let num =  Buffer.from(pool_size).readUInt16LE(0);

    console.log("num", num);
    
    let pm =  new  PoolMarket( { pool_size : num , fund_pools: validPkeys } );
    completionHandler(pm);

}


export class PoolMarket {


    pool_size : number = 0 ;

    fund_pools : Array<web3.PublicKey> = [];


    constructor ( pool_market : {pool_size : number, fund_pools  :  Array<web3.PublicKey>}) {
    
        if (pool_market) {

            this.pool_size = pool_market.pool_size;
            this.fund_pools = pool_market.fund_pools;
        }
    }
}