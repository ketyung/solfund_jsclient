import React, {useState, useEffect} from 'react';
import {TokenListContainer,TokenListProvider,} from "@solana/spl-token-registry";
import Swap from "@project-serum/swap-ui";
import Wallet from "@project-serum/sol-wallet-adapter";
import useSolana from '../../Hooks/useSolana';
import { Provider } from '@project-serum/anchor';
import {ConfirmOptions} from "@solana/web3.js";

export const SerumTokensView : React.FC  = () => {

   const [connection] = useSolana();

    const [tokenList, setTokenList] = useState<TokenListContainer | null>(null);

    useEffect(() => {
        new TokenListProvider().resolve().then(setTokenList);
    }, [setTokenList]);


    const provider = () => {

        const opts: ConfirmOptions = {
            preflightCommitment: "recent",
            commitment: "recent",
        };
        
       /**
        const network = "https://solana-api.projectserum.com";
        const wallet = new Wallet("https://www.sollet.io", network);

        if ( wallet ){

            let provider = new Provider(connection, wallet, opts );

        }
        */
       
    }

    return <div>


    </div>;
}