import "./styleGame.css";

export default function Game(props) {
  return (
    <div>
      <h1>GameGuesser</h1>
      <div class="grid-container" id="allPlayers">
        <h3>Player 1:_ _ _ _ _ _</h3>
        <h3>Player 2:_ _ _ _ _ _</h3>
        <h3>Player 3:_ _ _ _ _ _</h3>
        <div id="player1"></div>
        <div id="player2"></div>
        <div id="player3"></div>

        <h3>Player 4:_ _ _ _ _ _</h3>
        <h3>Player 5:_ _ _ _ _ _</h3>
        <h3>Player 6:_ _ _ _ _ _</h3>
        <div id="player4"></div>
        <div id="player5"></div>
        <div id="player6"></div>
    </div>

    <div class="scorekeeper" id="scoreboard">
        <h2>CURRENT SCORES:</h2>
        <p>Player 1: _____</p>
        <p>Player 2: _____</p>
        <p>Player 3: _____</p>
        <p>Player 4: _____</p>
        <p>Player 5: _____</p>
        <p>Player 6: _____</p>
    </div>
  </div>
  );
}