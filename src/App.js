import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}


function App() {
  const apphtml = <>
    <p>
      Edit and save to reload.
    </p>
    <div className='App-form'>
      <input className="App-form-text" type="text" placeholder="Enter your name"></input>
      <div><button>Play!</button></div>
    </div>
  </>;

  return <div className="App">
    <h1>Scrauwl</h1>
    <div className="App-box">
      <div className="App-container">
        <Router>
          <div>
            <h2>Pages</h2>
            <ul>
              <li>
                <Link to="/netflix">Netflix</Link>
              </li>
              <li>
                <Link to="/the-goat">DaBaby</Link>
              </li>
              <li>
                <Link to="/frank">Franklin</Link>
              </li>
              <li>
                <Link to="/swamy">Swamy</Link>
              </li>
            </ul>
            <Routes>
              <Route path="/:id" element={<Child />} />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  </div>;
}

export default App;
