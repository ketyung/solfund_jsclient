import './App.css';
import {FundPoolTestView} from './Views/testers/FundPoolTestView';
import {PoolMarketTestView} from './Views/testers/PoolMarketTestView';
import {Route} from 'wouter';
import {useMemo} from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {getPhantomWallet,getSolflareWallet,getSolletWallet} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';


function App() {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [
    getPhantomWallet(),
    getSolletWallet({ network }),
    getSolflareWallet(),
   ], [network]);




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
     
        </WalletProvider>
        </ConnectionProvider>
     
    </div>
  );
}

export default App;
