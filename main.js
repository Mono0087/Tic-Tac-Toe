const gameBoard = function () {
    let board = [];
    const players = [{ name: 'Player', mark: 'o' }, { name: 'Computer', mark: 'x' }];
    const gameState = {
        currentPlayer: players[0].name,
        currentMark: players[0].mark,
        isOver: false,
        turnCount: 0,
        nextPlayerTurn: function () {
            if (this.currentPlayer === players[0].name) {
                this.currentPlayer = players[1].name;
                this.currentMark = players[1].mark
            } else {
                this.currentPlayer = players[0].name;
                this.currentMark = players[0].mark
            }
            this.turnCount++;
        },
        reset: function () {
            this.currentPlayer = players[0].name;
            this.currentMark = players[0].mark;
            this.turnCount = 0;
            this.isOver = false;
        },
        victoryCheck: function () {
            let victoryVariations = [[board[0], board[1], board[2]], [board[3], board[4], board[5]], [board[6], board[7], board[8]], [board[0], board[3], board[6]], [board[1], board[4], board[7]], [board[2], board[5], board[8]], [board[0], board[4], board[8]], [board[2], board[4], board[6]]];

            let result = '';
            victoryVariations.forEach(variation => {
                let varSet = [...new Set(variation).keys()];
                if (!varSet.includes(undefined) && varSet.length === 1) {
                    result = players.find(p => p.mark === varSet[0]).name;
                }
            })
            if (result) _endGame(result);
            if (!result && this.turnCount === 9) _endGame('Tie')
        }
    };

    //Cache DOM
    const gameDOM = document.querySelector('.game_module');
    const boardEl = gameDOM.querySelector('.field_container');
    const restartBtn = gameDOM.querySelector('.restart');
    const resultSpan = gameDOM.querySelector('.result').children[0];

    _renderBoard();

    //Bind events
    boardEl.addEventListener('mouseup', _boardHandler);
    restartBtn.addEventListener('click', restart);

    //Private methods
    function _renderBoard() {
        board.forEach((val, i) => {
            if (val === 'x') {
                boardEl.children[i].classList.add('marked_x')
            } else if (val === 'o') {
                boardEl.children[i].classList.add('marked_circle')
            }
        })
    }
    function _boardHandler(e) {
        let index = Array.from(boardEl.children).indexOf(e.target);
        if (e.target.classList.contains('field')) {
            addMarkToBoard(index);
        }
    }
    function _endGame(result) {
        gameState.isOver = true;
        resultSpan.textContent = result;
    }

    //Public methods
    function addMarkToBoard(i) {
        if (!board[i] && i <= 8 && i >= 0 && !gameState.isOver) {
            board[i] = gameState.currentMark;
            _renderBoard();
            gameState.nextPlayerTurn();
            gameState.victoryCheck();
        };
    }
    function restart() {
        Array.from(boardEl.children).map(field => field.classList.remove('marked_x', 'marked_circle'));
        board = [];
        gameState.reset();
        resultSpan.textContent = '';
    }
    return { addMarkToBoard, restart };
}();