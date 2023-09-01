const gameBoard = function () {
    let board = [];
    const players = [{ name: 'player', mark: 'o' }, { name: 'computer', mark: 'x' }];
    const gameState = {
        currentPlayer: players[0].name,
        currentMark: players[0].mark,
        nextPlayerTurn: function () {
            if (this.currentPlayer === players[0].name) {
                this.currentPlayer = players[1].name;
                this.currentMark = players[1].mark
            } else {
                this.currentPlayer = players[0].name;
                this.currentMark = players[0].mark
            }
        },
        reset: function () {
            gameState.currentPlayer = players[0].name;
            gameState.currentMark = players[0].mark;
        }
    };

    //Cache DOM
    const gameDOM = document.querySelector('.game_module');
    const boardEl = gameDOM.querySelector('.field_container');
    const restartBtn = gameDOM.querySelector('.restart');

    _renderBoard();

    //Bind events
    boardEl.addEventListener('mouseup', _boardHandler);
    restartBtn.addEventListener('click', _restart);

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
    function _restart() {
        Array.from(boardEl.children).map(field => field.classList.remove('marked_x', 'marked_circle'));
        board = [];
        gameState.reset();
    }

    //Public methods
    function addMarkToBoard(i) {
        if (!board[i] && i <= 8 && i >= 0) {
            board[i] = gameState.currentMark;
            _renderBoard();
            gameState.nextPlayerTurn();
        };
        console.log(gameState)
    }
    return { addMarkToBoard };
}();