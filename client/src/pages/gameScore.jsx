import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import "./styleScore.css";

export default function GameScore(props) {
  const { id } = useParams();
  const [state, setState] = useState({
    scores: [],
    winner: ""
  });

  async function getScores(gameid) {
    await fetch('http://localhost:3000/game/'+gameid+'/score', {
      crossDomain: true,
      method: 'GET'
    }).then(res => res.json()).then(data => {
      console.log(data);
      setState(data);
    }).catch(err => {
      // setHasError(true);
      console.error(err);
      return
    });
  }

  useEffect(() => {
    getScores(id);
  }, [id]);
  
  return (
    <div>
      <h1>Game Over</h1>
        <div id= "winner-container"> 
          <img src="/assets/profpic2.png" alt="Player Icon" id="winner" />
          Winner: {state.winner}
      </div>
      <div id="player-container">
      {state.scores.map((obj,idx) => {
        return (
          <div key={idx} className = "playerlist">
            <img src="/assets/playericon.png" alt="Player Icon" id="playericon" className="icon"></img>
            {obj.player}: {obj.score}
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

