const artTools = document.getElementById("artTools"); // HTMLElement for drawing tools
const canvasElement = document.getElementById("drawSpace");// HTMLElement for the canvas
const canvasContext = canvasElement.getContext("2d");//I don't understand why but this is needed to draw on the canvas
const canvasBounds = canvasElement.getBoundingClientRect(); //Accounts for the canvas being moved by the side bar, needed to draw normally within canvas bounds

//draw variables
const colorOptions = ["black", "red","orange","yellow","green","blue", "purple" ]
let isDrawing; //keeps track of whether or not the player is drawing
let lineSize = 10;//size of the brush
let lineColor = "black";//color of the brush



const colorLabel = document.createElement("label");
colorLabel.appendChild(document.createTextNode("Color:"))
let colorSelection = document.createElement("select");
for (let i = 0; i < colorOptions.length; i++){
    let option = document.createElement("option");
    option.value = colorOptions[i];
    option.innerHTML = colorOptions[i];
    colorSelection.appendChild(option);
}
artTools.appendChild(colorLabel);
artTools.appendChild(colorSelection);

const sizeLabel = document.createElement("label");
sizeLabel.appendChild(document.createTextNode("Brush size:"))
let sizeSelection = document.createElement("input");

artTools.appendChild(sizeLabel);
artTools.appendChild(sizeSelection);







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

