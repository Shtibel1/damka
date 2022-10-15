

function addUser(onlineUsersArr = [], username, socketID) {
    const existingUser = onlineUsersArr.find((user) => user.username === username)

    if (existingUser) return {updateArr: [], error: true}
    

    const user = {username, socketID }
    onlineUsersArr.push(user)
    return {updateArr: onlineUsersArr, error: false} 
}

function removeUser(onlineUsersArr, socketID) {
    const index = onlineUsersArr.findIndex((user) => user.socketID == socketID)
    if (index === -1) return {updateArr: onlineUsersArr, error: true}

    let a = onlineUsersArr.splice(index, 1)[0]
    return {updateArr: onlineUsersArr, error: false}
}


module.exports = {
    addUser,
    removeUser
}