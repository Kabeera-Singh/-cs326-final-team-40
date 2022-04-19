import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./styleGame.css";

export default function Game(props) {
  const { id, playerid } = useParams();
  const [state, setState] = useState([]);
  const [guesses, setGuesses] = useState({});

  async function getGameState(gameid, playerid) {
    await fetch('http://localhost:3000/game/'+gameid+'/'+playerid+'/guesses', {
      crossDomain: true,
      method: 'GET'
    }).then(response => response.json()).then(data => {
      let guessobj = {};
      data.forEach(player => {
        guessobj[player.player] = player.guesses.at(-1);
      });

      setState(data);
      setGuesses(guessobj);
    }).catch(err => {
      // setHasError(true);
      console.error(err);
      alert(err);
    });
  }

  async function saveGuesses() {
    for await (let player of state) {
      if (player.player !== playerid && guesses[player.player] !== player.guesses.at(-1)) {
        await fetch('http://localhost:3000/game/'+id+'/'+playerid+'/guess/'+player.player, {
          crossDomain: true,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guess: guesses[player.player],
          })
        }).then(response => response.json()).then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            getGameState(id, playerid);
          }
        }).catch(err => {
          // setHasError(true);
          console.error(err);
          alert(err);
        });
      }
    }
  }

  async function updateGuess(player, guess) {
    setGuesses({...guesses, [player]: guess});
  }

  useEffect(() => {
    getGameState(id, playerid);
  }, [id, playerid]);

  const EditableGuess = (props) => {
    function selectElementContents(el) {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return (
      <span 
        suppressContentEditableWarning={true}
        contentEditable={true}
        onBlur={e => updateGuess(props.player, e.currentTarget.textContent)}
        onFocus={e => selectElementContents(e.currentTarget)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      >{guesses[props.player]}</span>
    )
  }

  return (
    <div>
      <h1>GameGuesser</h1>
      <div>
        <p>Click on a guess to edit.</p>
        <button onClick={saveGuesses}>SAVE GUESSES</button>
      </div>
      <div className="grid-container" id="allPlayers">
        {state.map((obj,idx) => {
          return (
            <div key={idx} className="grid-item">
              {obj.player === playerid ? <h3>{obj.player}</h3> : 
                obj.correct ? 
                  <h3>{obj.player}: {guesses[obj.player]} (CORRECT)</h3> : 
                  <h3>
                    {obj.player}: <EditableGuess player={obj.player}/>
                  </h3>
              }
              <div id={obj.player} className="playercanvas" style={{
                backgroundImage: `url(${obj.canvas})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}></div>
            </div>
          )
        })}
    </div>

    {/* <div className="scorekeeper" id="scoreboard">
        <h2>CURRENT SCORES:</h2>
        <p>Player 1: _____</p>
        <p>Player 2: _____</p>
        <p>Player 3: _____</p>
        <p>Player 4: _____</p>
        <p>Player 5: _____</p>
        <p>Player 6: _____</p>
    </div> */}
  </div>
  );
}