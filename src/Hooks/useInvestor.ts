import * as web3 from '@solana/web3.js';
import useSolana from './useSolana';
import {programId, MODULE_INVESTOR, ACTION_CREATE} from './useSolana';
import { SolUtil } from '../utils/SolUtil';
import { createInvestorBytes } from '../state';

export default function useInvestor(){

    const [connection, publicKey, , , , setLoading, sendTxs] = useSolana();

    const INVESTOR_POOL_ID : string = "INV_POOL";

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

        let seed = genSeed();

        let size : number  = (32 * 4) + (8 * 2) ; // hard-coded first 

        let investorAccKey =  await web3.PublicKey.createWithSeed(publicKey,seed, programId);
 
        let investorPoolKey = await web3.PublicKey.createWithSeed(publicKey, INVESTOR_POOL_ID, programId);

        let investorPoolAcc = await connection.getAccountInfo(investorPoolKey);

       
        const allTxs = new web3.Transaction();
      
        // create only when it's null
        if ( investorPoolAcc == null ){

            let poolSize = 32 + 1 + (32 * 10);
       
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

        const lp = await connection.getMinimumBalanceForRentExemption(size) ;

        const createInvAccTx = new web3.Transaction().add(
            web3.SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: seed,
            newAccountPubkey: investorPoolKey,
            lamports: lp, space: size ,programId,
            }),
        );

        allTxs.add(createInvAccTx);
       
        let investor_data : Uint8Array = createInvestorBytes( 
            publicKey, fundPoolAddress, investorAccKey, 
            web3.PublicKey.default, amount, tokenCount);
       
        let data = SolUtil.createBuffer(investor_data,ACTION_CREATE,MODULE_INVESTOR);

        /** In Rust the order is : 
        let investor_account = next_account_info(account_info_iter)?;
        let fund_pool_account = next_account_info(account_info_iter)?;
        let signer_account = next_account_info(account_info_iter)?;
        */

        let accounts : Array<web3.AccountMeta> = [
            { pubkey: investorAccKey, isSigner: false, isWritable: true },
            { pubkey: investorPoolKey, isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
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



    


    return [addInvestor] as const;
   
}