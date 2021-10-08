import * as web3 from '@solana/web3.js';

export const extract_market = (data : Uint8Array, 
    completionHandler : (result : Market | Error) => void ) => {

    
    let pool_size = data.slice(0 , 2);
    
    let a_pool_size = Buffer.from(pool_size).readUInt16LE(0);

    //console.log("pool_size", a_pool_size);
   
    let keys = data.slice(2);//,data.length);
    
   
    var validPkeys : Array<web3.PublicKey> = [];

    for (var r =0; r < a_pool_size; r++){

        let offset = r * 32 ;
        let key_arr = keys.slice(offset, offset + 32);
        let pkey = new web3.PublicKey(key_arr);

        if ( pkey.toBase58() !== web3.PublicKey.default.toBase58()){

            validPkeys.push(pkey);
        }
    }

    let lastOffset = a_pool_size * 32; 
    let creator = keys.slice(lastOffset , lastOffset + 32 );
    let creatorPkey = new web3.PublicKey(creator);

    //console.log("creatrPk", creatorPkey.toBase58());

    let num =  Buffer.from(pool_size).readUInt16LE(0);

   // console.log("num", num);
    
    let pm =  new  Market( { pool_size : num , fund_pools: validPkeys, creator : creatorPkey } );
    completionHandler(pm);

}


