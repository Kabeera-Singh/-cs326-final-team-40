import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function GameNew(props) {
  const [gameId, setGameId] = useState('');
  let navigate = useNavigate(); 

  async function getGameId() {
    const response = await fetch('http://localhost:3000/newgame', {
      crossDomain: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setGameId(data.gameID);
    navigate('/' + data.gameID);
  }
  
  return (
    <div>
      <h1>Welcome to Skrauwl.io</h1>
      <img src="./assets/skrawlpic.png" alt="Homepage" id="FrontImage"/>
      <div>
          <label htmlFor="name">Nickname:</label>
          <input type="text" id="nickname" autoComplete="off" />
      </div>
      <br/>
      <button type="button" id="make-lobby" onClick={getGameId}>Create Lobby</button>
      <br/>
      <br/>
      <span>OR</span>
      <br/>
      <br/>
      <label for="lobbyname">Enter Game Code</label>
      <br/>
      <input type="text" id="lobbyname" autocomplete="off" onChange={e => setGameId(e.target.value)} />
      <br/>
      <Link to={"/" + gameId}>
      <button type="button" id="join-lobby">Join</button>
      </Link>
    </div>
  );
}