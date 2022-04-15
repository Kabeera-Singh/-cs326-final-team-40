import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function GameNew(props) {
  const [gameId, setGameId] = useState('');
  const [name, setName] = useState('');
  let navigate = useNavigate(); 

  async function getGameID() {
    if (name === "") {
      alert("Please enter a name");
      return;
    }
    const response = await fetch('http://localhost:3000/newgame', {
      crossDomain: true,
      method: 'POST'
    });
    const data = await response.json();
    setGameId(data.gameID);
    await joinGame(data.gameID, name);
    navigate('/' + data.gameID);
  }

  async function joinGame(gameID, playerName) {
    const response = await fetch('http://localhost:3000/game/'+gameID+"/join/"+playerName, {
      crossDomain: true,
      method: 'POST'
    });
    const data = await response.json();
    console.log(data);
    // navigate('/' + gameID);
  }
  async function joinGameID() {
    if (gameId === "") {
      alert("Please enter a game ID");
      return;
    } else if (name === "") {
      alert("Please enter a name");
      return;
    } else {
      await joinGame(gameId, name);
      navigate('/' + gameId);
    }
  }

  return (
    <div>
      <h1>Welcome to Skrauwl.io</h1>
      <img src="./assets/skrawlpic.png" alt="Homepage" id="FrontImage"/>
      <div>
          <label htmlFor="name">Nickname:</label>
          <input type="text" id="nickname" autoComplete="off" onChange={e => setName(e.target.value)} />
      </div>
      <br/>
      <button type="button" id="make-lobby" onClick={getGameID}>Create Lobby</button>
      <br/>
      <br/>
      <span>OR</span>
      <br/>
      <br/>
      <label htmlFor="lobbyname">Enter Game Code</label>
      <br/>
      <input type="text" id="lobbyname" autoComplete="off" onChange={e => setGameId(e.target.value)} />
      <br/>
      <Link to={"/" + gameId}>
      <button type="button" id="join-lobby" onClick={joinGameID}>Join</button>
      </Link>
    </div>
  );
}