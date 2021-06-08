import './App.css';
import WaterfallChart from './components/WaterfallChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Economics Waterfall Chart
        </p>
        <div style={{padding:'50px'}}>
          <WaterfallChart/>
        </div>

      </header>
    </div>
  );
}

export default App;
