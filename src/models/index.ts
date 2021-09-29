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

   // console.log("num", num);
    
    let pm =  new  PoolMarket( { pool_size : num , fund_pools: validPkeys } );
    completionHandler(pm);

}


export const extract_manager_pool = (data : Uint8Array, 
    completionHandler : (result : ManagerPool | Error) => void ) => {

    //let pool_market = new PoolMarket();

    let manager = data.slice(0 , 32);

    let keys = data.slice(32, data.length - 32);
    
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

    let mgrKey =  new web3.PublicKey(manager);

    
    let m =  new  ManagerPool( { manager : mgrKey , addresses: validPkeys } );
    completionHandler(m);

}



export const create_fund_pool = (manager : web3.PublicKey, 
    address : web3.PublicKey, 
    lamports : number, token_count : number, 
    is_finalized : boolean, icon : number) => {

        // manager,lamports, token_count,is_finalized
        const newInsArray : Uint8Array = new Uint8Array(83);
       
        const pkbytes = manager.toBytes();

        var offset = 0; 

        for (var r=0; r < pkbytes.length; r++){

            newInsArray[offset+r] = pkbytes[r];
        }

        offset += pkbytes.length; 


        const abytes = address.toBytes();

        for (r=0; r < abytes.length; r++){

            newInsArray[offset+r] = abytes[r];
        }

        offset += abytes.length; 


        let lbytes = num_to_u64(lamports);

        for (r=0; r < lbytes.length; r++){

            newInsArray[offset+r] = lbytes[r];
        }

        offset += lbytes.length; 


        let tbytes = num_to_u64(token_count);

        for (r=0; r < tbytes.length; r++){

            newInsArray[offset+r] = tbytes[r];
        }

        offset += tbytes.length; 

        newInsArray[offset] = is_finalized ? 1 : 0;


        offset += 1;

        let ibytes = num_to_u16(icon);

        for (r=0; r < ibytes.length; r++){

            newInsArray[offset+r] = ibytes[r];
        }


        return newInsArray;

}

export const num_to_u64 = (num : number)  => {
   
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < byteArray.length; i++ ) {
        let byte = num & 0xff;
        byteArray[i] = byte;
        num = (num - byte) / 256 ;
    }

    return byteArray;

};


export const num_to_u16 = (num : number)  => {
   
    var byteArray = [0, 0];

    for ( var i = 0; i < byteArray.length; i++ ) {
        var byte = num & 0xff;
        byteArray[i] = byte;
        num = (num - byte) / 256 ;
    }

    return byteArray;

};

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


export class ManagerPool {

    manager : web3.PublicKey = web3.PublicKey.default ;

    addresses : Array<web3.PublicKey> = [];


    constructor ( pool : {manager : web3.PublicKey, addresses  :  Array<web3.PublicKey>}) {
    
        if (pool) {

            this.manager = pool.manager;
            this.addresses = pool.addresses;
        }
    }
}