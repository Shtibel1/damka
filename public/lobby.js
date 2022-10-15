'use strict'


const socket = io()

const username = document.querySelector('h1').innerText.slice(6);
const ul = document.querySelector('ul')
const logoutButton = document.querySelector('.logout')
const invitaion = document.querySelector('.invitation')
const accept = document.querySelector('.accept')
const decline = document.querySelector('.decline')
const form = document.querySelector('form')



socket.emit('join', username)

socket.on('update', onlineUsers => {
    console.log(onlineUsers);
    ul.innerHTML = ''
    onlineUsers.forEach(user => {
        let div = document.createElement('div')
        let li = document.createElement('li')
        let button = document.createElement('button')
        button.classList.add('invite-button')
        button.innerText = 'הזמן'
        button.setAttribute('id', `${user.socketID}`)

        div.innerText = user.username
        li.append(div)
        li.append(button)
        ul.append(li)
        
    })

    document.querySelectorAll('.invite-button').forEach(button => {button.addEventListener('click', (e) => {
            button.setAttribute('disabled', 'disabled')
            socket.emit('sendInvitation', button.getAttribute('id'), username)
    })})


})


socket.on('getInvitation', (socketID, username) => {
    invitaion.classList.remove('hidden')

    accept.addEventListener('click', (e) => {
        let room = Math.floor(Math.random() * 100)
        socket.emit('accept', socketID, room)
        location.href = `/damka?room=${room}`
    })

    decline.addEventListener('click', (e) => {
        invitaion.classList.add('hidden')
    })
})


socket.on('startAroom', (room, cb) => {
    console.log('im hereee')
    location.href = `/damka?room=${room}`
    cb(room)
})


