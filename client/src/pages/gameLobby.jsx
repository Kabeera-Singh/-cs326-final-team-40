import { useParams } from "react-router-dom";
import "./styleLobby.css";

export default function GameLobby(props) {
  const { id } = useParams();
  return (
    <div>
      <h1>GameLobby {id}</h1>
      <img src="./assets/skrawlpic.png" alt="Homepage" id="FrontImage"></img>
        <div>
          <span className="lobbycodetext">Your Lobby Code:</span><span id="lobbycode">{id}</span>
        </div>
        <br />
        <form>
            <div>
              <img src="./assets/crown.png" alt="Crown" className="icon"/>
              <img src="./assets/playericon.png" alt="Player Icon" className="icon"/>
              <span className="playerlist">Player 1</span> <span className="host">(host)</span>
            </div>
            <div>
              <img src="./assets/playericon.png" alt="Player Icon" className="icon"/>
              <span className="playerlist">Player 2</span>
            </div>
            <div>
              <img src="./assets/playericon.png" alt="Player Icon" className="icon"/>
              <span className="playerlist">Player 3</span>
            </div>
            <div>
              <img src="./assets/playericon.png" alt="Player Icon" className="icon"/>
              <span className="playerlist">Player 4</span>
            </div>
        </form>
        <br />
        <button type="button" id="make-lobby">Start Game</button>
    </div>
  );
}