import * as web3 from '@solana/web3.js';

export const solanaNet = "devnet";

/**
 * A static class with some convenient methods
 * for checking the solana blockchain
 */
export class SolUtil {

    static async hasSufficientFund(connection : web3.Connection, 
        publicKey : web3.PublicKey | null, dataSize : number) : Promise<boolean>{

        if (!publicKey) {

            console.log("hasSufficientFund, no wallet pubkey");
            return false ; 
        }

        let fees = 0;

        const {feeCalculator} = await connection.getRecentBlockhash();

        // Calculate the cost to fund the greeter account
        fees += await connection.getMinimumBalanceForRentExemption(dataSize);
    
        // Calculate the cost of sending transactions
        fees += feeCalculator.lamportsPerSignature * 100; // wag
    
        const lamports = await connection.getBalance(publicKey);
        if (lamports < fees) {

            console.log("Insufficient fund!");
            return false ;
        }

        return true; 

    }


    static createBuffer( insArray : Uint8Array, action : number, module : number) : Buffer {
        
        const newInsArray : Uint8Array = new Uint8Array(insArray.length + 2);
            
        newInsArray[0] = module; // 2 is counter
        newInsArray[1] = action;
        
        
        for (var i = 0; i < insArray.length; i++)
        {
            newInsArray[i+2] = insArray[i];
        }
    

        const dataBuffer = Buffer.from(newInsArray);

        return dataBuffer;

    }
   
}