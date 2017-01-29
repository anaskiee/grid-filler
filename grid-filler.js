"use strict";

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
	drawGrid(context, canvas);
});

function drawGrid(ctx, canvas)
{
	ctx.translate(0.5, 0.5);
	let squareSize = 253;
	let width = canvas.width - canvas.width % squareSize;
	let height = canvas.height - canvas.height % squareSize;

	ctx.fillStyle = "#CCCCCC";
	ctx.fillRect(0, 0, width + 1, height + 1);

	ctx.strokeStyle = "#000000";
	// -1 because of translation of 0.5
	for (let i = 0; i <= width; i += squareSize) {
		ctx.strokeRect(i, 0, 0, height);
	}
	for (let j = 0; j <= height; j += squareSize) {
		ctx.strokeRect(0, j, width, 0);
	}
}
