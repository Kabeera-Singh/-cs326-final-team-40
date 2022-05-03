# Milestone 3

## Division of Labor

Robert Washbourne - rawsh: Worked on adding Postgres to Heroku & init script, db.js connection with rollback and commit, refactoring the backend with SQL queries and promises

## Part 0 - API

### Descriptions

```
Game_ID: Unique id for each game
Player_ID: Unique id for each player
Canvas: PNG/image object to store player drawings
Guesses: Storing the guesses that the player makes
Score: Score for each player
```

### Operations

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