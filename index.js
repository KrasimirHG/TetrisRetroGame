window.onload = function() {
	const display = document.querySelector(".display");
	const gameDisplay = document.querySelector(".game-display");
	const gameDisplayWidth =
		document.querySelector(".game-display").offsetWidth - 1;
	console.log(gameDisplayWidth);
	const blockRyb = gameDisplayWidth / 10;

	function createBoard() {
		for (let i = 0; i < 200; i++) {
			var block = document.createElement("div");
			gameDisplay.appendChild(block);
			block.style.width = blockRyb;
			block.style.height = blockRyb;
			block.classList.add("fon");
		}

		for (let i = 0; i < 10; i++) {
			var block = document.createElement("div");
			gameDisplay.appendChild(block);
			block.style.width = blockRyb;
			block.style.height = 0;
			block.classList.add("block3");
		}
	}
	createBoard();

	display.style.height = 20 * blockRyb + 10;

	let squares = Array.from(gameDisplay.querySelectorAll("div"));
	console.log(squares);

	const x = 10;
	const y = 20;
	let currentPosition;
	let currentRotation = 0;
	let currentIndex = 0;
	let timer;
	let speed = 1000;
	let score = 0;
	let clean = 0;
	let nextRandom;
	let level = 1;
	const levelDisp = document.querySelector("#level-result");
	const pause = document.querySelector("#pause");
	const result = document.querySelector("#points-result");
	const startButton = document.querySelector(".drop");
	const cleans = document.querySelector("#cleans-result");
	const nextTet = document.querySelector("#next-result");
	const reset = document.querySelector("#reset");

	function control(e) {
		console.log(e.keyCode);
		if (e.keyCode === 39) moveRight();
		else if (e.keyCode === 38 || e.keyCode === 82) rotate();
		else if (e.keyCode === 37) moveLeft();
		else if (e.keyCode === 40) moveDown();
		else if (e.keyCode === 32) startGame();
		else if (e.keyCode === 80) pauseGame();
	}

	document.addEventListener("keydown", control);

	//The Tetrominoes
	const lTetromino = [
		[1, x + 1, x * 2 + 1, 2],
		[x, x + 1, x + 2, x * 2 + 2],
		[1, x + 1, x * 2 + 1, x * 2],
		[x, x * 2, x * 2 + 1, x * 2 + 2],
	];

	const zTetromino = [
		[0, x, x + 1, x * 2 + 1],
		[x + 1, x + 2, x * 2, x * 2 + 1],
		[0, x, x + 1, x * 2 + 1],
		[x + 1, x + 2, x * 2, x * 2 + 1],
	];

	const tTetromino = [
		[1, x, x + 1, x + 2],
		[1, x + 1, x + 2, x * 2 + 1],
		[x, x + 1, x + 2, x * 2 + 1],
		[1, x, x + 1, x * 2 + 1],
	];

	const oTetromino = [
		[0, 1, x, x + 1],
		[0, 1, x, x + 1],
		[0, 1, x, x + 1],
		[0, 1, x, x + 1],
	];

	const iTetromino = [
		[1, x + 1, x * 2 + 1, x * 3 + 1],
		[x, x + 1, x + 2, x + 3],
		[1, x + 1, x * 2 + 1, x * 3 + 1],
		[x, x + 1, x + 2, x + 3],
	];

	const theTetrominoes = [
		lTetromino,
		zTetromino,
		tTetromino,
		oTetromino,
		iTetromino,
	];

	//Select random tetramino
	let random = Math.floor(Math.random() * theTetrominoes.length);
	console.log("random is ", random);
	//Select current rotation
	let current = theTetrominoes[random][currentRotation];
	console.log("current is ", current);
	currentPosition = 4;

	//draw the tetramino
	function draw() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.add("block");
			squares[currentPosition + index].style.opacity = 1;
		});
	}

	//erase tetramino
	function erase() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.remove("block");
			squares[currentPosition + index].style.opacity = 0.1;
		});
	}
	function isRightEdge(index) {
		return (index + currentPosition) % x === x - 1;
	}
	function moveRight() {
		erase();

		const rightEdge = current.some(isRightEdge);

		if (!rightEdge) {
			currentPosition++;
		}
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("block2")
			)
		) {
			currentPosition -= 1;
		}
		draw();
	}

	function isLeftEdge(index) {
		return (index + currentPosition) % x === 0;
	}
	function moveLeft() {
		erase();

		const leftEdge = current.some(isLeftEdge);

		if (!leftEdge) {
			currentPosition--;
		}
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("block2")
			)
		) {
			currentPosition += 1;
		}
		draw();
	}
	function rotate() {
		erase();
		const rightEdge = current.some(isRightEdge);
		const leftEdge = current.some(isLeftEdge);
		if (rightEdge) {
			if (random === 4) {
				currentPosition -= 2;
				currentRotation++;
			} else {
				currentPosition -= 1;
				currentRotation++;
			}
		} else if (leftEdge) {
			if (random === 4) {
				currentPosition += 2;
				currentRotation++;
			} else {
				currentPosition += 1;
				currentRotation++;
			}
		} else {
			currentRotation++;
		}
		if (currentRotation === current.length) {
			currentRotation = 0;
		}
		current = theTetrominoes[random][currentRotation];
		console.log(current);
		draw();
	}
	function moveDown() {
		erase();
		currentPosition += x;
		console.log("currentPosition is", currentPosition);
		draw();
		freeze();
	}
	function freeze() {
		if (
			current.some(
				(index) =>
					squares[currentPosition + index + x].classList.contains(
						"block3"
					) ||
					squares[currentPosition + index + x].classList.contains(
						"block2"
					)
			)
		) {
			console.log("freeze");
			current.forEach((index) =>
				squares[currentPosition + index].classList.add("block2")
			);

			random = nextRandom;

			current = theTetrominoes[random][currentRotation];
			nextRandom = Math.floor(Math.random() * theTetrominoes.length);
			currentPosition = 4;
			draw();
			res();
			displayNext();
			gameOver();
		}
	}

	function displayNext() {
		let next;

		switch (nextRandom) {
			case 0:
				next = document.createElement("img");
				next.setAttribute("src", "l-tetramino.png");
				next.style.width = "30px";
				next.style.height = "40px";
				nextTet.innerHTML = "";
				nextTet.appendChild(next);
				break;
			case 1:
				next = document.createElement("img");
				next.setAttribute("src", "z-tetramino.png");
				next.style.width = "30px";
				next.style.height = "40px";
				nextTet.innerHTML = "";
				nextTet.appendChild(next);
				break;
			case 2:
				next = document.createElement("img");
				next.setAttribute("src", "t-tetramino.png");
				next.style.width = "30px";
				next.style.height = "40px";
				nextTet.innerHTML = "";
				nextTet.appendChild(next);
				break;
			case 3:
				next = document.createElement("img");
				next.setAttribute("src", "o-tetramino.png");
				next.style.width = "30px";
				next.style.height = "30px";
				nextTet.innerHTML = "";
				nextTet.appendChild(next);
				break;
			case 4:
				next = document.createElement("img");
				next.setAttribute("src", "i-tetramino.png");
				next.style.width = "15px";
				next.style.height = "40px";
				nextTet.innerHTML = "";
				nextTet.appendChild(next);
				break;
		}
	}

	//Game Over
	function gameOver() {
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("block2")
			)
		) {
			result.innerHTML = "Game Over";
			clearInterval(timer);
		}
	}
	function res() {
		let red = [];
		for (currentIndex = 0; currentIndex < x * y; currentIndex += x) {
			for (let i = 0; i < x; i++) {
				red.push(currentIndex + i);
			}
			const row = red;
			red = [];
			console.log(row);
			if (
				row.every((index) =>
					squares[index].classList.contains("block2")
				)
			) {
				score += 10;
				result.innerHTML = score;
				clean += 1;
				cleans.innerHTML = clean;
				switch (score) {
					case 50:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						console.log("speed is", speed);
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 100:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						console.log("speed is", speed);
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 150:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						console.log("speed is", speed);
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 200:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 250:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 300:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 350:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
					case 400:
						level++;
						levelDisp.innerHTML = level;
						speed -= 100;
						clearInterval(timer);
						timer = setInterval(moveDown, speed);
						// if(speed<100) speed = 100;
						break;
				}
				row.forEach((index) => {
					squares[index].style.opacity = 0.1;
					squares[index].classList.remove("block2");
					squares[index].classList.remove("block");
				});
				const removedSquares = squares.splice(currentIndex, x);
				console.log("removedSquares ", removedSquares);
				squares = removedSquares.concat(squares);
				console.log("all squares ", squares);
				//grid.innerHTML = "";
				squares.forEach((cell) => {
					gameDisplay.appendChild(cell);
				});
			}
		}
	}

	function pauseGame() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		} else {
			timer = setInterval(moveDown, speed);
		}
	}
	pause.addEventListener("click", pauseGame);

	function startGame() {
		timer = setInterval(moveDown, speed);
		nextRandom = Math.floor(Math.random() * theTetrominoes.length);
		displayNext();
	}
	startButton.addEventListener("click", startGame);

	function resetting() {
		clearInterval(timer);
		score = 0;
		result.innerHTML = score;
		clean = 0;
		cleans.innerHTML = clean;
		level = 1;
		levelDisp.innerHTML = level;
		speed = 1000;
		nextTet.innerHTML = "";
		squares.forEach((sq) => {
			sq.classList.remove("block");
			sq.classList.remove("block2");
			sq.style.opacity = 0.1;
		});
	}

	reset.addEventListener("click", resetting);
};
