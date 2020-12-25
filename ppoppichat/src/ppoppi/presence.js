import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

export function setUserOnline(uid) {
    console.log('set user online ', uid)
    socket.emit('add user', uid)
}
