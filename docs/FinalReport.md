<h1>Team 40 final report</h1>
<h2>Project name: Skrawl</h2>
<h3>Spring 2022</h3>
<h3>Team members</h3>
<ul>
    <li>Kabeera Singh - Kabeera-Singh</li>
    <li>Brandon O'Brien Jones - bobrienjones</li>
    <li>Robert Washbourne - rawsh</li>
    <li>Anthony Marcone - antchamp</li>
</ul>
<br>

<h4>Overview</h4>
<p> Our goal with Skrawl was to make a fun new game that takes inspiration from Skribbl.io, a popular online game in which groups of players take turns having one person draw a random word and having the other players guess what the drawing is supposed to resemble. We wanted to keep the core idea of drawing and guessing, but make a significant change to the structure of the game by having all of the players being both drawers and guessers within around.</p>

<br>
<h4>User interface</h4>
<p>Here are all of the UI views in out application and the purpose they serve</p>
<ol>
    <li>Home page - the page that the application brings up when first launched. Here, players will select the nickname they want to designate them by entering it in the corresponding bar. Then they are given the choice to press the "Create Lobby" button to generate a game code, or to enter one below to join an existing game. </li>
    <br>
    <img src = Homepage.png></img>
    <br>
    <li>Lobby page - After either creating a new game or entering a game code for an existing lobby, players will be brought to this page where they can see all of the players currently in the same lobby. When players are ready, they can hit the "Start game" button to begin playing.</li>
    <br>
    <img src = Lobby_Page.png></img>
    <br>
    <li>Drawing page - Once the game has begun, players are brought here and are given a random concept which they will have to try their best to draw. Players are able to draw by clicking, holding, and dragging their mouse within the bounds of the canvas. To better help them draw their ideas, players can adjust the size of their brush or change its color. When they feel they are satisfied, players press the "Commit" button to lock in their drawings and advance to the last part of the game.</li>
    <br>
    <img src = Drawing_Screen.png></img>
    <br>
    <li>Guessing page - Here players can see all of the complete drawings from players. Players are also able to write out what they think each picture depicts, aside from the one they drew themselves. Players can lock in their guesses and are told if they guessed correctly for each canvas. Afterwards they can click on "End game" to move to the last page, the score screen.</li>
    <br>
    <img src = Guessing_Screen.png></img>
    <br>
    <li>Score page - here players can see how each player scored, and who has the highest score marking them as the winner of the game. From here players are also able to press the "New game" button to start a new lobby if they so choose.</li>
    <br>
    <img src = Score_Screen.png></img>
    <br>
</ol>
<h4>API</h4>
<h4>Descriptions</h4>

```
Game_ID: Unique id for each game
Player_ID: Unique id for each player
Canvas: PNG/image object to store player drawings
Guesses: Storing the guesses that the player makes
Score: Score for each player
```

<h4>Operations</h4>

```
POST:
    New Game -> uuid:
        Creates a new game and returns the game_id
    Join Game (name, game_id):
        Creates a new player with name and joins the game with id game_id
PUT:
    Update Canvas (name, game_id, canvas):
        Updates the canvas for the player
    Update Guesses (name, game_id, guess):
        Updates the guesses for the player
GET:
    Get Playerlist (game_id) -> names[]:
        Returns the list of players for a game with id game_id
    Get Player (name, game_id) -> player:
        Returns the game state for a player
    Get Scores (game_id) -> {scores:[], winner: ""}:
        Returns the score for all players, and also returns the winner
DELETE:
    Delete Game (game_id):
        Deletes the game by ID
```

<h4>Database</h4>
<h5>Here is a representation of our postgres database:</h5>

```javascript
{
    games: [
        {
            gameguid: "iwQbLzGLJPc1agMN5_N8_"
        },
        ...
    ],
    players: [
        {
            playerguid: "VWxQ1IdVqG438UJbh9V0N",
            belongs_to: "iwQbLzGLJPc1agMN5_N8_",
            name: "The Zuck",
            canvas: "",
            guesses: [{
                "player2": ["anvil", ...]
            }]
        },
    ]
}

```
<ul> 
    <li> Games: a dictionary of strings that identidy individual game lobbies </li>
    <li> Players: a list of objects that contain:
        <ul>
            <li> Playerguid: an identification string for each player</li>
            <li> Belongs_to: the identification string of the lobby the player is in</li>
            <li> Name: the nickname the player chose at the lobby screen</li>
            <li>Canvas: the dataURL for the picture the player draws on the drawing screen </li>
            <li> Guesses: a dictionary of players, with player identification as the keys and the values as a list of guesses the player has made about their drawings  </li>
        </ul>
    </li>
</ul>

<h4>Division of labor</h4>
<ul>
<li> Kabeera Singh - Initial project design, initial concept of lobby page and home page, assisted with API endpoints, database, and heroku implementation</li>
<li> Brandon O'Brien Jones - Initial project design, intial concept of guesser perspective, canvas implementation, final design for home page, lobby, and end screen, minor API assistance </li>
<li> Robert Washbourne - Initial concept of drawing screen, final design of drawing and guessing pages, front end connection, minor database assistance</li>
<li> Anthony Marcone - Intial concept of end screen, assisted with API endpoints, setting up node, connection to front end, database creation and SQL implementation</li>
</ul>
<h5>Note: the live share VScode extension was used for the purpose of cooperative coding. As such, github commits may contain the work of multiple people. This is our recollection of the labor distribution</h5>

<h4>Conclusion</h4>
<p> Overall, this was an interesting and fun experience to work on a web program from concept to implemenation as a group. The most important takeaway from the design process would probably be make sure you have an alternate solution before you start to work. This stretches back to the beginning of the project when we were first thinking about what we wanted to do, and how we would design the game asynchronusly if we couldn't make it synchronus. This also caused a few problems in the middle of the project when we build parts assuming we would have another part work in a particular way, but could not get it to work. Ultimately if we were going to do this again we would want to have a better grasp on what we would know by the end, as trying to design a project while uncertain about how well you can execute key aspects is a less than fun experience. </p>


<h4>Our proposed final rubric:</h4>
<img src = FinalRubric.png></img>