"use strict";

let ctx;
let canvas;
let grid;
let squareSize = 15;
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
	let eventCode = event.keyCode + event.charCode;
	if (eventCode === 13) {
		fillGrid();
		return;
	}

	console.log("add: " + eventCode);
	keyCurrentlyDown.add(eventCode);
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

function fillGrid()
{
	console.log("Start filling grid");
	let toExplore = [];
	// Find starting inner points
	for (let i = 0; i < nbColumns; i++) {
		for (let j = 0; j < nbLines; j++) {
			if (grid[j*nbColumns+i] === privateEnum.inner) {
				toExplore.push(i);
				toExplore.push(j);
			}
		}
	}

	let directions = ["top", "bottom", "left", "right", "top-right", "top-left", "bottom-right", "bottom-left"];
	while (toExplore.length !== 0) {
		let i = toExplore.shift();
		let j = toExplore.shift();
		for (let direction of directions) {
			if (checkDirection(i, j, direction)) {
				setDirectionInner(i, j, direction, toExplore);
			}
		}		
	}
	drawGrid();
}

function checkDirection(i, j, direction)
{
	let currI = i;
	let currJ = j;
	while (true) {
		if (direction.indexOf("top") !== -1)
			currJ--;
		if (direction.indexOf("bottom") !== -1)
			currJ++;
		if (direction.indexOf("left") !== -1)
			currI--;
		if (direction.indexOf("right") !== -1)
			currI++;
		if (currI < 0 || currI >= nbColumns-1 || currJ < 0 || currJ >= nbLines-1)
			return false;
		if (grid[currJ*nbColumns + currI] === privateEnum.inner || grid[currJ*nbColumns + currI] === privateEnum.border)
			return true;
	}
}

function setDirectionInner(i, j, direction, toExplore)
{
	let currI = i;
	let currJ = j;
	while (true) {
		if (direction.indexOf("top") !== -1)
			currJ--;
		if (direction.indexOf("bottom") !== -1)
			currJ++;
		if (direction.indexOf("left") !== -1)
			currI--;
		if (direction.indexOf("right") !== -1)
			currI++;

		if (grid[currJ*nbColumns + currI] === privateEnum.inner || grid[currJ*nbColumns + currI] === privateEnum.border)
			return;
		
		grid[currJ*nbColumns + currI] = privateEnum.inner;
		toExplore.push(i);
		toExplore.push(j);
	}
}
