import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

socket.on("connect", () => {
    console.log('connected to socket server')
})


function setVideoState(videoState) {
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
        if (window.prevState) {
            videoState = window.prevState
        }
        if (!window.plyr.ready) {
            return
        }
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
    socket.emit('joinVideoroom', id)
}


export function leaveVideoroomSocket(id) {
    socket.emit('leaveVideoroom', id)
}

export function videoControl(videoState) {
    socket.emit('videoControl', videoState)
}

