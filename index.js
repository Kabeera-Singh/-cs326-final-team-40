// express server
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

// use socket.io for the realtime connection


// ### Operations
// Game_ID: Unique id for each game
// Player_ID: Unique id for each player
// Canvas: PNG/image object to store player drawings
// Guesses: Storing the guesses that the player makes
// Score: Score for each player
// GET:
//     Game_ID
//         Player_ID
//             Canvas
//             Guesses
//             Score
// POST:
//     Game_ID
//         Player_ID
//             Canvas
//             Guesses
//             Score
// PUT:
//     Canvas
//     Guesses
//     Score
// DELETE:
//     Game_ID
//         Player_ID
//             Canvas
//             Guesses
//             Score

// create a new game
app.post('/game', (req, res) => {
    // create ids for the game and start players empty

});

// get the game state for a specific game id and player id
app.get('/:game_id/:player_id', (req, res) => {
    res.send('Hello World!');
});

// update the canvas for a specific game id and player id
app.put('/:game_id/:player_id/canvas', (req, res) => {
    res.send('Hello World!');
});

// update the guesses for a specific game id and player id
app.put('/:game_id/:player_id/guesses', (req, res) => {
    res.send('Hello World!');
});

// delete the game for a specific game id
app.delete('/:game_id', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));