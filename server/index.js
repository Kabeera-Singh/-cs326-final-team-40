import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import { readFile } from 'fs'
import { queryPromise } from './db.js'

// read the wordlist from the file
let wordlist;
const __dirname = dirname(fileURLToPath(import.meta.url));
readFile(join(__dirname, 'wordlist.json'), (err, data) => {
    if (err) throw err;
    wordlist = JSON.parse(data);
});

// express server
const app = express();
const port = process.env.PORT || 3000;
const client_path = join(__dirname, "..", 'client/build');

// express middleware
app.use(cors());
app.use(express.static(client_path));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cors headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// cors headers
app.use("/game/*", function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// postgres helper functions
// see db.js for more info
function getGame(gameID) {
    return queryPromise('SELECT * FROM game WHERE gameguid = $1', [gameID]);
}

function getAllPlayers(gameID) {
    // get all players for a game ordered by name
    return queryPromise('SELECT * FROM player WHERE belongs_to = $1 ORDER BY name', [gameID]);
}

function getPlayer(gameID, playerID) {
    return queryPromise('SELECT * FROM player WHERE (name = $1 AND belongs_to = $2)', [playerID, gameID]);
}


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

// get a specific game by id
app.get('/game/:game_id/playerlist', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getAllPlayers(req.params.game_id).then(pgres => {
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
            const playerguesses = pgres.rows[0].guesses;
            getAllPlayers(req.params.game_id).then(pgres => {
                res.send(pgres.rows.map(row => {
                    // todo: correct
                    const guessesforplayer = playerguesses[row.name] || [];
                    return {
                        player: row.name,
                        canvas: row.canvas,
                        guesses: guessesforplayer,
                        correct: guessesforplayer.at(-1) === row.word
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
                let curr = pgres.rows[0].guesses;
                if (curr[req.params.player_id] === undefined) {
                    curr[req.params.player_id] = [];
                }
                if (curr[req.params.player_id].includes(req.body.guess)) {
                    res.status(400).send({
                        "error": 'You already guessed this word'
                    });
                    return;
                }
                curr[req.params.player_id].push(req.body.guess);
                queryPromise('UPDATE player SET guesses = $1 WHERE (name = $2 AND belongs_to = $3)', [curr, req.params.guesser_id, req.params.game_id]).then(pgres => {
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


app.get('/game/:game_id/score', async (req, res) => {
    getGame(req.params.game_id).then(pgres => {
        if (pgres.rowCount === 0) {
            throw new Error('Game not found');
        }
        getAllPlayers(req.params.game_id).then(pgres => {
            if (pgres.rowCount === 0) {
                throw new Error('No players in game');
            }
            let scores = {}
            for (let target of pgres.rows) {
                for (let guesser of pgres.rows) {
                    if (guesser.name == target.name) {
                        continue;
                    }
                    if (scores[target.name] === undefined) {
                        scores[target.name] = 0;
                    }
                    if (guesser.guesses[target.name]) {
                        for (let guess of guesser.guesses[target.name]) {
                            if (target.word !== guess) {
                                scores[target.name] -= 10;
                            } else {
                                scores[target.name] += 100;
                            }
                        }
                    }
                }
            }

            let score_lst = [];
            for (let player of pgres.rows) {
                score_lst.push({
                    player: player.name,
                    score: scores[player.name]
                });
            }
            
            // find player with largest score
            let max_score = -100;
            let max_player = score_lst[0].player;
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

app.get(["/:game_id/:player_id/(|lobby|draw|guess)", "/:game_id/score"], (req, res) => {
    res.sendFile(join(client_path, 'index.html'));
});

// doesnt match any route
app.use((req, res) => {
    // res.sendFile(join(client_path, 'index.html'));
    res.status(404).send({
        "error": 'Not found'
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
