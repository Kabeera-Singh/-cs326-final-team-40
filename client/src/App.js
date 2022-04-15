// import logo from './logo.svg';
import './App.css';

function App(props) {
  const GameComponent = props.gameComponent;
  return (
    <div className="App">
      <header>
        <h1>Scrauwl</h1>
      </header>
      <GameComponent />
    </div>
  );
}

export default App;
