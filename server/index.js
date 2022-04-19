import { nanoid } from 'nanoid'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low, JSONFile } from 'lowdb'
import { readFile } from 'fs'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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
        res.send(newgame);
    } catch (error) {
        return next(error);
    }
});

// get a specific game by id
app.get('/game/:game_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        res.send(Object.keys(game.players));
    } else {
        res.status(404).send('Game not found');
    }
});

// add a player to a game
app.post('/game/:game_id/join/:player_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID === req.params.game_id);
    const player = game.players[req.params.player_id];
    if (player) {
        res.status(400).send('Player already exists');
    }
    else if (game) {
        // get a random word for this player to draw
        const random_word = wordlist[Math.floor(Math.random() * wordlist.length)];
        const newplayer = {
            canvas: "",
            guesses: {}
        }
        newplayer.myWord = random_word;
        game.players[req.params.player_id] = newplayer;
        game.words[req.params.player_id] = random_word;
        await db.write();
        res.send(newplayer);
    } else {
        res.status(404).send('Game not found');
    }
});

// get the game state for a specific game id and player id
app.get('/game/:game_id/player/:player_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        const player = Object.assign({}, game.players[req.params.player_id]); // copy the object
        if (player) {
            player.myWord = game.words[req.params.player_id];
            res.send(player);
        } else {
            res.status(404).send('Player not found');
        }
    } else {
        res.status(404).send('Game not found');
    }
});

// update the canvas for a specific game id and player id
app.put('/game/:game_id/player/:player_id/canvas', async (req, res) => {
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

/**
 * Example of a POST request
 * http://localhost:3000/game/:game_id/:guesser_id/guess/:player_id
 * Body:
 *  {"guess": "word"}
 * 
 * Takes in a game id, two player id's (guesser and player), and a guess
 * Adds the guess to the guess list for the player and returns the updated player
 */
app.put('/game/:game_id/:guesser_id/guess/:player_id', async (req, res) => {
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        if (req.params.guesser_id == req.params.player_id) {
            res.status(400).send('You cannot guess your own word');
            return;
        }
        const guesser = game.players[req.params.guesser_id];
        const player = game.players[req.params.player_id];

        if (guesser && player) {
            const reqbody = req.body;
            const curr_guesses = guesser.guesses[req.params.player_id] ?? [];
            if ("guess" in reqbody) {
                if(curr_guesses.includes(reqbody.guess)) {
                    res.status(400).send('You have already guessed this word');
                    return;
                }
                curr_guesses.push(reqbody.guess);
                guesser.guesses[req.params.player_id] = curr_guesses;
            } else {
                res.status(400).send('Guess not in body');
                return;
            }
            await db.write();
            res.send(guesser);
        } else {
            res.status(404).send('Player not found');
        }
    } else {
        res.status(404).send('Game not found');
    }
});

/**
 * Example of a POST request
 * http://localhost:3000/game/YCMimdY444TBHKc5zArTb/abc/score
 * 
 * Takes in a game id, and player id and returns a score 
 * Score Calculation:
 *  - If the player guesses the word, they get a 100 points
 *  - For every wrong guess the player loses 10 points
 */
 app.get('/game/:game_id/:player_id/score', async (req, res) => {
    await db.read();
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    if (game) {
        const player = game.players[req.params.player_id];
        let score = 0;
        if (player) {
            for (let target of Object.keys(player.guesses)) {
                let canvas_score = 0;
                for (let guess of player.guesses[target]) {
                    if (guess !== game.words[target]) {
                        canvas_score -= 10;
                    }
                    else if (guess === game.words[target]) {
                        canvas_score +=100;
                        break;
                    }
                }
                score += canvas_score;
            }
            res.send(score.toString());
        } else {
            res.status(404).send('Player not found');
        }
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