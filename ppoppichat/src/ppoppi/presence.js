import openSocket from 'socket.io-client';

function initSocket() {
}
var socket
if (process.env.NODE_ENV === 'development') {
    socket = openSocket('http://localhost:8086');
} else {
    socket = openSocket('https://presence.ppoppichat.xyz');
}

socket.on("connect", () => {
    console.log(process.env.NODE_ENV, 'connected to socket server')
})

socket.on("uwu", () => {
    console.log('user is on another tab')
})


function setVideoState(videoState) {
    if (!videoState) {
        return
    }
    if (window.plyr.playing !== videoState.playing) {
        console.log('need to update playing')
        window.plyr.playing ? window.plyr.pause() : window.plyr.play();
    }
    if (Math.abs(window.plyr.currentTime - videoState.currentTime) > 0.3) {
        console.log('need to update time')
        window.plyr.currentTime = videoState.currentTime
    }
    if (window.plyr.speed !== videoState.speed) {
        console.log('need to update speed')
        window.plyr.speed = videoState.speed
    }
}

socket.on('videoControl', (videoState) => {
    if (window.plyr) {

        setTimeout(() => { setVideoState(videoState) }, 100)
    } else {
        window.prevState = videoState;
    }
})

socket.on("requestVideoState", () => {
    console.log('requested videostate, emitting')
    socket.emit('videoControl', window.videoState)
})


export function setUserOnline(uid) {
    console.log('set user online ', uid)
    socket.emit('add user', uid)
}


export function joinVideoroomSocket(id) {
    console.log('attempting to join room')
    socket.emit('joinVideoroom', id)
}


export function leaveVideoroomSocket(id) {
    socket.emit('leaveVideoroom', id)
}

export function videoControl(videoState) {
    socket.emit('videoControl', videoState)
}

export function requestNextVideo(currentVideo, videoroomID) {
    socket.emit('requestNextVideo', { currentVideo: currentVideo, videoroomID: videoroomID })
}