import "./styleScore.css";

export default function GameScore(props) {
  return (
    <div>
      <h1>Game Over</h1>
        <div class= "winner-container"> 
          <img src="/assets/profpic2.png" alt="Player Icon" id="winner" />
          Player 2 WINS! 
          <br />
          SCORE:
      </div>

      <div class="player-container">
        <div>
          <img src="/assets/profpic1.png" alt="Player Icon" class="icon" />
          <br />
          <span class="playerlist"> SCORE: </span>
        </div>
        <div>
          <img src="/assets/profpic1.png" alt="Player Icon" class="icon" />
          <br />
          <span class="playerlist"> SCORE: </span>
        </div>
        <div>
          <img src="/assets/profpic2.png" alt="Player Icon" class="icon" />
          <br />
          <span class="playerlist">SCORE: </span>
        </div>
      </div>
      <center>
          <button type="button" id="newgame">New Game</button>
      </center>
    </div>
  );
}