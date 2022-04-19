import { Link, useNavigate, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./styleCanvas.css";

// const script = document.createElement("script");
// script.src = "../public/scripts/testCanvas.js";
// script.async = true;
// document.body.appendChild(script);

async function setupCanvas(gameid, myWord) {
    if (myWord === "") {
        console.log("my word is blank");
        return;
    }
    console.log("setting up canvas");
    const artTools = document.getElementById("artTools"); // HTMLElement for drawing tools
    const headerText = document.getElementById("theWord"); //HTMLElement for the text at the top to show the word to draw
    let imageURL;

    //draw variables
    const colorOptions = ["black", "red","orange","yellow","green","blue", "purple", "white"]
    let isDrawing; //keeps track of whether or not the player is drawing
    let lineSize = 10;//size of the brush
    let lineColor = "black";//color of the brush
    let topic = myWord; // variable to hold the word that needs to be drawn

    const colorLabel = document.createElement("label");
    colorLabel.appendChild(document.createTextNode("Color:"));

    let colorSelection = document.createElement("select");
    for (let i = 0; i < colorOptions.length; i++){
        let option = document.createElement("option");
        option.value = colorOptions[i];
        option.innerHTML = colorOptions[i];
        colorSelection.appendChild(option);
    }
    colorSelection.classList.add("tool");
    const colorRow = document.createElement("div");
    colorRow.classList.add("tool-input-pair");
    colorRow.appendChild(colorLabel);
    colorRow.appendChild(colorSelection);
    artTools.appendChild(colorRow);

    const sizeLabel = document.createElement("label");
    sizeLabel.appendChild(document.createTextNode("Brush size:"));
    let sizeSelection = document.createElement("input");
    sizeSelection.classList.add("tool");
    sizeSelection.setAttribute("size", "8");
    const sizeRow = document.createElement("div");
    sizeRow.appendChild(sizeLabel);
    sizeRow.appendChild(sizeSelection);
    sizeRow.classList.add("tool-input-pair");
    artTools.appendChild(sizeRow);

    const exportButton = document.createElement("button");
    exportButton.appendChild(document.createElement("label").appendChild(document.createTextNode("COMMIT")));
    artTools.appendChild(exportButton);

    const preludeText = document.createElement("p");
    preludeText.appendChild(document.createTextNode("The word you need to draw is:"));

    const theWord = document.createElement("h1");
    theWord.appendChild(document.createTextNode(topic));

    const headerRow = document.createElement("div");
    headerRow.classList.add("keyword");
    headerRow.appendChild(preludeText);
    headerRow.appendChild(theWord);
    headerText.appendChild(headerRow);

    //variables responsible for the canvas
    const canvasElement = document.getElementById("drawSpace");// HTMLElement for the canvas
    const canvasContext = canvasElement.getContext("2d");//I don't understand why but this is needed to draw on the canvas
    const canvasBounds = canvasElement.getBoundingClientRect(); //Accounts for the canvas being moved by the side bar, needed to draw normally within canvas bounds

    canvasElement.addEventListener("mousedown", function(event){
        isDrawing = true;
        canvasContext.beginPath();
        canvasContext.lineWidth = lineSize;
        canvasContext.strokeStyle = lineColor;
        canvasContext.lineJoin = "round";
        canvasContext.lineCap = "round";
        canvasContext.moveTo(event.clientX - canvasBounds.left, event.clientY-canvasBounds.top);
    });

    canvasElement.addEventListener("mousemove", function(event){
        if (isDrawing === true){
            canvasContext.lineTo(event.clientX - canvasBounds.left, event.clientY-canvasBounds.top);
            canvasContext.stroke();
        }
    });

    canvasElement.addEventListener("mouseup", function(event){
        isDrawing = false;
        canvasContext.closePath();
    });

    colorSelection.addEventListener("change", function(event){
        lineColor = colorSelection.value;
    });

    sizeSelection.addEventListener("input", function(event){
        if( (/^\d+$/).test(sizeSelection.value) === true) {
            lineSize = parseInt(sizeSelection.value);
        }
    });

    exportButton.addEventListener("click", function(event){
        imageURL = canvasElement.toDataURL();

        // call the endpoint to save canvas
        // localhos/game/:game_id/:player_id/canvas'
    });
}


export default function CanvasNew(props){
    // let navigate = useNavigate();
    const { id, playerid } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false); //this helps
    const [myWord, setMyWord] = useState("");

    async function getPlayerWord(gameid, playerid) {
        const response = await fetch('http://localhost:3000/game/'+gameid+'/player/'+playerid, {
            crossDomain: true,
            method: 'GET'
        }).catch(err => {
            console.log(err);
            return;
        });
        const data = await response.json();
        console.log(data);
        setMyWord(data.myWord);
    }

    useEffect(() => {
        setIsLoaded(true);
    }, []);
    
    // call the setup canvas function only once
    useEffect(() => {
        if (isLoaded) {
            setIsPageLoaded(true);
            getPlayerWord(id, playerid);
            setupCanvas(id, myWord);
        }
    }, [isLoaded, id, playerid]);

    return(
        <div> 
            <div className = "keyword" id = "theWord"></div>
            <div className="tool-board" id = "artTools"></div>
            <canvas className="canvas" id = "drawSpace" height = "400" width = "800"></canvas>
        </div>
    );
}