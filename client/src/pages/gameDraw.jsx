import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./styleDraw.css";

const Canvas = (props) => {
    const colorOptions = ["black", "red","orange","yellow","green","blue", "purple" ]
    const canvasRef = useRef(null)

    const { id, playerid } = useParams();
    const [state, setState] = useState({});

    async function getPlayerWord(gameid, playerid) {
        const response = await fetch('http://localhost:3000/game/'+gameid+'/'+playerid, {
            crossDomain: true,
            method: 'GET'
        }).catch(err => {
            // setHasError(true);
            console.error(err);
            return
        });
        const data = await response.json();
        setState(data);
    }

    async function putCanvas() {
        const canvasData = canvasRef.current.toDataURL();
        const response = await fetch('http://localhost:3000/game/'+id+'/'+playerid +'/canvas', {
            crossDomain: true,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                canvas: canvasData
            }),
        }).catch(err => {
            // setHasError(true);
            console.error(err);
            return
        });
        const data = await response.json();
        console.log(data);
    }

    useEffect(() => {
        getPlayerWord(id, playerid);
    }, [id, playerid]);

    // settings moved to react state
    const [isDrawing, setIsDrawing] = useState(false); //keeps track of whether or not the player is drawing
    const [lineSize, setLineSize] = useState(10); // size of the brush
    const [lineColor, setLineColor] = useState("black"); //color of the brush

    const mouseDownHandler = useCallback((event, canvasContext, canvasBounds) => {
        // have to use a callback here because we need to pass in the canvas context and bounds
        setIsDrawing(true);
        canvasContext.beginPath();
        canvasContext.lineWidth = lineSize;
        canvasContext.strokeStyle = lineColor;
        canvasContext.moveTo(event.clientX - canvasBounds.left, event.clientY-canvasBounds.top);
    }, [lineSize, lineColor]);
 
    const mouseMoveHandler = useCallback((event, canvasContext, canvasBounds) => {
        // same as above
        if (isDrawing){
            canvasContext.lineTo(event.clientX - canvasBounds.left, event.clientY-canvasBounds.top);
            canvasContext.stroke();
        }
    }, [isDrawing]);

    const mouseUpHandler = useCallback((event, canvasContext) => {
        // here we just need the context
        console.log("mouse up")
        setIsDrawing(false);
        canvasContext.closePath();
    }, []);


    useEffect(() => {
        // this runs when the component mounts
        // depends on the handler functions so runs again if they change ig
        const canvas = canvasRef.current
        const canvasContext = canvas.getContext('2d')

        // set default settings
        canvasContext.lineJoin = "round";
        canvasContext.lineCap = "round";
        
        if (state.canvas !== undefined && state.canvas !== "") {
            var img = new Image();
            img.onload = function(){
                canvasContext.drawImage(img,0,0); // Or at whatever offset you like
            };
            img.src = state.canvas;
        }
    }, [state.canvas])

    useEffect(() => {
        const canvas = canvasRef.current
        const canvasBounds = canvas.getBoundingClientRect()
        const canvasContext = canvas.getContext('2d')

        // set handlers
        const mdh_handler = (event, cc, cb) => mouseDownHandler (event, cc, cb)
        const mmh_handler = (event, cc, cb) => mouseMoveHandler(event, cc, cb)
        const muh_handler = (event, cc) => mouseUpHandler (event, cc)
         
        // need the variable so we can unregister it
        const mdh = (event) => mdh_handler(event, canvasContext, canvasBounds);
        const mmh = (event) => mmh_handler(event, canvasContext, canvasBounds);
        const muh = (event) => muh_handler(event, canvasContext);

        // add event listeners
        canvas.addEventListener('mousedown', mdh);
        canvas.addEventListener('mousemove', mmh);
        canvas.addEventListener('mouseup', muh);
        
        return () => {
            // unregister event listeners
            canvas.removeEventListener('mousedown', mdh);
            canvas.removeEventListener('mousemove', mmh);
            canvas.removeEventListener('mouseup', muh);
        };
    }, [mouseDownHandler, mouseMoveHandler, mouseUpHandler]);

    return (
        <div className='draw'>
            <div className = "keyword" id = "theWord">Your word is <b>{state.myWord}</b></div>
            <div className='draw-container'>
                <div className="tool-board" id = "artTools">
                    <div>
                        <p>Color:</p>
                        <select value={lineColor} onChange={(event) => setLineColor(event.target.value)}>
                            {colorOptions.map((color, index) => <option key={index} value={color}>{color}</option>)}
                        </select>
                    </div>
                    <div>
                        <p>Brush size:</p>
                        <input type="range" min="1" max="100" value={lineSize} onChange={(event) => setLineSize(event.target.value)} />
                    </div>
                    <button onClick={putCanvas}>
                        COMMIT
                    </button>
                </div>
                <canvas ref={canvasRef} {...props} className="canvas" id = "drawSpace" width="800" height="600" />
            </div>
        </div>
    );
}

export default Canvas;