import './App.css';
import Tooltip from './components/Tooltip';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Economics Waterfall Chart
        </p>
        <div style={{padding:'50px'}}>
          <Tooltip/>
        </div>

      </header>
    </div>
  );
}

export default App;
