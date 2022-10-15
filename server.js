if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const cookieParser = require('cookie-parser')



const publicDirectoryPath = path.join(__dirname, '/public');

const app = express()
const PORT = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)
const signupRouter = require('./routes/singup')
const singinRouter = require('./routes/login')
const damkaRouter = require('./routes/damka')
const indexRouter = require('./routes/lobby')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static(publicDirectoryPath))
app.use(cookieParser());
app.use('/signup', signupRouter)
app.use('/login', singinRouter)
app.use('/damka', damkaRouter)
app.use('/', indexRouter)


mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error('faild to connect mongoose', error))
db.once('open', () => console.log('connected to mongoose'))


server.listen(PORT, () => {
    console.log('server up on port: ' + PORT);
})



const { addUser, removeUser } = require('./onlineUsers')
const { clickedPlayer, clickedSquare, boardSetup, playerSetup } = require('./damka-functions')
let arr = [] 
let onlineUsers = [] // array of online players in the lobby
let rooms = [] // array of rooms



io.on('connection', (socket) => {
    console.log('player connected');

    socket.on('join-room', roomName => {
        socket.join(roomName)
        let currentRoom
        let bool = true
        rooms.forEach(room => {
            if (room.roomName === roomName){
            bool = false
            currentRoom = room
            }
            
        });
        if (bool) {
            rooms.push({
                roomName,
                players: []
            })
        }
        
        currentRoom = rooms[rooms.length-1]
        

        if (currentRoom.players.length < 2) {
            if (currentRoom.players.length === 0) {
                currentRoom.players.push({
                    socketID: socket.id,
                    color: 'red-player'
                });
            }
            else {
                currentRoom.players.push({
                    socketID: socket.id,
                    color: 'black-player'
                })
            }
        }
        

        let damka
        if (currentRoom.players.length === 1) {
            let turn = 'red-player';
            let board = [];
            boardSetup(board, 8);
            playerSetup(board, 12,12)
            damka = {
                room: roomName,
                turn,
                board
            }
            currentRoom.players[0].damka = damka
        }
        else {
            damka = currentRoom.players[0].damka
        }

        rooms[rooms.length-1] = currentRoom
        let currentPlayer = currentRoom.players.find(player => player.socketID === socket.id) // u can do better
        
        socket.emit('setupBoard', damka)

        socket.on('clickOnPlayer', (id) => {
        if (currentPlayer.color === damka.turn) {
            arr = clickedPlayer(damka, id) 
            socket.emit('markGreen', arr)
        }
        })
    
        socket.on('clickOnSquare', (id) => {
        console.log('tje tien isssssssssssssssss ' + damka.turn);
        clickedSquare(damka, id)
        console.log('tje tien isssssssssssssssss ' + damka.turn);
        currentRoom.players.forEach(player => {
            socket.to(player.socketID).emit('printBoard', damka)
        })
        socket.emit('printBoard', damka)
        })


    })



 


    {// lobby
    socket.on('join', username => {
        let {updateArr, error} = addUser(onlineUsers, username, socket.id)
        onlineUsers = updateArr
        if (error) {
            console.log('Erorrr' + onlineUsers);
            socket.emit('alreadyLogged')
        }
        io.emit('update', onlineUsers)
    })
    
    

    socket.on('sendInvitation', (socketID, username) => {
        io.to(socketID).emit('getInvitation', socket.id)
    })

    socket.on('accept', (socketID,room) => {
        socket.join(room) 
        io.to(socketID).emit('startAroom', room, cb => {
            socket.join(room)
        })
    })


    socket.on('startGame', (mongooseID, room) => {
        socket.join(room)
    })

    socket.on('disconnect', () => {
        
        let {updateArr, error} = removeUser(onlineUsers, socket.id)
        if(error) {
            // console.log('cant remove' + socket.id + 'from' + onlineUsers);
        }

        onlineUsers = updateArr
        io.emit('update', onlineUsers)
    })
}
})



