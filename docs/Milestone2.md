# Milestone 2

## Division of Labor

Kabeera Singh - Kabeera-Singh : Worked on API

Brandon O'Brien Jones - bobrienjones : Frontend - Homepage, Lobby, Endgame Screen

Robert Washbourne - rawsh : Worked on API

Anthony Marcone - antchamp : Worked on Game Screen: Drawing and Game Screen: Guessing

## Part 0 - API

### Descriptions

Game_ID: Unique id for each game
Player_ID: Unique id for each player
Canvas: PNG/image object to store player drawings
Guesses: Storing the guesses that the player makes
Score: Score for each player

### Operations

GET:
    Game_ID
        Player_ID
            Canvas
            Guesses
            Score

POST:
    Game_ID
        Player_ID
            Canvas
            Guesses
            Score

PUT:
    Canvas
    Guesses
    Score

DELETE:
    Game_ID
        Player_ID
            Canvas
            Guesses
            Score

### Example database

```

{
    "Players":
    [
        {"Player_23":
            [
                {"Game_ID":1239jfiweoj},
                {"Canvas":canvas.png},
                {"Score":21}
            ]
        },
        {"Player_24":
            [
            {"Game_ID":1239jfiweoj},
            {"Guesses":["Guess1","Guess2"...]},
            {"Score":21}
            ]
        }
    ],
    "Game":
    [
        {"1239jfiweoj":
        [
            {"Guesser": "Player_3"},
            {"Drawers": [(list of player ID's)]}
        ]
        
        }
    ]

}
```

## Part 2 - Screenshots and CRUD

