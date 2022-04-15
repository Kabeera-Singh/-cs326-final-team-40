import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Game, GameLobby, GameNew, GameScore } from './pages';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function GameRouter(props) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App gameComponent={GameNew} />} />
        <Route path="/:id/" element={<App gameComponent={GameLobby} />} />
        <Route path="/:id/play" element={<App gameComponent={Game} />} />
        <Route path="/:id/score" element={<App gameComponent={GameScore} />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameRouter />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
