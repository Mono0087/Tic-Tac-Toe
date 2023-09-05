const gameBoard = function () {
    let board = ['', '', '', '', '', '', '', '', '', ''];
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
            } else {
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
            if (players[1].type === 'AI') {
                _computerChoice();
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
    function _computerChoice() {
        for (let i = 0; i < 1;) {
            let index = Math.floor(Math.random() * 9);
            if (!board[index]) {
                addMarkToBoard(index);
                ++i;
            } else {
                if (gameState.isOver) ++i;
            }
        }
    }
    //Public methods
    function addMarkToBoard(i) {
        if (!board[i] && i <= 8 && i >= 0 && !gameState.isOver) {
            board[i] = gameState.currentMark;
            _renderBoard();
            let isVictory = _victoryCheck(board);
            if (isVictory) {
                _endGame(gameState.currentPlayer);
            } else if (!isVictory && gameState.turnCount === 8) _endGame('Tie');
            _nextPlayerTurn();
        };
    }
    function restart() {
        board = ['', '', '', '', '', '', '', '', '', ''];
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