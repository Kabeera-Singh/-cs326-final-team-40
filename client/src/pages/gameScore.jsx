import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import "./styleScore.css";

export default function GameScore(props) {
  const { id, playerid } = useParams();
  const [state, setState] = useState([]);
  let navigate = useNavigate(); 


  async function getPlayers(gameid, playerid) {
    await fetch('http://localhost:3000/game/'+gameid+'/playerlist', {
      crossDomain: true,
      method: 'GET'
    }).then(res => res.json()).then(data => {
      // if (!(playerid in data)) {
      //   navigate('/');
      // }
      setState(data);
    }).catch(err => {
      // setHasError(true);
      console.error(err);
      return
    });
  }

  useEffect(() => {
    getPlayers(id, playerid);
  }, [id, playerid]);
  
  return (
    <div>
      <h1>Game Over</h1>
        <div id= "winner-container"> 
          <img src="/assets/profpic2.png" alt="Player Icon" id="winner" />
          Winner Block
      </div>
      <div id="player-container">
      {state.map((player,idx) => {
            return (
              <div key={idx} className = "playerlist">
                <img src="/assets/playericon.png" alt="Player Icon" id="playericon" className="icon"></img>
                {player} 
              </div>
            )
          })}
      </div>

      <center>
          <button type="button" id="newgame">New Game</button>
      </center>
    </div>
  );

  
  
  


}

