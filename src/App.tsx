import './App.css';
import {TestPage} from './Views/testers/TestPage';
import {PoolMarketPage} from './Views/testers/PoolMarketPage';
import {Route} from 'wouter';

function App() {
  return (
    <div className="App">
      <Route path="/">
      <TestPage/>
      </Route>
      <Route path="/poolmarket">
        <PoolMarketPage/>
      </Route>
    </div>
  );
}

export default App;
