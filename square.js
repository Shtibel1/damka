'use strict';



class Square {
    constructor(squareColor, id) {
        this.squareColor = squareColor;
        this.id = id;
        this.player = {};
        
    }

    getSquareColor(){
        return this.squareColor;
    }

    

    setPlayer(player){
        this.player = player;
        if (this.id[0] == 0 && this.player.color === 'black-player'){
            this.player.isKing = true;

        }

        else if (this.id[0] == 7 && this.player.color === 'red-player'){
            this.player.isKing = true;
        }
        
    }

    getPlayer() {
        return this.player;
    }

    getPlayerColor(){
        if (this.player.color == null) return null;
        return this.player.color;
    }

    removePlayer() {
        if (!this.hasPlayer()) throw new Error();
        
        const p = this.player;
        this.player = {};
        return p
    }

    
    hasPlayer() {
        if (this.player.color == null) return false;
        return true;
    }
    
}
module.exports = Square
