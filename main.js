const gameBoard = function () {
    let board = ['', '', '', '', '', '', '', '', ''];
    const players = [{ name: 'Player1', mark: 'o', type: 'player' }, { name: 'Player2', mark: 'x', type: 'player' }];
    const gameState = {
        currentPlayer: players[0].name,
        currentMark: players[0].mark,
        isOver: false,
        turnCount: 0,
    };
    //Cache DOM
    const gameDOM = document.querySelector('.game_module');
    const boardEl = gameDOM.querySelector('.field_container');
    const restartBtn = gameDOM.querySelector('.restart');
    const resultSpan = gameDOM.querySelector('.result').children[0];
    const playerSelect = gameDOM.querySelector('#player-select');

    _renderBoard();

    //Bind events
    boardEl.addEventListener('mouseup', _boardHandler);
    restartBtn.addEventListener('click', restart);
    playerSelect.addEventListener('change', changeSecondPlayer.bind(null, playerSelect));

    //Private methods
    function _renderBoard() {
        Array.from(boardEl.children).map(field => field.classList.remove('marked_x', 'marked_circle'));
        board.forEach((val, i) => {
            if (val === 'x') {
                boardEl.children[i].classList.add('marked_x');
            } else if (val === 'o') {
                boardEl.children[i].classList.add('marked_circle');
            }
        })
    }
    function _boardHandler(e) {
        let index = Array.from(boardEl.children).indexOf(e.target);
        if (e.target.classList.contains('field')) {
            addMarkToBoard(index);
        }
    }
    function _nextPlayerTurn() {
        gameState.turnCount++;
        if (gameState.currentPlayer === players[0].name) {
            gameState.currentPlayer = players[1].name;
            gameState.currentMark = players[1].mark;
            if (_getCurrentPlayerType() === 'AI') {
                _computerChoice(gameState.currentMark);
            }
        } else {
            gameState.currentPlayer = players[0].name;
            gameState.currentMark = players[0].mark;
        }
    }
    function _victoryCheck(arr) {
        let victoryVariations = [[arr[0], arr[1], arr[2]], [arr[3], arr[4], arr[5]], [arr[6], arr[7], arr[8]], [arr[0], arr[3], arr[6]], [arr[1], arr[4], arr[7]], [arr[2], arr[5], arr[8]], [arr[0], arr[4], arr[8]], [arr[2], arr[4], arr[6]]];

        let result;
        victoryVariations.forEach(variation => {
            let varSet = [...new Set(variation).keys()];
            if (!varSet.includes('') && varSet.length === 1) {
                result = true;
            }
        })
        return result;
    }
    function _endGame(result) {
        gameState.isOver = true;
        resultSpan.textContent = result;
    }
    function _getCurrentPlayerType() {
        let obj = players.find(p => p.name === gameState.currentPlayer);
        return obj.type;
    }
    function _computerChoice(mark) {
        let oppositeMark;
        if (mark === 'o') {
            oppositeMark = 'x';
        } else if (mark === 'x') {
            oppositeMark = 'o';
        }

        let choice = minimax(board, true).position;
        addMarkToBoard(choice);

        function minimax(position, maximizingPlayer) {
            let currentPlayer = maximizingPlayer ? 'o' : 'x';

            let remainingFields = position.reduce((acc, field) => {
                return field === '' ? ++acc : acc;
            }, 0)

            if (_victoryCheck(position)) {
                if (currentPlayer === 'x') {
                    return { position: null, score: 1 * (remainingFields + 1) };
                } else {
                    return { position: null, score: -1 * (remainingFields + 1) };
                }
            } else if (remainingFields === 0) {
                return { position: null, score: 0 };
            }

            if (maximizingPlayer) {
                let bestMove = { position: null, score: -Infinity };
                for (let i = 0; i < board.length; ++i) {
                    if (!board[i]) {
                        board[i] = mark;
                        let eval = minimax(board, false);
                        board[i] = '';
                        if (eval.score > bestMove.score) {
                            bestMove.position = i;
                            bestMove.score = eval.score;
                        }
                    }
                }
                return bestMove;
            } else {
                let bestMove = { position: null, score: +Infinity };
                for (let i = 0; i < board.length; ++i) {
                    if (!board[i]) {
                        board[i] = oppositeMark;
                        let eval = minimax(board, true);
                        board[i] = '';
                        if (eval.score < bestMove.score) {
                            bestMove.position = i;
                            bestMove.score = eval.score;
                        }
                    }
                }
                return bestMove;
            }
        }
    }

    //Public methods
    function addMarkToBoard(i) {
        if (!board[i] && i <= 8 && i >= 0 && !gameState.isOver) {
            board[i] = gameState.currentMark;
            let isVictory = _victoryCheck(board);
            if (isVictory) {
                _endGame(gameState.currentPlayer);
            } else if (!isVictory && gameState.turnCount === 8) _endGame('Tie');
            _nextPlayerTurn();
            _renderBoard();
        };
    }
    function restart() {
        board = ['', '', '', '', '', '', '', '', ''];
        _renderBoard();
        gameState.currentPlayer = players[0].name;
        gameState.currentMark = players[0].mark;
        gameState.turnCount = 0;
        gameState.isOver = false;
        resultSpan.textContent = '';
    }
    function changeSecondPlayer(player) {
        if (!player.value) {
            player = player;
        } else player = player.value;
        restart();
        players[1].type = player;
    }
    return { addMarkToBoard, restart, changeSecondPlayer };
}();