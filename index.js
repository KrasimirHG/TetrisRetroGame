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
		// block.style.backgroundImage = "url('square.png')";
		block.classList.add("block");
	}
	for (let i = 0; i < 10; i++) {
		var block = document.createElement("div");
		gameDisplay.appendChild(block);
		block.style.width = blockRyb;
		block.style.height = blockRyb;
		block.style.backgroundColor = "purple";
		block.classList.add("block3");
		block.classList.add("block");
	}

	display.style.height = 20 * blockRyb + 10;

	const squares = Array.from(gameDisplay.querySelectorAll("div"));
	console.log(squares);

    const x =10;
    const y=20; 
    let currentPosition;
    let currentRotation = 0;
    let timer;
    let score = 0;
	const pause = document.querySelector("#pause");
	const result = document.querySelector("#points-result");
	const startButton = document.querySelector(".drop");

	function control(e) {
		console.log(e.keyCode);
		if (e.keyCode === 39) moveRight();
		else if (e.keyCode === 38 || e.keyCode === 82) rotate();
		else if (e.keyCode === 37) moveLeft();
		else if (e.keyCode === 40) moveDown();
		// else if (e.keyCode === 68) draw();
		// else if (e.keyCode === 69) erase();
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

			random = Math.floor(Math.random() * theTetrominoes.length);
			current = theTetrominoes[random][currentRotation];
			
			currentPosition = 4;
			draw();
			res();
			gameOver();
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
				row.forEach((index) => {
					squares[index].style.backgroundImage = "none";
					squares[index].classList.remove("block2");
					squares[index].classList.remove("block");
				});
				const removedSquares = squares.splice(currentIndex, x);
				console.log("removedSquares ", removedSquares);
				squares = removedSquares.concat(squares);
				console.log("all squares ", squares);
				//grid.innerHTML = "";
				squares.forEach((cell) => grid.appendChild(cell));
			}
		}
	}
	pause.addEventListener("click", () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		} else {
			timer = setInterval(moveDown, 1000);
		}
	});
	startButton.addEventListener("click",() => timer = setInterval(moveDown, 1000))







};


