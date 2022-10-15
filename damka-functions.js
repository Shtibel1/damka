const Square = require('./square')

let selectedPlayer = {}
let selectedSquare = {}

let turn = 'red-player'
let board


function boardSetup(board, size) {
    if (size == null) return;
    let squareColor = 'dark-square';
    for (let i = 0; i < size; i++) {
        board[i] = [];
       for (let j = 0; j < size; j++){
           if(j!=0)
            squareColor==='dark-square' ? squareColor='light-square' : squareColor = 'dark-square';
            board[i][j] = new Square(squareColor, `${i}${j}`);
        }

    }
}

function playerSetup(board, redTeam, blackTeam){

    while (redTeam > 0){
         for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++){
                if (board[i][j].getSquareColor() === 'dark-square' && redTeam > 0){
                board[i][j].player.color = 'red-player'
                redTeam--;
                }
            }
        }
    }

    while (blackTeam > 0){
        for (let i = board.length-1; i >= 0; i--) {  
          for (let j = board.length-1; j >= 0; j--){
               if (board[i][j].getSquareColor() === 'dark-square' && blackTeam > 0){
                   board[i][j].player.color = 'black-player'
                   blackTeam--;
               }
           }
        }
    }

}

function wherePlayerCanMove(square){
    const id = square.id;
    const x = Number(id[0]);
    const y = Number(id[1]);
    let arr = []
    if (square.getPlayer().isKing) return king(square);
    if (square.getPlayerColor() === 'red-player') {
        if ((x+1 < board.length && y+1 < board.length && !board[x+1][y+1].hasPlayer())){
            arr.push(board[x+1][y+1])
        }
        if (x+1 < board.length && y-1 >= 0 && !board[x+1][y-1].hasPlayer()){
            arr.push(board[x+1][y-1])
        }
    }
    if (board[x][y].getPlayerColor() === 'black-player'){
        if (x-1 >= 0 && y+1 < board.length && !board[x-1][y+1].hasPlayer()){
            arr.push(board[x-1][y+1])
        }

        if (x-1 >= 0 && y-1 >= 0 && !board[x-1][y-1].hasPlayer()){
            arr.push(board[x-1][y-1])
        }
    }
    return (arr)
}

function doesSomeoneCanEat(){
    
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].getPlayerColor() === turn && wherePlayerCanEat(board[i][j]).length > 0) return true;

        }
    }
    return false;
}

function wherePlayerCanEat(square){
    let idOfSquares = [];
    let x = Number(square.id[0]);
    let y = Number(square.id[1]);
    if (square.getPlayer().isKing){
        idOfSquares = king(square);
        resetSquaresColor();
        return idOfSquares;
    }

            if (x+2 < board.length && y+2 < board.length  && board[x+1][y+1].hasPlayer() && square.getPlayerColor() != board[x+1][y+1].getPlayerColor() && !board[x+2][y+2].hasPlayer())
            idOfSquares.push(board[x+2][y+2]);
            
            if (x-2 >= 0 && y+2 < board.length  && board[x-1][y+1].hasPlayer() && square.getPlayerColor() != board[x-1][y+1].getPlayerColor() && !board[x-2][y+2].hasPlayer())
            idOfSquares.push(board[x-2][y+2]);

            if (x+2 < board.length && y-2 >= 0  && board[x+1][y-1].hasPlayer() && square.getPlayerColor() != board[x+1][y-1].getPlayerColor() && !board[x+2][y-2].hasPlayer())
            idOfSquares.push(board[x+2][y-2]);

            if (x-2 >= 0 && y-2 >= 0  && board[x-1][y-1].hasPlayer() && square.getPlayerColor() != board[x-1][y-1].getPlayerColor() && !board[x-2][y-2].hasPlayer())
            idOfSquares.push(board[x-2][y-2]);

            
    return idOfSquares;
}

function checkForEndOfTheGame(){
    let bool = true
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].getPlayerColor() === turn) bool = false; 
        }
    }
    if (bool) console.log('send to the client');
}

function doesSomeoneIsEating(){
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].hasPlayer() && board[i][j].getPlayer().isEating === true){
                return true;
            
            }
        }
        
    }
    return false;
}

function removeEatenPlayer() {
    const x = Number(selectedPlayer.id[0]);
    const y = Number(selectedPlayer.id[1]);
    const a = Number(selectedSquare.id[0]);
    const b = Number(selectedSquare.id[1]);
    if (x < a){
        if (y < b) return board[a-1][b-1].removePlayer();
        if (y > b) return board[a-1][b+1].removePlayer();
    }
    if (x > a){
        if (y < b) return board[a+1][b-1].removePlayer();
        if (y > b) return board[a+1][b+1].removePlayer();
    }

}

function clickedPlayer(damka, id) {
    const x = Number(id[0]);
    const y = Number(id[1]);
    turn = damka.turn
    board = damka.board
    if (damka.board[x][y].player.color != turn || (!damka.board[x][y].getPlayer().isEating && doesSomeoneIsEating())) return [];
    selectedPlayer = damka.board[x][y];

    if (doesSomeoneCanEat()) 
    return (wherePlayerCanEat(selectedPlayer))
    
    else
    return wherePlayerCanMove(selectedPlayer)

}


// try to use only the arr with green squares
function clickedSquare(damka, id) {
    
    const x = Number(id[0]);
    const y = Number(id[1]);
    turn = damka.turn
    board = damka.board
    selectedSquare = board[x][y];
    if (wherePlayerCanEat(selectedPlayer).length > 0) {
        removeEatenPlayer();
        selectedSquare.setPlayer(selectedPlayer.removePlayer());
        selectedSquare.getPlayer().isEating = true;

        if (!wherePlayerCanEat(selectedSquare).length > 0){
            selectedSquare.getPlayer().isEating = false;
            turn === 'red-player' ? turn ='black-player' : turn ='red-player';
        }
        else {
            (wherePlayerCanEat(selectedSquare).length > 0) // seperate it
            selectedPlayer = selectedSquare;
        }
    }
    else { 
        
        selectedSquare.setPlayer(selectedPlayer.removePlayer())
        turn === 'red-player' ? turn ='black-player' : turn ='red-player';
    }
    damka.turn = turn
    damka.board = board
    checkForEndOfTheGame()
}


module.exports = {
    boardSetup,
    playerSetup,
    clickedPlayer,
    clickedSquare
}