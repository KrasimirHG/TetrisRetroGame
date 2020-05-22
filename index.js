window.onload = function() {
	const display = document.querySelector(".display");
	const gameDisplay = document.querySelector(".game-display");
	const gameDisplayWidth =
		document.querySelector(".game-display").offsetWidth - 1;
	console.log(gameDisplayWidth);
	const blockRyb = gameDisplayWidth / 10;

	for (let i = 0; i < 190; i++) {
		var block = document.createElement("div");
		gameDisplay.appendChild(block);
		block.style.width = blockRyb;
		block.style.height = blockRyb;
		block.style.backgroundColor = "purple";
	}
	for (let i = 0; i < 10; i++) {
		var block = document.createElement("div");
		gameDisplay.appendChild(block);
		block.style.width = blockRyb;
		block.style.height = blockRyb;
		block.style.backgroundColor = "purple";
		block.classList.add("block3");
	}

	display.style.height = 20 * blockRyb + 10;

	const squares = gameDisplay.querySelectorAll("div");
	console.log(squares);
};
