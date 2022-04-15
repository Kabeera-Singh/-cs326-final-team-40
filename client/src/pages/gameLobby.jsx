import { useParams } from "react-router-dom";
import "./styleLobby.css";

export default function GameLobby(props) {
  const { id } = useParams();
  return (
    <div>
      <h1>GameLobby {id}</h1>
      <img src="./assets/skrawlpic.png" alt="Homepage" id="FrontImage"></img>
        <div>
          <span class="lobbycodetext">Your Lobby Code:</span><span id="lobbycode">{id}</span>
        </div>
        <br />
        <form>
            <div>
              <img src="./assets/crown.png" alt="Crown" class="icon"/>
              <img src="./assets/playericon.png" alt="Player Icon" class="icon"/>
              <span class="playerlist">Player 1</span> <span class="host">(host)</span>
            </div>
            <div>
              <img src="./assets/playericon.png" alt="Player Icon" class="icon"/>
              <span class="playerlist">Player 2</span>
            </div>
            <div>
              <img src="./assets/playericon.png" alt="Player Icon" class="icon"/>
              <span class="playerlist">Player 3</span>
            </div>
            <div>
              <img src="./assets/playericon.png" alt="Player Icon" class="icon"/>
              <span class="playerlist">Player 4</span>
            </div>
        </form>
        <br />
        <button type="button" id="make-lobby">Start Game</button>
    </div>
  );
}