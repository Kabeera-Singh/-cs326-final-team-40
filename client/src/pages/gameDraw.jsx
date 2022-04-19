import React, { useRef, useState, useEffect, useCallback } from 'react';
import "./styleDraw.css";

const Canvas = (props) => {
    const colorOptions = ["black", "red","orange","yellow","green","blue", "purple" ]
    const canvasRef = useRef(null)

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
        console.log('binding')
        // this runs when the component mounts
        // depends on the handler functions so runs again if they change ig
        const canvas = canvasRef.current
        const canvasContext = canvas.getContext('2d')
        const canvasBounds = canvas.getBoundingClientRect()

        // set default settings
        canvasContext.lineJoin = "round";
        canvasContext.lineCap = "round";

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
        
        // Do some work...
        
        // Then later in the code, clean up
        
        return () => {
            // unregister eventListener once
            canvas.removeEventListener('mousedown', mdh);
            canvas.removeEventListener('mousemove', mmh);
            canvas.removeEventListener('mouseup', muh);
        };
    }, [mouseDownHandler, mouseUpHandler, mouseMoveHandler])

    return (
        <div className='draw'>
            <div id="controls">
                <p>Color:</p>
                <select value={lineColor} onChange={(event) => setLineColor(event.target.value)}>
                    {colorOptions.map((color, index) => <option key={index} value={color}>{color}</option>)}
                </select>
                <p>Brush size:</p>
                <input type="range" min="1" max="100" value={lineSize} onChange={(event) => setLineSize(event.target.value)} />
            </div>

            <canvas ref={canvasRef} {...props} className="canvas" id="canvas" width="800" height="600" />
        </div>
    );
}

export default Canvas;