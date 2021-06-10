import './App.css';
import EconomicsWaterfall from './components/WaterfallChart/EconomicsWaterfallChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Economics Waterfall Chart
        </p>
        <div style={{padding:'50px'}}>
          <EconomicsWaterfall/>
        </div>

      </header>
    </div>
  );
}

export default App;
