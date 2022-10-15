'use strict';



const socket = io()
let room = location.search.slice(6)
let board = []

// socket.emit('join', 'in-Game')

socket.emit('join-room', room)

socket.on('setupBoard', (damka, room) => {
    console.log('room');
    board = damka.board
    boardSetupDesign(8);

socket.on('markGreen', arr => {
    greenMark(arr)
})

socket.on('printBoard', damka => {
    console.log('updationg board');
    board = damka.board
    boardUpdateDesign()
})



function boardSetupDesign(size) {

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++){
            let div = document.createElement("div"); 
            div.classList.add(`${board[i][j].squareColor}`);
            div.setAttribute("id", `${i}${j}`);
            document.querySelector('.board').append(div);
            if (board[i][j].player) div.classList.add(`${board[i][j].player.color}`)
            if (board[i][j].player.isKing) div.classList.add('king');

        }
    }
    
    
    document.querySelector('.board').style.setProperty('--x' , size) 

}

function boardUpdateDesign() {

    for (let i = 0; i < board.length; i++) {

        for (let j = 0; j < board.length; j++){
            const div = document.getElementById(`${i}${j}`)
            div.removeAttribute('class')
            div.classList.add(`${board[i][j].squareColor}`);
            if (board[i][j].player) div.classList.add(`${board[i][j].player.color}`)
            if (board[i][j].player.isKing) div.classList.add('king');

        }
    }

}

function greenMark(arr) {

    for (let i = 0; i < arr.length; i++) {
        
        document.getElementById(`${arr[i].id[0]}${arr[i].id[1]}`).style.backgroundColor = 'green';
        
    }

}

function resetSquaresColor(){
    document.querySelectorAll('.dark-square').forEach(square =>
        square.removeAttribute('style'));
}



document.querySelectorAll('.dark-square').forEach(square =>
    square.addEventListener('click', function(e){
    if (e.target.style.backgroundColor == 'green') return;
    const id = e.target.id;
    resetSquaresColor();
    e.target.style.border = '3px yellow solid';
    
    socket.emit('clickOnPlayer', id, room)
    
        
}))


// click on green square
document.querySelectorAll('.dark-square').forEach(square =>
    square.addEventListener('click', function(e){
        
        if (e.target.style.backgroundColor != 'green') return;
        const id = e.target.id;
        socket.emit('clickOnSquare', id)
        resetSquaresColor();
            
    }));
})