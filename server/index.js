import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import { readFile } from 'fs'
import { queryPromise } from './db.js'

// old json db
// import { join, dirname } from 'path'
// import { Low, JSONFile } from 'lowdb'

// // Use JSON file for storage
// const file = join(__dirname, 'db.json')
// const adapter = new JSONFile(file)
// const db = new Low(adapter)
// // set default data
// await db.read();
// db.data ||= { games: [] }


// read the wordlist from the file
let wordlist;
const __dirname = dirname(fileURLToPath(import.meta.url));
readFile(join(__dirname, 'wordlist.json'), (err, data) => {
    if (err) throw err;
    wordlist = JSON.parse(data);
});

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

app.get('/games', async (req, res) => {
    const games = await query('SELECT * FROM game');
    res.send(games.rows);
});

// create a new game
app.post('/newgame', async (req, res) => {
    const myid = nanoid();
    queryPromise('INSERT INTO game (gameguid) VALUES ($1)', [myid]).then(pgres => {
        res.send({
            gameID: myid,
        });
    }).catch(err => {
        console.log(err);
        res.send({
            "error": err.message
        });
    });
});

function getGame(gameID) {
    return queryPromise('SELECT * FROM game WHERE gameguid = $1', [gameID]);
}

function getGamePlayers(gameID) {
    return queryPromise('SELECT * FROM player WHERE belongs_to = $1', [gameID]);
}

function getAllPlayers(gameID) {
    return queryPromise('SELECT * FROM player WHERE belongs_to = $1', [gameID]);
}

function getPlayer(gameID, playerID) {
    return queryPromise('SELECT * FROM player WHERE (name = $1 AND belongs_to = $2)', [playerID, gameID]);
}

// get a specific game by id
app.get('/game/:game_id/playerlist', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getGamePlayers(req.params.game_id).then(pgres => {
            res.send(pgres.rows.map(row => {
                return row.name;
            }));
        }).catch(err => {
            console.log(err);
            res.status(404).send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
});

// get the game state for a specific game id and player id
app.get('/game/:game_id/:player_id/state', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getPlayer(req.params.game_id, req.params.player_id).then(pgres => {
            if (pgres.rowCount === 0) {
                throw new Error('Player not found');
            }
            res.send(pgres.rows[0]);
        }).catch(err => {
            res.status(404).send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
});

// add a player to a game
app.post('/game/:game_id/:player_id/join', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getPlayer(req.params.game_id, req.params.player_id).then(pgres => {
            if (pgres.rowCount === 0) {
                const new_word = wordlist[Math.floor(Math.random() * wordlist.length)];
                queryPromise('INSERT INTO player (playerguid, name, belongs_to, word, guesses) VALUES ($1, $2, $3, $4, $5)', [nanoid(), req.params.player_id, req.params.game_id, new_word, []]).then(pgres => {
                    res.send({
                        "success": true
                    });
                }).catch(err => {
                    res.send({
                        "error": err.message
                    });
                });
            } else {
                throw new Error('Player already exists');
            }
        }).catch(err => {
            res.send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
});

// update the canvas for a specific game id and player id
app.put('/game/:game_id/:player_id/canvas', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getPlayer(req.params.game_id, req.params.player_id).then(pgres => {
            if (pgres.rowCount === 0) {
                throw new Error('Player not found');
            }
            queryPromise('UPDATE player SET canvas = $1 WHERE (name = $2 AND belongs_to = $3)', [req.body.canvas, req.params.player_id, req.params.game_id]).then(pgres => {
                res.send({
                    "success": true
                });
            }).catch(err => {
                res.send({
                    "error": err.message
                });
            });
        }).catch(err => {
            res.send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
});

// get all canvases + guesses for a specific player
app.get('/game/:game_id/:guesser_id/guesses', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getPlayer(req.params.game_id, req.params.guesser_id).then(pgres => {
            if (pgres.rowCount === 0) {
                throw new Error('Player not found');
            }
            const playerword = pgres.rows[0].word;
            getAllPlayers(req.params.game_id).then(pgres => {
                res.send(pgres.rows.map(row => {
                    return {
                        player: row.name,
                        canvas: row.canvas,
                        guesses: row.guesses,
                        correct: row.guesses.at(-1) == playerword
                    };
                }));
            }).catch(err => {
                res.send({
                    "error": err.message
                });
            });
        }).catch(err => {
            res.send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
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
    if (req.params.guesser_id == req.params.player_id) {
        res.status(400).send({
            "error": 'You cannot guess your own word'
        });
        return;
    }
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getPlayer(req.params.game_id, req.params.guesser_id).then(pgres => {
            if (pgres.rowCount === 0) {
                throw new Error('Guesser not found');
            }
            if ("guess" in req.body) {
                if(pgres.rows[0].guesses.includes(req.body.guess)) {
                    res.status(400).send({
                        "error": 'You have already guessed this word'
                    });
                    return;
                }
                queryPromise('UPDATE player SET guesses = array_append(guesses, $1) WHERE (name = $2 AND belongs_to = $3)', [req.body.guess, req.params.player_id, req.params.game_id]).then(pgres => {
                    res.send({
                        "success": true
                    });
                }).catch(err => {
                    res.send({
                        "error": err.message
                    });
                });
            } else {
                res.status(400).send({
                    "error": 'Guess not in body'
                });
                return;
            }
        }).catch(err => {
            res.send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
});

/**
 * Example of a POST request
 * http://localhost:3000/game/YCMimdY444TBHKc5zArTb/score
 * 
 * Takes in a game id and returns a score for each player
 * Score Calculation:
 *  - If the player guesses the word, they get a 100 points
 *  - For every wrong guess the player loses 10 points
 */
app.get('/game/:game_id/score', async (req, res) => {
    await db.read();
    const game = db.data.games.find(game => game.gameID == req.params.game_id);
    let score_lst = [];
    if (game) {
        const players = Object.keys(game.players);
        if (players.length === 0) {
            res.status(404).send('No players in game');
            return;
        }
        for (let player of players) {
            console.log(player);
            let score = 0;
            for (let target of Object.keys(game.players[player].guesses)) {
                let canvas_score = 0;
                for (let guess of game.players[player].guesses[target]) {
                    if (guess !== game.words[target]) {
                        canvas_score -= 10;
                    }
                    else if (guess === game.words[target]) {
                        canvas_score += 100;
                        break;
                    }
                }
                score += canvas_score;
            }
            score_lst.push({"player": player, "score": score}); 
        }
        // find player with largest score
        let max_score = 0;
        let max_player = players[0];
        for (let player of score_lst) {
            if (player.score > max_score) {
                max_score = player.score;
                max_player = player.player;
            }
        }
        let myres = {
            "scores": score_lst,
            "winner": max_player
        }
        res.send(myres);
    } else {
        res.status(404).send('Game not found');
    }
});

// delete the game for a specific game id
app.delete('/game/:game_id', (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        queryPromise('DELETE FROM game WHERE game_id = $1', [req.params.game_id]).then(pgres => {
            res.send({
                "success": true
            });
        }).catch(err => {
            res.send({
                "error": err.message
            });
        });
    }).catch(err => {
        res.status(404).send({
            "error": err.message
        });
    });
});

// doesnt match any route
app.use((req, res) => {
    res.status(404).send({
        "error": 'Not found'
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
