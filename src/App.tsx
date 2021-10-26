import './App.css';
import { HomePage } from './Views/pages/HomePage';
import { MarketPage} from './Views/pages/MarketPage';
import {Route, useRoute} from 'wouter';
import {useMemo, useEffect} from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {getPhantomWallet,getSolflareWallet,getSolletWallet,getSolletExtensionWallet,} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import {FundPoolPage} from './Views/pages/FundPoolPage';
import { ManagerPoolPage } from './Views/pages/ManagerPoolPage';
import { TokenTestView } from './Views/testers/TokenTestView';
import { RaydiumTestView } from './Views/testers/RaydiumTestView';
import { AboutPage } from './Views/pages/AboutPage';
import {Wallet} from './Views/components/Wallet';
import {programId} from './Hooks/useSolana';

function App() {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [
    getPhantomWallet(),
    getSolletWallet({ network }),
    getSolflareWallet(),
    getSolletExtensionWallet({ network }),
   ], [network]);

   const [matchHome] = useRoute("/");

   const [matchPoolMarket] = useRoute("/market");

   const [matchFundPool] = useRoute("/fundpool/:address");

   const [matchManagerPool] = useRoute("/poolby/:address");

   const [matchAbout] = useRoute("/about");

   const theTitle = () => {

      if (matchHome){
        return "Solfund - Mutual Fund On the Solana Blockchain";
      }
      else if (matchPoolMarket){

        return "Market - Solfund";
      }
      else if (matchFundPool){

        return "Fund Pool - Solfund";
      }
      else if (matchManagerPool){

        return "Fund Pools - Solfund";
      }
      else if (matchAbout){

        return "About Us - Solfund";
      }
      
      else {
        return "Solfund - Mutual Fund On the Solana Blockchain";
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
        <HomePage/>
      </Route>
      <Route path="/market">
        <MarketPage/>
      </Route>
      <Route path="/fundpool/:address">
        {(params) => 
          <FundPoolPage address={params.address}/>
        }
      </Route>

      <Route path="/poolby/:address">
        {(params) => 
          <ManagerPoolPage address={params.address}/>
        }
      </Route>

      <Route path="/about">
       <AboutPage/>
      </Route>

      <Route path="/tokentest">
       <TokenTestView/>
      </Route>

      <Route path="/raydiumtest">
       <RaydiumTestView/>
      </Route>

        </WalletProvider>
        </ConnectionProvider>

        <div className="footer">
          CopyRight 2021 - Solfund&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a 
          target="_blank" style={{color:"#aaf"}}
          href={"https://solscan.io/account/"+programId
          +"?cluster=devnet"}>View Transactions</a>
        </div>
    </div>
  );
}

export default App;
