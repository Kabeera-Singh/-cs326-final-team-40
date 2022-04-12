import { nanoid } from 'nanoid'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low, JSONFile } from 'lowdb'
import express from 'express'
import { readFile } from 'fs'

// Use JSON file for storage
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// read the wordlist from the file
let wordlist;
readFile(join(__dirname, 'wordlist.json'), (err, data) => {
    if (err) throw err;
    wordlist = JSON.parse(data);
});

// set default data
await db.read();
db.data ||= { games: [] }

// express server
const app = express();
const port = 3000;
app.use(express.static('public'));

// later: use socket.io for the realtime connection
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
app.post('/newgame', async (req, res, next) => {
    // create ids for the game and start players empty
    const newgame = {
        gameID: nanoid(),
        players: {},
        words: {},
    }
    try {
        db.data.games.push(newgame);
        await db.write();
        res.send(newgame.players);
    } catch (error) {
        return next(error);
    }
});

// get a specific game by id
app.get('/game/:game_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        res.send(game.players);
    } else {
        res.status(404).send('Game not found');
    }
});

// add a player to a game
app.post('/game/:game_id/:player_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        // get a random word for this player to draw
        const random_word = wordlist[Math.floor(Math.random() * wordlist.length)];
        const newplayer = {
            canvas: "",
            guesses: []
        }
        game.players[req.params.player_id] = newplayer;
        game.words[req.params.player_id] = random_word;
        await db.write();
        res.send(newplayer);
    } else {
        res.status(404).send('Game not found');
    }
});

// get the game state for a specific game id and player id
app.get('/game/:game_id/:player_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        const player = game.players[req.params.player_id];
        if (player) {
            res.send(player);
        } else {
            res.status(404).send('Player not found');
        }
    } else {
        res.status(404).send('Game not found');
    }
});

// update the canvas for a specific game id and player id
app.put('/game/:game_id/:player_id/canvas', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        const player = game.players[req.params.player_id];
        if (player) {
            player.canvas = req.body.canvas;
            await db.write();
            res.send(player);
        } else {
            res.status(404).send('Player not found');
        }
    } else {
        res.status(404).send('Game not found');
    }
});

// update the guesses for a specific game id and player id
app.put('/game/:game_id/:player_id/guess', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        const player = game.players[req.params.player_id];
        if (player) {
            player.guesses.push(req.body.guess);
            await db.write();
            res.send(player);
        } else {
            res.status(404).send('Player not found');
        }
    } else {
        res.status(404).send('Game not found');
    }
});

app.get('/game/:game_id/score', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        let numCorrect = {};
        for (let player in game.players) {
            res[player] = game.players[player].guesses.map(guess => {
                return game.words[player] === guess ? 1 : 0;
            }).reduce((a, b) => a + b);
        }
        res.send(numCorrect);
    } else {
        res.status(404).send('Game not found');
    }
});

// delete the game for a specific game id
app.delete('/game/:game_id', (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        db.data.games.remove(game);
        db.write();
        res.send(game.players);
    } else {
        res.status(404).send('Game not found');
    }
});

// doesnt match any route
app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(port, () => console.log(`Listening on port ${port}`));