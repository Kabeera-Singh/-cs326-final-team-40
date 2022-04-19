import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import "./styleLobby.css";

export default function GameLobby(props) {
  const { id, playerid } = useParams();
  const [state, setState] = useState([]);
  let navigate = useNavigate(); 

  async function getPlayerWord(gameid, playerid) {
    const response = await fetch('http://localhost:3000/game/'+gameid+'/playerlist', {
        crossDomain: true,
        method: 'GET'
    }).catch(err => {
        // setHasError(true);
        console.error(err);
        return
    });
    const data = await response.json();
    setState(data);
  }

  async function callStartGame(gameid) {
    // TODO
    const response = await fetch('http://localhost:3000/game/'+gameid+'/start', {
      crossDomain: true,
      method: 'POST'
    }).catch(err => {
      // setHasError(true);
      console.error(err);
      return
    });
    const data = await response.json();
    console.log(data);
  }

  async function startGame() {
    navigate('/'+id+'/' + playerid + '/draw');
  }

  useEffect(() => {
    getPlayerWord(id, playerid);
  }, [id, playerid]);

  return (
    <div>
      <h1>GameLobby {id}</h1>
      <img src="./assets/skrawlpic.png" alt="Homepage" id="FrontImage"></img>
        <div>
          <span className="lobbycodetext">Your Lobby Code:</span><span id="lobbycode">{id}</span>
        </div>
        <br />
        <form>
          {state.map((player,idx) => {
            return (
              <div key={idx}>
                <span className="playerlist">{player} </span>
                <img src="/assets/playericon.png" alt="Player Icon" id="playericon" className="icon"></img>
              </div>
            )
          })}
        </form>
        <br />
        <button type="button" id="make-lobby" onClick={startGame}>Start Game</button>
    </div>
  );
}