# Milestone 2

## Division of Labor

Kabeera Singh - Kabeera-Singh : Worked on API endpoints and database.

Brandon O'Brien Jones - bobrienjones : Frontend - Homepage, Lobby, Endgame Screen

Robert Washbourne - rawsh : Worked on API, setting up node, and connection to frontend.

Anthony Marcone - antchamp : Worked on Game Screen: Drawing and Game Screen: Guessing.

## Part 0 - API

### Descriptions

Game_ID: Unique id for each game
Player_ID: Unique id for each player
Canvas: PNG/image object to store player drawings
Guesses: Storing the guesses that the player makes
Score: Score for each player

### Operations

Post:
    New Game:
        Creates a new game and returns the game_id
    New Player:
        Creates a new player and returns the player_id
PUT:
    Update Canvas:
        Updates the canvas for the player
    Update Guesses:
        Updates the guesses for the player
GET:
    Get Game:
        Returns the game by ID
    Get Player:
        Returns the game state for a player
    Get Words:
        Returns the words for the player
    Get Score:
        Returns the score for all players, and also returns the winner
DELETE:
    Delete Game:
        Deletes the game by ID

### Example database

```javascript

{
    games: [
        {
            game_id: 1,
            players: {
                "player_1": {
                    "canvas": (png to string),
                    "guesses": [
                        {"abc": ["cat","dog","mouse"]},
                        {"def": ["cheese","apple","potato"]}
                    ], 
                }
                "player_2": {
                    "canvas": (png to string),
                    "guesses": [
                        {"abc": ["cat","dog","mouse"]},
                        {"def": ["cheese","apple","potato"]}
                    ], 
                }
                "abc": {
                    "canvas": (png to string),
                    "guesses": [
                        {"player_1": ["cat","dog","mouse"]},
                        {"def": ["cheese","apple","potato"]}
                    ], 
                }
            }
            words: {
        billu1: "tangerine",
        billu2: "river",
        billu3: "space suit"
      }
        },
    ]
}
```

## Part 2 - Screenshots and CRUD

![Homepage](Homepage.png)
![Lobby Page](Lobby_Page.png)
![Drawing Screen](Drawing_Screen.png)
![Guessing SCreen](Guessing_Screen.png)
![Score Screen](Score_Screen.png)
