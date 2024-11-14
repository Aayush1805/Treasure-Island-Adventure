const gridElement = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");

const gridSize = 10;
let playerPosition = { x: 0, y: 0 };
let score = 0;
let movesLeft = 50;
let gameActive = true;  //variable to track if the game is active
let totalTreasures = 10;  // tolte of treasures on the grid
let collectedTreasures = 0;  // tracking the number of collected treasures

function initializeGame() {
    score = 0;
    movesLeft = 50;
    playerPosition = { x: 0, y: 0 };
    gameActive = true;
    collectedTreasures = 0;

    scoreDisplay.textContent = score;
    movesDisplay.textContent = movesLeft;

    generateGrid();
    placeElements();
    renderGrid();
}

function generateGrid() {
    gridElement.innerHTML = "";
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    gridElement.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

    // Initialize empty cells
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell", "empty");
        gridElement.appendChild(cell);
    }
}

function placeElements() {
    
    placeRandomElements("obstacle", 20); //place obstacles

    placeRandomElements("treasure", totalTreasures); //place treasures
    
    placeRandomElements("trap", 10); //place traps
}

function placeRandomElements(type, count) {
    let placed = 0;
    while (placed < count) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const cell = getCell(x, y);

        if (cell.classList.contains("empty") && (x !== 0 || y !== 0)) {
            cell.classList.remove("empty");
            cell.classList.add(type);
            placed++;
        }
    }
}

function getCell(x, y) {
    return gridElement.children[y * gridSize + x];
}

function renderGrid() {
    Array.from(gridElement.children).forEach(cell => {
        cell.classList.remove("player");
    });

    const playerCell = getCell(playerPosition.x, playerPosition.y);
    playerCell.classList.add("player");
}

function movePlayer(dx, dy) {
    if (!gameActive) return;  // ddo nothing if the game is over

    if (movesLeft <= 0) {
        endGame("Game over! You've run out of moves.");
        return;
    }

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    // ensuring player stays within the grid boundaries
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) return;

    playerPosition = { x: newX, y: newY };
    const cell = getCell(newX, newY);

    if (cell.classList.contains("obstacle")) {
        alert("Oops! You hit an obstacle.");
        return;
    }

    if (cell.classList.contains("treasure")) {
        score += 10;
        collectedTreasures++;  // increment collected treasures
        cell.classList.remove("treasure");
        cell.classList.add("empty");
        scoreDisplay.textContent = score;
    }

    if (cell.classList.contains("trap")) {
        alert("Oh no! You hit a trap.");
        score = Math.max(0, score - 5);
        cell.classList.remove("trap");
        cell.classList.add("empty");
        scoreDisplay.textContent = score;
    }

    movesLeft--;
    movesDisplay.textContent = movesLeft;

    // rendering grid after move
    renderGrid();

    // checking if player has collected all treasures or if the game has ended
    if (collectedTreasures >= totalTreasures) {
        endGame("Congratulations! You've collected all the treasures!");
    } else if (movesLeft <= 0) {
        endGame("Game over! You've run out of moves.");
    }
}

function endGame(message) {
    gameActive = false;  
    alert(message);
    displayFinalResult();
}

function displayFinalResult() {
    if (collectedTreasures >= totalTreasures) {
        alert(`You won with a score of ${score}!`);
    } else {
        alert(`Game Over! Your final score is ${score}.`);
    }
}

window.addEventListener("keydown", (event) => {
    if (!gameActive) return;  // preventing moves if game is inactive

    switch (event.key) {
        case "ArrowUp":
            movePlayer(0, -1);
            break;
        case "ArrowDown":
            movePlayer(0, 1);
            break;
        case "ArrowLeft":
            movePlayer(-1, 0);
            break;
        case "ArrowRight":
            movePlayer(1, 0);
            break;
    }
});

// Initialize game on load
initializeGame();
