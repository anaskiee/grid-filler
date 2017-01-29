"use strict";

let grid;
let squareSize = 253;
let nbColumns;
let nbLines;
let keyCurrentlyDown = [];

window.addEventListener('load', function() {
	screen.mozlockOrientation = "landscape-secondary";

	// Get man canvas
	var canvas = document.getElementById("grid-filler");
	if (!canvas) {
		alert("Impossible to get the main canvas");
		return;
	}

	var context = canvas.getContext("2d");
	if (!context) {
		alert("Impossible to get context of canvas");
		return;
	}

	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	canvas.width = screenWidth;
	canvas.height = screenHeight;

	canvas.focus();
	addEvents(canvas);
	initGrid(canvas);
	drawGrid(context, canvas);
});

function addEvents(canvas)
{
	canvas.addEventListener("mousemove", mousemoveHandler, false);
	canvas.addEventListener("keydown", keydownHandler, false);
	canvas.addEventListener("keyup", keyupHandler, false);
}

function mousemoveHandler(event)
{
	console.log(event.pageX, event.pageY);
}

function keydownHandler(event)
{
	// prevent backspace key from navigating back
	if (event.keyCode === 8) {
		event.preventDefault();
	}
	console.log(event.keyCode + event.charCode);
}

function keyupHandler(event)
{
	// prevent backspace key from navigating back
	if (event.keyCode === 8) {
		event.preventDefault();
	}
	console.log(event.keyCode + event.charCode);	
}

let privateEnum = {
	empty: 0,
	border: 1
}

function initGrid(canvas)
{
	squareSize = 253;
	nbColumns = Math.floor(canvas.width / squareSize);
	nbLines = Math.floor(canvas.height / squareSize);
	grid = new Int8Array(nbColumns*nbLines);
	for (let i = 0; i < nbColumns; i++) {
		for (let j = 0; j < nbLines; j++) {
			grid[j*nbColumns + i] = privateEnum.empty;
		}
	}
	grid[3] = privateEnum.border;
}

function drawGrid(ctx, canvas)
{
	ctx.save();
	ctx.translate(0.5, 0.5);
	let width = nbColumns * squareSize;
	let height = nbLines * squareSize;

	drawSqares(ctx, privateEnum.empty, "#CCCCCC");
	drawSqares(ctx, privateEnum.border, "#AAAACC");

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

function drawSqares(ctx, type, color)
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
