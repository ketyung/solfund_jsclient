import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_INVESTOR, ACTION_CREATE} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { createInvestorBytes, extract_fund_pool_investor } from '../state';
import { FundPoolInvestor } from '../state';

export default function useInvestor(){

    const [connection, publicKey, , , loading, setLoading, sendTxs] = useSolana();

    const INVESTOR_POOL_ID : string = "INVESTOR_POOL";

    function genSeed() : string {

        let seed = () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4();
        }

        let seedStr = "INV_"+seed();

        return seedStr;
    }


    async function investorPoolPubkey() : Promise<web3.PublicKey> {

        if (!publicKey){

            return await web3.PublicKey.createWithSeed(web3.Keypair.generate().publicKey,
             INVESTOR_POOL_ID, programId);

        }

        return await web3.PublicKey.createWithSeed(publicKey, INVESTOR_POOL_ID, programId);

    }


    async function read(pubkey : string,
        completionHandler : (result : FundPoolInvestor | Error) => void  ){

        setLoading(true);
        
        let fundPkey = new web3.PublicKey(pubkey) ;
        
        try {

            let acc = await connection.getAccountInfo(fundPkey);
            
            if ( acc != null ){

                extract_fund_pool_investor(acc.data, completionHandler);
                
                setLoading(false);
        
            }
            else {

                completionHandler(new Error("Account not found"));
                setLoading(false);
            }
        }
        catch( e  ){

            if (e instanceof Error){

                completionHandler(e);
          
            }
            
            setLoading(false);
        }
        
        
    
    }


    async function addInvestor( 
        fundPoolAddress : web3.PublicKey,
        amount : number, 
        tokenCount : number,  
        completionHandler : (result : boolean | Error) => void){

        if (!publicKey){
            completionHandler(new Error("No wallet connected"));
            setLoading(false);
            return; 
        }

        setLoading(true);


        // check if the fund pool address exists 
        let fundPoolAcc = await connection.getAccountInfo(fundPoolAddress);
        if ( fundPoolAcc == null){

            completionHandler(new Error("Invalid fund pool account"));
            setLoading(false);
            return; 

        }


        const allTxs = new web3.Transaction();
        
        let investorPoolKey = await investorPoolPubkey();

        let investorPoolAcc = await connection.getAccountInfo(investorPoolKey);

        // create only when it's null
        if ( investorPoolAcc == null ){

            let poolSize = 32 + 1 + (32 * 50);
        
       
            const lp = await connection.getMinimumBalanceForRentExemption(poolSize) ;

            const createInvPoolAccTx = new web3.Transaction().add(
                web3.SystemProgram.createAccountWithSeed({
                fromPubkey: publicKey,
                basePubkey: publicKey,
                seed: INVESTOR_POOL_ID,
                newAccountPubkey: investorPoolKey,
                lamports: lp, space: poolSize ,programId,
                }),
            );

            allTxs.add(createInvPoolAccTx);
        }


        let size : number  = (32 * 4) + (8 * 2) ; // hard-coded first 
        let seed = genSeed();
        let investorAccKey =  await web3.PublicKey.createWithSeed(publicKey,seed, programId);
        const lp = await connection.getMinimumBalanceForRentExemption(size) ;

        const createInvAccTx = new web3.Transaction().add(
            web3.SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: seed,
            newAccountPubkey: investorAccKey,
            lamports: lp, space: size ,programId,
            }),
        );

        allTxs.add(createInvAccTx);
       
        let investor_data : Uint8Array = createInvestorBytes( size, 
            publicKey, fundPoolAddress, investorAccKey, 
            web3.PublicKey.default, amount, tokenCount);
       
        let data = SolUtil.createBuffer(investor_data,ACTION_CREATE,MODULE_INVESTOR);

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: investorAccKey, isSigner: false, isWritable: true },
            { pubkey: investorPoolKey, isSigner: false, isWritable: true },
            { pubkey: fundPoolAddress , isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
            
        ];

        const addInvIx = new web3.TransactionInstruction({programId, 
            keys: accounts, data: data, });

        allTxs.add(addInvIx);
     
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



    


    return [addInvestor,  investorPoolPubkey, loading] as const;
   
}