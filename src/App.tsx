import './App.css';
//import {FundPoolTestView} from './Views/testers/FundPoolTestView';

import { HomePageView } from './Views/components/HomePageView';
import {PoolMarketPageView} from './Views/components/PoolMarketPageView';
import {Route, useRoute} from 'wouter';
import {useMemo, useEffect} from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {getPhantomWallet,getSolflareWallet,getSolletWallet} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import {FundPoolView} from './Views/components/FundPoolView';
import { ManagerPoolPage } from './Views/components/ManagerPoolPage';
import { TokenTestView } from './Views/testers/TokenTestView';
import { AboutView } from './Views/components/AboutView';
import {Wallet} from './Views/components/Wallet';

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

   const [matchFundPool] = useRoute("/fundpool/:address");

   const [matchManagerPool] = useRoute("/poolby/:address");

   const [matchAbout] = useRoute("/about");

   const theTitle = () => {

      if (matchHome){
        return "Solafund - Mutual Fund On the Solana Blockchain";
      }
      else if (matchPoolMarket){

        return "Market - Solafund";
      }
      else if (matchFundPool){

        return "Fund Pool - Solafund";
      }
      else if (matchManagerPool){

        return "Fund Pools - Solafund";
      }
      else if (matchAbout){

        return "About Us - Solafund";
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
        <Wallet/>
          <br/>
          <br/>
      <Route path="/">
        <HomePageView/>
      </Route>
      <Route path="/poolmarket">
        <PoolMarketPageView/>
      </Route>
      <Route path="/fundpool/:address">
        {(params) => 
          <FundPoolView address={params.address}/>
        }
      </Route>

      <Route path="/poolby/:address">
        {(params) => 
          <ManagerPoolPage address={params.address}/>
        }
      </Route>

      <Route path="/about">
       <AboutView/>
      </Route>

      <Route path="/tokentest">
       <TokenTestView/>
      </Route>

        </WalletProvider>
        </ConnectionProvider>
    </div>
  );
}

export default App;
