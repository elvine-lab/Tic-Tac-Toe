const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, placeMarker };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (playerOneName, playerTwoName) => {
        players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
    };

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6] 
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return players[currentPlayerIndex].name;
            }
        }

        return board.includes("") ? null : "Tie"; 
    };

    const playTurn = (index) => {
        if (gameOver) return;
        if (Gameboard.placeMarker(index, players[currentPlayerIndex].marker)) {
            const winner = checkWinner(); 
            if (winner) {
                gameOver = true;
                DisplayController.showResult(winner);
            } else {
                switchPlayer();
            }
        }
        DisplayController.renderBoard();
    };

    return { startGame, playTurn };
})();

const DisplayController = (() => {
    const boardElement = document.getElementById("game-board");
    const restartButton = document.getElementById("restart-btn");

    boardElement.style.display = "grid";
    boardElement.style.gridTemplateColumns = "repeat(3, 100px)";
    boardElement.style.gridTemplateRows = "repeat(3, 100px)";
    boardElement.style.gap = "5px";

    const renderBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.textContent = mark;
            cell.style.display = "flex";
            cell.style.alignItems = "center";
            cell.style.justifyContent = "center";
            cell.style.width = "100px";
            cell.style.height = "100px";
            cell.style.border = "1px solid black";
            cell.style.fontSize = "24px";
            cell.style.cursor = "pointer";
            cell.addEventListener("click", () => Game.playTurn(index));
            boardElement.appendChild(cell);
        });
    };

    const showResult = (winner) => {
        alert(winner === "Tie" ? "It's a tie!" : `${winner} wins!`);
    };

    restartButton.addEventListener("click", () => {
        Game.startGame("Player 1", "Player 2");
    });

    return { renderBoard, showResult };
})();

Game.startGame("Player 1", "Player 2");
