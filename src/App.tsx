import './App.css';
import {FundPoolTestView} from './Views/testers/FundPoolTestView';
import {PoolMarketTestView} from './Views/testers/PoolMarketTestView';
import {Route, useRoute} from 'wouter';
import {useMemo, useEffect} from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {getPhantomWallet,getSolflareWallet,getSolletWallet} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import {FundPoolView} from './Views/components/FundPoolView';

function App() {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [
    getPhantomWallet(),
    getSolletWallet({ network }),
    getSolflareWallet(),
   ], [network]);

   const [matchHome] = useRoute("/");

   const [matchPoolMarket] = useRoute("/poolmarket");

   const theTitle = () => {

      if (matchHome){
        return "Solafund - Mutual Fund On the Solana Blockchain";
      }
      else if (matchPoolMarket){

        return "Market - Solafund";

      }
      else {
        return "Solafund - Mutual Fund On the Solana Blockchain";
      }

  }

   useEffect(() => {
      document.title = theTitle();
   }, [theTitle()])

  
  return (
    <div className="App">

     <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
      <Route path="/">
        <FundPoolTestView/>
      </Route>
      <Route path="/poolmarket">
        <PoolMarketTestView/>
      </Route>
     
      <Route path="/fundpool/:address">
        {(params) => 
          <FundPoolView address={params.address}/>
        }
      </Route>

        </WalletProvider>
        </ConnectionProvider>
     
    </div>
  );
}

export default App;