export const extract_user_pool = (data : Uint8Array, 
    completionHandler : (result : UserPool | Error) => void ) => {

    //let pool_market = new Market();
    
    
    let manager = data.slice(0 , 32);

    let num = data.slice(32, 33);

    let anum =  Buffer.from(num).readUInt8(0);

  //  console.log("anum", anum);

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


export const extract_fund_pool_investor = (data : Uint8Array,   
    completionHandler : (result : FundPoolInvestor | Error) => void) =>{

    //let (investor,pool_address, address, amount,token_address,token_count, date)

    let investor = new web3.PublicKey( data.slice(0,32));
    let pool_address = new web3.PublicKey( data.slice (32, 64));
    let address = new web3.PublicKey( data.slice(64, 96));

    console.log("data", data);
    
    console.log("inv", investor.toBase58());
    
    console.log("paddr", pool_address.toBase58());
    console.log("addr", address.toBase58());
    
    // skip 8
    // skip token address 
    let token_count = Buffer.from ( data.slice(136, 144)).readUInt32LE(0);

    let date = Buffer.from ( data.slice(144, 152)).readUInt32LE(0);
    
    let poolInvestor = new FundPoolInvestor(

        {
            investor : investor,
            address : address,
            token_count : token_count, 
            date : date, 
            pool_address : pool_address, 

        }
    )

    completionHandler(poolInvestor);
}

export const extract_fund_pool = (data : Uint8Array, accountLamports : number, 
    completionHandler : (result : FundPool | Error) => void ) => {

    /**
     * 
     *  let (is_initialized,manager, address, token_address, lamports, 
            token_count,rm_token_count, token_to_lamport_ratio,
            is_finalized, icon, invs_len, wds_len, invs_flat,wds_flat)
     */
    

    let manager = new web3.PublicKey( data.slice(1, 33) );
    let address = new web3.PublicKey (data.slice(33,65) );
    let token_address = new web3.PublicKey (data.slice(65,97) );
    let lamports = accountLamports;

    //Buffer.from ( data.slice(97, 105)).readUInt32LE(0);
    let token_count = Buffer.from ( data.slice(105, 113)).readUInt32LE(0);
    let rm_token_count =  Buffer.from ( data.slice(113, 121)).readUInt32LE(0);
    let token_to_sol_ratio =  (Buffer.from ( data.slice(121, 129)).readUInt32LE(0)) / web3.LAMPORTS_PER_SOL;
    
    let is_finalized = Buffer.from( data.slice(129, 130) ).readUInt8(0) === 1 ? true : false ;
    let icon = Buffer.from( data.slice(130 , 132) ).readUInt16LE(0);
    
    let invs_len = Buffer.from( data.slice(132 , 133) ).readUInt8(0);
    let wds_len = Buffer.from( data.slice(133 , 134) ).readUInt8(0);
    
    //console.log("icon", icon);
    //console.log("is_final", is_finalized);
    
    let e1 = (invs_len * 80) + 134;  
    let invs = data.slice(134, e1 );
    let wds = data.slice(e1 , e1 + (wds_len * 80) );
    

  //  console.log("invs_len::", invs_len);
   // console.log("wds_len::", wds_len);
    
    var validInvs  : Array<FundPoolInvestor> = [];

    for (var r =0; r < invs_len ; r++){

        let offset = r * 80 ;
        let key_arr = invs.slice(offset, offset + 80);

        let inv_arr = key_arr.slice(0,32);
        let addr_arr = key_arr.slice(32,64);
        let tkc_arr = key_arr.slice(64, 72);
        let date_arr = key_arr.slice(72,80);
        
        let inv = new web3.PublicKey(inv_arr);
        let addr = new web3.PublicKey(addr_arr);

        //console.log("inv", inv.toBase58(), "addr", addr.toBase58());

        let tkc =  Buffer.from(tkc_arr).readUInt32LE(0);
        let date = Buffer.from (date_arr).readUInt32LE(0);

        if ( inv.toBase58() !== web3.PublicKey.default.toBase58()){

            validInvs.push( new FundPoolInvestor({
                investor : inv,
                address : addr,
                token_count : tkc,
                date : date, 
                pool_address : address, 
            }));
        }
    }


    var validWds  : Array<FundPoolInvestor> = [];

    for (r =0; r < wds_len ; r++){

        let offset = r * 80 ;
        let key_arr = wds.slice(offset, offset + 80);

        let inv_arr = key_arr.slice(0,32);
        let addr_arr = key_arr.slice(32,64);
        let tkc_arr = key_arr.slice(64, 72);
        let date_arr = key_arr.slice(72,80);
        
        let inv = new web3.PublicKey(inv_arr);
        let addr = new web3.PublicKey(addr_arr);
        let tkc =  Buffer.from(tkc_arr).readUInt32LE(0);
        let date = Buffer.from (date_arr).readUInt32LE(0);

        if ( inv.toBase58() !== web3.PublicKey.default.toBase58()){

            validWds.push( new FundPoolInvestor({
                investor : inv,
                address : addr,
                token_count : tkc,
                date : date, 
                pool_address : address, 
            }));
        }
    }

    let f =  new  FundPool( { manager : manager, 
        address: address,
        token_address : token_address, 
        lamports : Number(lamports),
        token_count : Number(token_count),
        rm_token_count : Number(rm_token_count),
        token_to_sol_ratio : Number(token_to_sol_ratio),
        is_finalized : is_finalized,
        icon : Number(icon) ,
        investors : validInvs,
        withdrawers : validWds, 
    } );
    completionHandler(f);


}

/** investor, 
        pool_address, 
        address,
        token_address,
        amount, 
        token_count,
        date, */
    
   
export const createInvestorBytes = (
    size : number, 
    investor : web3.PublicKey, 
    pool_address : web3.PublicKey, 
    address : web3.PublicKey, 
    token_address : web3.PublicKey, 
    amount : number, 
    token_count : number) => {


       // console.log("investor", investor.toBase58(), "address", address.toBase58());

        // manager,lamports, token_count,is_finalized
        const newInsArray : Uint8Array = new Uint8Array(size);
       
        const ivbytes = investor.toBytes();

        var offset = 0; 

        for (var r=0; r < ivbytes.length; r++){

            newInsArray[offset+r] = ivbytes[r];
        }

        offset += ivbytes.length; 


        const abytes = pool_address.toBytes();

        for (r=0; r < abytes.length; r++){

            newInsArray[offset+r] = abytes[r];
        }

        offset += abytes.length; 


        const addrbytes = address.toBytes();

        for (r=0; r < addrbytes.length; r++){

            newInsArray[offset+r] = addrbytes[r];
        }

        offset += addrbytes.length; 

        const tkbytes = token_address.toBytes();

        for (r=0; r < tkbytes.length; r++){

            newInsArray[offset+r] = tkbytes[r];
        }

        offset += tkbytes.length; 

        let lbytes = num_to_u64(amount);

        for (r=0; r < lbytes.length; r++){

            newInsArray[offset+r] = lbytes[r];
        }

        offset += lbytes.length; 


        let tbytes = num_to_u64(token_count);

        for (r=0; r < tbytes.length; r++){

            newInsArray[offset+r] = tbytes[r];
        }


        return newInsArray;

}


export const createFundPoolBytes = (manager : web3.PublicKey, 
    address : web3.PublicKey, token_address : web3.PublicKey, 
    lamports : number, token_count : number, token_to_lamport_ratio : number, 
    is_finalized : boolean, icon : number) => {

        // manager,lamports, token_count,is_finalized
        const newInsArray : Uint8Array = new Uint8Array(123);
       
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


        let trbytes = num_to_u64(token_to_lamport_ratio);

        for (r=0; r < trbytes.length; r++){

            newInsArray[offset+r] = trbytes[r];
        }

        offset += trbytes.length; 

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


export const format_pub_key_shorter = ( pubkey : string) => {

    return pubkey.substring(0,4) + ".." + pubkey.substring(pubkey.length - 4 , pubkey.length);

}

export class Market {

    pool_size : number = 0 ;

    fund_pools : Array<web3.PublicKey> = [];

    creator : web3.PublicKey = web3.PublicKey.default;

    constructor ( pool_market : {pool_size : number, 
        fund_pools  :  Array<web3.PublicKey> , creator: web3.PublicKey} ) {
    
        if (pool_market) {

            this.pool_size = pool_market.pool_size;
            this.fund_pools = pool_market.fund_pools;
            this.creator = pool_market.creator;

        }
    }

    static default() : Market {
        
        return new Market({pool_size:0, fund_pools : [], creator: web3.PublicKey.default});
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

    rm_token_count : number = 0;

    token_to_sol_ratio : number = 0; 

    is_finalized : boolean = false ;

    icon : number = 0;

    investors : Array<FundPoolInvestor> = [];

    withdrawers : Array<FundPoolInvestor> = [];
    

    constructor ( pool : {
        manager : web3.PublicKey, 
        address  : web3.PublicKey,
        token_address  : web3.PublicKey,
        lamports : number,
        token_count : number,
        rm_token_count : number, 
        token_to_sol_ratio : number, 
        is_finalized : boolean ,
        icon : number, 
        investors : Array<FundPoolInvestor>,
        withdrawers : Array<FundPoolInvestor>, 

    }) {
    
        if (pool) {

            this.manager = pool.manager;
            this.address = pool.address;
            this.token_address = pool.token_address; 
            this.lamports = pool.lamports;
            this.token_count = pool.token_count;
            this.rm_token_count = pool.rm_token_count;
            this.token_to_sol_ratio = pool.token_to_sol_ratio; 
            this.is_finalized = pool.is_finalized;
            this.icon = pool.icon;
            this.investors = pool.investors;
            this.withdrawers = pool.withdrawers; 
        }
    }
}


export class FundPoolInvestor {


    investor : web3.PublicKey = web3.PublicKey.default ;

    address : web3.PublicKey = web3.PublicKey.default ;

    token_count : number = 0 ;

    date : number = 0; 

    pool_address : web3.PublicKey = web3.PublicKey.default;


    constructor ( investor : {
        investor : web3.PublicKey,
        address : web3.PublicKey,
        token_count : number,
        date : number,
        pool_address : web3.PublicKey, 
    }) {

        if ( investor ){

            this.investor = investor.investor;
            this.address = investor.address;
            this.token_count = investor.token_count;
            this.date = investor.date;
            this.pool_address = investor.pool_address;
        }


    }
  
}