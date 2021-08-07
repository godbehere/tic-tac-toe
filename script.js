/////////////////////////////////////////////////////////////////////////

const mockDocument = (() => ({
    querySelector: (selector) => ({
      innerHTML: null,
    }),
}))();

/////////////////////////////////////////////////////////////////////////

const player = function(name, marker){
    let Name = name;
    let score = 0;
    let Marker = marker;

    const displayScore = function() {
        console.log(`${Name} has a score of ${score}`)
    }

    const winGame = function() {
        score += 1;
        alert(`${Name} has won the game.`);
    }

    return { displayScore, winGame, Marker, Name, };

};

//////////////////////////////////////////////////////////////////////////

const gameBoard = (function(doc){
    //let gamePieces = [null,null,null,null,'O','X','O','X','O'];

    let gamePieces = [];

    for(let i = 0; i <= 8; i++) {
        gamePieces.push(null);
    }

    const gameSquares = doc.querySelectorAll('.game-square');

    const clearBoard = function() {
        for(let i = 0; i <= 8; i++) {
            gameSquares[i].innerHTML = '';
            gamePieces[i] = null;
        }
        displayPieces();
    };

    const displayPieces = function() {
        for(let i = 0; i <= 8; i++) {
            gameSquares[i].innerHTML = gamePieces[i];
        }
    };

    const setSquare = function(square, marker) {
        if(!gamePieces[square]) {
            gamePieces[square] = marker;
            return true;
        }
    };

    const getPieces = function() {
        return gamePieces;
    };

    const copyPiecesArray = function() {
        let copy = [];
        gamePieces.forEach(item => {copy.push(item)});
        return copy;
    };

    const availableSpaces = function() {
        let spacesRemaining = 9;
        for(let i = 0; i <= 8; i++){
            if(gamePieces[i]) {
                spacesRemaining--;
            }
        }
        return spacesRemaining;
    };

    return { displayPieces, clearBoard, setSquare, getPieces, copyPiecesArray, availableSpaces, gameSquares };

})(document || mockDocument);

////////////////////////////////////////////////////////////////////////

const gameplay = (function(doc){

    let player1;

    let player2;

    let currentPlayer;

    let gameActive = false;

    const newGameModal = doc.getElementById("newGameModal");

    const newGameBtn = doc.getElementById("newGameBtn");

    const resetGameBtn = doc.getElementById("resetGameBtn");

    const newGameSpan = doc.getElementsByClassName("close")[0];

    const newGameSubmit = doc.getElementById("newGameSubmit");

    const playerOneInput = doc.getElementById("player1");

    const playerTwoInput = doc.getElementById("player2");

    newGameSubmit.addEventListener('click', (event) => {
        if (playerOneInput.value && playerTwoInput.value){
            player1 = player(playerOneInput.value, 'X');
            player2 = player(playerTwoInput.value, 'O');
            currentPlayer = player1;
            playerOneInput.value = '';
            playerTwoInput.value = '';
            gameActive = true;
            hideModal(newGameModal);
            gameBoard.clearBoard();
            if(currentPlayer.Name == 'Computer') {
                aiTurn();
            }
        }
    });

    const hideModal = function(thisModal){
        thisModal.style.display = 'none';
    };

    const showModal = function(thisModal){
        thisModal.style.display = 'block';
    };

    newGameBtn.addEventListener('click', showModal.bind(null, newGameModal));

    resetGameBtn.addEventListener('click', () => {
        if(player1 && player2) {
            gameBoard.clearBoard();
            currentPlayer = player1;
            gameActive = true;
            if(currentPlayer.Name == 'Computer') {
                aiTurn();
            }
        }
    });
    
    newGameSpan.addEventListener('click', hideModal.bind(null, newGameModal));

    window.addEventListener('click', (event) => {
        if (event.target == newGameModal) {
            hideModal(newGameModal);
        }
    });

    const checkBoard = function(board) {
        let winValue = 0;
        if(board[0] && board[0] == board[1] && board[0] == board[2]){
            //alert('Row 1');
            //return true;
            winValue++;
        }
        if(board[3] && board[3] == board[4] && board[3] == board[5]) {
            //alert('Row 2');
            //return true;
            winValue++;
        }
        if(board[6] && board[6] == board[7] && board[6] == board[8]) {
            //alert('Row 3');
            //return true;
            winValue++;
        }
        if(board[0] && board[0] == board[3] && board[0] == board[6]) {
            //alert('Col 1');
            //return true;
            winValue++;
        }
        if(board[1] && board[1] == board[4] && board[1] == board[7]) {
            //alert('Col 2');
            //return true;
            winValue++;
        }
        if(board[2] && board[2] == board[5] && board[2] == board[8]) {
            //alert('Col 3');
            //return true;
            winValue++;
        }
        if(board[0] && board[0] == board[4] && board[0] == board[8]) {
            //alert('Diag 1');
            //return true;
            winValue++;
        }
        if(board[2] && board[2] == board[4] && board[2] == board[6]) {
            //alert('Diag 2');
            //return true;
            winValue++;
        }
        return winValue;
    };

    const takeTurn = function() {
        if(gameActive){
            square = this;
            let nextPlayer = currentPlayer;

            if(gameBoard.setSquare(square.dataset.num, currentPlayer.Marker)) {
                if(currentPlayer == player1){
                    nextPlayer = player2;
                } else {
                    nextPlayer = player1;
                }
            }
            gameBoard.displayPieces(); 
            
            if(checkBoard(gameBoard.getPieces())){
                currentPlayer.winGame();
                gameActive = false;
            } else if (gameBoard.availableSpaces() == 0) {
                alert('Cat\'s Game');
                gameActive = false;
            }

            currentPlayer = nextPlayer;

            if(currentPlayer.Name == 'Computer') {
                aiTurn();
            }
        }
    };

    for(let i = 0; i <= 8; i++) {
        gameBoard.gameSquares[i].addEventListener('click', takeTurn);
    }

    showModal(newGameModal);

    const aiTurn = function() {
        let currentPieces = gameBoard.copyPiecesArray();
        let moves = [];
        let otherPlayer;

        if(currentPlayer == player1) {
            otherPlayer = player2;
        } else {
            otherPlayer = player1;
        }

        for(let i = 0; i <= 8; i++){
            moves.push(0);
            currentPieces = gameBoard.copyPiecesArray();
            if(!currentPieces[i]) {
                //console.log(i);
                currentPieces[i] = currentPlayer.Marker;
                //console.log(currentPieces);
                if(checkBoard(currentPieces)) {
                    //console.log(`Current player can win by playing at ${i}`)
                    //takeTurn.call(gameBoard.gameSquares[i]);
                    moves[i] += 5;
                }
                currentPieces = gameBoard.copyPiecesArray();
                
                currentPieces[i] = otherPlayer.Marker;
                if(checkBoard(currentPieces)) {
                    moves[i] += checkBoard(currentPieces);
                }
            }
        }

        let moveLocation = 0;
        let moveValue = 0;

        for(let i = 0; i <= 8; i++){
            if(moves[i] > moveValue){
                moveValue = moves[i];
                moveLocation = i;
            }
        }

        if(moveValue == 0) {
            if(!gameBoard.getPieces()[4]){
                moveLocation = 4;
            } else {
                for(let i = 0; i <= 8; i++){
                    if(!gameBoard.getPieces()[i]) {
                        moveLocation = i;
                        break;
                    }
                }
            }             
        }
        takeTurn.call(gameBoard.gameSquares[moveLocation]);

    };


    return { aiTurn, };
})(document || mockDocument);

/////////////////////////////////////////////////////////////////////////