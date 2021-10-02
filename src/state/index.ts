import * as web3 from '@solana/web3.js';

export const extract_market = (data : Uint8Array, 
    completionHandler : (result : Market | Error) => void ) => {

    //let pool_market = new Market();

    let pool_size = data.slice(0 , 2);
    
    let a_pool_size = Buffer.from(pool_size).readUInt16LE(0);

    //console.log("pool_size", a_pool_size);

    let keys = data.slice(2,data.length);
    
   // let no_of_keys = keys.length / 32 ;

    //console.log("keys.len", keys.length);

    var validPkeys : Array<web3.PublicKey> = [];

    for (var r =0; r < a_pool_size; r++){

        let offset = r * 32 ;
        let key_arr = keys.slice(offset, offset + 32);
        let pkey = new web3.PublicKey(key_arr);

        if ( pkey.toBase58() !== web3.PublicKey.default.toBase58()){

            validPkeys.push(pkey);
        }
    }

    let num =  Buffer.from(pool_size).readUInt16LE(0);

   // console.log("num", num);
    
    let pm =  new  Market( { pool_size : num , fund_pools: validPkeys } );
    completionHandler(pm);

}


export const extract_user_pool = (data : Uint8Array, 
    completionHandler : (result : UserPool | Error) => void ) => {

    //let pool_market = new Market();
    
    
    let manager = data.slice(0 , 32);

    let num = data.slice(32, 33);

    let anum =  Buffer.from(num).readUInt8(0);

    console.log("anum", anum);

    let keys = data.slice(33, data.length);
    
    //let no_of_keys = keys.length / 32 ;

    
    var validPkeys : Array<web3.PublicKey> = [];

    for (var r =0; r < anum ; r++){

        let offset = r * 32 ;
        let key_arr = keys.slice(offset, offset + 32);
        let pkey = new web3.PublicKey(key_arr);

        if ( pkey.toBase58() !== web3.PublicKey.default.toBase58()){

            validPkeys.push(pkey);
        }
    }

    let mgrKey =  new web3.PublicKey(manager);

   
    let m =  new  UserPool( { manager : mgrKey , addresses: validPkeys } );
    completionHandler(m);

}


export const extract_fund_pool = (data : Uint8Array, 
    completionHandler : (result : FundPool | Error) => void ) => {

    // let (is_initialized,manager, address, lamports, 
    //  token_count,is_finalized, icon, invs_len, wds_len, invs_flat,wds_flat) =

    // let is_initialized = Buffer.from( data.slice(0 , 1) ).readUInt8(0) == 1 ? true : false ;

    
    let manager = new web3.PublicKey( data.slice(1, 33) );
    let address = new web3.PublicKey (data.slice(33,65) );
    let token_address = new web3.PublicKey (data.slice(65,97) );
    let lamports = Buffer.from ( data.slice(97, 105)).readUInt32LE(0);
    let token_count = Buffer.from ( data.slice(105, 113)).readUInt32LE(0);

    let is_finalized = Buffer.from( data.slice(113, 114) ).readUInt8(0) === 1 ? true : false ;
    let icon = Buffer.from( data.slice(114 , 116) ).readUInt8(0);
    console.log("icon", icon);


    let f =  new  FundPool( { manager : manager, 
        address: address,
        token_address : token_address, 
        lamports : Number(lamports),
        token_count : Number(token_count),
        is_finalized : is_finalized,
        icon : Number(icon) 
    } );
    completionHandler(f);


}

export const createFundPoolBytes = (manager : web3.PublicKey, 
    address : web3.PublicKey, token_address : web3.PublicKey, 
    lamports : number, token_count : number, 
    is_finalized : boolean, icon : number) => {

        // manager,lamports, token_count,is_finalized
        const newInsArray : Uint8Array = new Uint8Array(115);
       
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


        const tkbytes = token_address.toBytes();

        for (r=0; r < tkbytes.length; r++){

            newInsArray[offset+r] = tkbytes[r];
        }

        offset += tkbytes.length; 


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

export class Market {

    pool_size : number = 0 ;

    fund_pools : Array<web3.PublicKey> = [];


    constructor ( pool_market : {pool_size : number, fund_pools  :  Array<web3.PublicKey>}) {
    
        if (pool_market) {

            this.pool_size = pool_market.pool_size;
            this.fund_pools = pool_market.fund_pools;
        }
    }
}


export class UserPool {

    manager : web3.PublicKey = web3.PublicKey.default ;

    addresses : Array<web3.PublicKey> = [];

    constructor ( pool : {manager : web3.PublicKey, addresses  :  Array<web3.PublicKey>}) {
    
        if (pool) {

            this.manager = pool.manager;
            this.addresses = pool.addresses;
        }
    }
}


// let (is_initialized,manager, address, lamports, 
//  token_count,is_finalized, icon, invs_len, wds_len, invs_flat,wds_flat) =

  
export class FundPool {

    manager : web3.PublicKey = web3.PublicKey.default ;

    address : web3.PublicKey = web3.PublicKey.default ;

    token_address : web3.PublicKey = web3.PublicKey.default ;

    lamports : number = 0;

    token_count : number = 0; 

    is_finalized : boolean = false ;

    icon : number = 0;

    constructor ( pool : {
        manager : web3.PublicKey, 
        address  : web3.PublicKey,
        token_address  : web3.PublicKey,
        lamports : number,
        token_count : number,
        is_finalized : boolean ,
        icon : number, 
    }) {
    
        if (pool) {

            this.manager = pool.manager;
            this.address = pool.address;
            this.token_address = pool.token_address; 
            this.lamports = pool.lamports;
            this.token_count = pool.token_count;
            this.is_finalized = pool.is_finalized;
            this.icon = pool.icon;
        }
    }
}