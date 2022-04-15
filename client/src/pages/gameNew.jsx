export default function GameNew(props) {
  return (
    <div>
      <h1>Welcome to Skrauwl.io</h1>
      <img src="./assets/skrawlpic.png" alt="Homepage" id="FrontImage"/>
      <div>
          <label for="name">Nickname:</label>
          <input type="text" id="nickname" autocomplete="off" />
      </div>
      <br/>
      <button type="button" id="make-lobby">Create Lobby</button>
      <br/>
      <br/>
      <span>OR</span>
      <br/>
      <br/>
      <label for="lobbyname">Enter Game Code</label>
      <br/>
      <input type="text" id="lobbyname" autocomplete="off" />
      <br/>
      <button type="button" id="join-lobby">Join</button>
    </div>
  );
}