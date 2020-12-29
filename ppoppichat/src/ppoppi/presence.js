import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

socket.on("connect", () => {
    console.log('connected to socket server')
})


function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


//const uwu = debounce()


socket.on('videoControl', (videoState) => {
    if (window.plyr) {
        console.log(window.plyr.playing !== videoState.playing, Math.abs(window.plyr.currentTime - videoState.currentTime) > 0.3)
        //console.log(Math.abs(window.plyr.currentTime - videoState.currentTime) > 0.3)
        if (
            (Math.abs(window.plyr.currentTime - videoState.currentTime) > 0.3) ||
            (window.plyr.playing !== videoState.playing)
        ) {
            console.log('need to update ', videoState)
            if (window.plyr.playing !== videoState.playing) {
                window.plyr.playing ? window.plyr.pause() : window.plyr.play();
            }
            if (Math.abs(window.plyr.currentTime - videoState.currentTime) > 0.3) {
                window.plyr.currentTime = videoState.currentTime
            }
        }
    }
})

socket.on("requestVideoState", () => {
    console.log('connected to socket server')
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

