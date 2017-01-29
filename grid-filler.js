"use strict";

let ctx;
let canvas;
let grid;
let squareSize = 25;
let nbColumns;
let nbLines;
let keyCurrentlyDown = new Set();
let currX;
let currY;

let privateEnum = {
	empty: 0,
	border: 1,
	inner: 2
};

window.addEventListener('load', function() {
	screen.mozlockOrientation = "landscape-secondary";

	// Get man canvas
	canvas = document.getElementById("grid-filler");
	if (!canvas) {
		alert("Impossible to get the main canvas");
		return;
	}

	ctx = canvas.getContext("2d");
	if (!ctx) {
		alert("Impossible to get context of canvas");
		return;
	}

	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	canvas.width = screenWidth;
	canvas.height = screenHeight;

	canvas.focus();
	addEvents();
	initGrid();
	drawGrid();
});

function addEvents()
{
	canvas.addEventListener("mousemove", mousemoveHandler, false);
	canvas.addEventListener("keydown", keydownHandler, false);
	canvas.addEventListener("keyup", keyupHandler, false);
}

function mousemoveHandler(event)
{
	currX = event.pageX;
	currY = event.pageY;
	if (keyCurrentlyDown.has(32)) { // space
		setBorderIfNeeded(event.pageX, event.pageY);
	} else if (keyCurrentlyDown.has(73)) { // i
		setInner(event.pageX, event.pageY);
	}
}

function keydownHandler(event)
{
	// prevent backspace key from navigating back
	if (event.keyCode === 8) {
		event.preventDefault();
	}
	console.log("add: " + (event.keyCode + event.charCode));
	keyCurrentlyDown.add(event.keyCode + event.charCode);
	let fakeEvent = {pageX: currX, pageY: currY};
	mousemoveHandler(fakeEvent);
}

function keyupHandler(event)
{
	// prevent backspace key from navigating back
	if (event.keyCode === 8) {
		event.preventDefault();
	}
	console.log("delete: " + (event.keyCode + event.charCode));
	keyCurrentlyDown.delete(event.keyCode + event.charCode);	
}

function setBorderIfNeeded(x, y) {
	let column = Math.floor(x / squareSize);
	let line = Math.floor(y / squareSize);
	if (grid[line*nbColumns + column] !== privateEnum.border) {
		console.log("coord [" + line + "," + column + "] is now a border");
		grid[line*nbColumns + column] = privateEnum.border;
		drawGrid();
	}
}

function setInner(x, y)
{
	let column = Math.floor(x / squareSize);
	let line = Math.floor(y / squareSize);
	grid[line*nbColumns + column] = privateEnum.inner;
	drawGrid();
}

function initGrid()
{
	nbColumns = Math.floor(canvas.width / squareSize);
	nbLines = Math.floor(canvas.height / squareSize);
	grid = new Int8Array(nbColumns*nbLines);
	for (let i = 0; i < nbColumns; i++) {
		for (let j = 0; j < nbLines; j++) {
			grid[j*nbColumns + i] = privateEnum.empty;
		}
	}
}

function drawGrid()
{
	ctx.save();
	ctx.translate(0.5, 0.5);
	let width = nbColumns * squareSize;
	let height = nbLines * squareSize;

	drawSqares(privateEnum.empty, "#CCCCCC");
	drawSqares(privateEnum.border, "#AAAACC");
	drawSqares(privateEnum.inner, "#AACCAA");

	ctx.strokeStyle = "#000000";
	// -1 because of translation of 0.5
	for (let i = 0; i <= width; i += squareSize) {
		ctx.strokeRect(i, 0, 0, height);
	}
	for (let j = 0; j <= height; j += squareSize) {
		ctx.strokeRect(0, j, width, 0);
	}
	ctx.restore();
}

function drawSqares(type, color)
{
	ctx.fillStyle = color;
	for (let i = 0; i < nbColumns; i++) {
		for (let j = 0; j < nbLines; j++) {
			if (grid[j*nbColumns+i] === type) {
				ctx.fillRect(i*squareSize, j*squareSize, squareSize, squareSize);
			}
		}
	}
}

function clearGrid()
{
	for (let i = 0; i < nbColumns; i++) {
		for (let j = 0; j < nbLines; j++) {
			grid[j*nbColumns+i] = privateEnum.empty;
		}
	}
	drawGrid();
}
