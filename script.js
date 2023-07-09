const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const shareBtn = document.getElementById('shareBtn');
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const ctx = canvas.getContext("2d");
const brushWidthRange = document.getElementById("brush-width-range");
const eraseBtn = document.getElementById("erase-btn");
const resetBtn = document.getElementById("reset-btn");
const textInput = document.querySelector("#text-input");
const textBtn = document.querySelector("#textBtn");
const fontSizeInput = document.getElementById("font-size-input");
const fontColorInput = document.getElementById("font-color-input");
const fontStyleInput = document.getElementById("font-style-input");
const imageUploadInput = document.getElementById("image-upload");
const imageWidthInput = document.getElementById("image-width");
const imageHeightInput = document.getElementById("image-height");
const loadImageBtn = document.getElementById("load-image-btn");
const lineShape = document.getElementById("line");

let uploadedImage = null;

let isTextMode = false;

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";
let fontSize = fontSizeInput.value;
let fontColor = fontColorInput.value;
let fontStyle = fontStyleInput.value;

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

lineShape.addEventListener("click", selectLine);
// Function to handle line shape selection
function selectLine() {
    // Remove any existing active class from other shapes
    const activeShapes = document.querySelectorAll(".option.tool.active");
    activeShapes.forEach((shape) => shape.classList.remove("active"));

    // Add active class to the line shape
    lineShape.classList.add("active");

    // Set the current drawing tool to "line"
    currentTool = "line";
}


const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const drawLine = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = 4;
    fillColor.checked ?  ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}


const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else if(selectedTool === "triangle"){
        drawTriangle(e);
    }else{
        drawLine(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});


shareBtn.addEventListener('click', () => {
    // Your share functionality goes here
    // You can use the Web Share API or any other sharing mechanism
    // For example, using the Web Share API:
    if (navigator.share) {
        navigator.share({
            title: 'My Drawing',
            text: 'Check out my amazing drawing!',
            url: window.location.href
        })
        .then(() => console.log('Sharing successful.'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        console.log('Sharing is not supported in this browser.');
    }
});

// create an array to store drawing states
const undoStack = [];
const redoStack = [];

function endDrawing() {
    isDrawing = false;
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoStack.length = 0; // Clearing the redo stack
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    }
}  

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    }
}  

// add event listeners to undo and redo buttons
undoBtn.addEventListener("click", () => {
    undo();
});

redoBtn.addEventListener("click", () => {
    redo();
});


fontSizeInput.addEventListener("input", () => {
    fontSize = fontSizeInput.value;
    redrawCanvas();
});

fontColorInput.addEventListener("input", () => {
    fontColor = fontColorInput.value;
    redrawCanvas();
});

fontStyleInput.addEventListener("input", () => {
    fontStyle = fontStyleInput.value;
    redrawCanvas();
});

textBtn.addEventListener("click", () => {
    isTextMode = true;
    textInput.focus();
    redrawCanvas();
});

textInput.addEventListener("input", () => {
    if (isTextMode) {
        redrawCanvas();
    }
});

textInput.addEventListener("keydown", (e) => {
    if (isTextMode && e.key === "Enter") {
        isTextMode = false;
        textInput.blur();
        endDrawing();
    }
});


function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(snapshot, 0, 0);
    if (isTextMode) {
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillStyle = fontColor;
        ctx.fillText(textInput.value, prevMouseX, prevMouseY);
    }
}

imageUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

loadImageBtn.addEventListener("click", () => {
    const width = parseInt(imageWidthInput.value);
    const height = parseInt(imageHeightInput.value);
    if (uploadedImage && width && height) {
        const x = (canvas.width - width) / 2; // Calculate the x position to center the image
        const y = (canvas.height - height) / 2; // Calculate the y position to center the image
        ctx.drawImage(uploadedImage, x, y, width, height);
    }
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDrawing);