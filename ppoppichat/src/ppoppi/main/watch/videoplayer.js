import React from 'react';
//import ReactPlayer from 'react-player/youtube'
//import { useDocument } from 'react-firebase-hooks/firestore';
import { fire } from '../../../firebasecontext'
// Only loads the YouTube player
import PlyrJs from 'plyr'
import 'plyr-react/dist/sass/plyr.scss'
import './videoplayer.scss'

import { videoControl } from '../../presence'

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


const defaultVideoUrl = 'https://www.youtube.com/watch?v=Gspl9LFjPZc'

export class VideoPlayer extends React.Component {
    constructor(props) {
        super(props)
        //this.player = React.createRef()
        console.log('video player called')

    }



    componentDidMount() {
        this.videoroomID = window.location.pathname.split('/').pop();
        //default state
        // window.videoState = {
        //     currentTime: 0,
        //     playing: false,
        //     speed: 1,
        //     currentVideo: defaultVideoUrl
        // }

        // this.owo = debounce(function (uwu) {
        //     if (window.plyr !== this.player.current.plyr) {
        //         window.plyr = this.player.current.plyr
        //     }
        //     this.setVideoState(window.plyr)
        //     videoControl(window.videoState)
        //     console.log('owo ', window.videoState)
        //     //console.log(uwu)
        // }, 100)


        // this.unsub = fire.firestore().doc('videorooms/' + this.videoroomID + '/videoState/videoState')
        //     .onSnapshot(function (value) {
        //         //console.log("Current data: ", value.data());
        //         this.value = value
        //     }.bind(this));
        // console.log(this.player.current)
        // //this.plyr = this.player.current.plyr
        // setTimeout(() => {
        //     window.plyr = this.player.current.plyr
        // }, 300)
    }




    render() {

        return (
            <div>
                <PlyrWrapper videoroomID={this.videoroomID} />
            </div>
        )




    };
}

class PlyrWrapper extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            source: {
                type: 'video',
                sources: [
                    {
                        src: defaultVideoUrl,
                        provider: 'youtube',
                    },
                ]
            },
            mediaprovider: 'youtube'
        }
        this.playerRef = React.createRef();
    }

    setCurrentVideo = (source) => {
        this.setState({
            source: source
        })
    }

    setVideoState(videoplayer) {
        window.videoState = {
            currentTime: videoplayer.currentTime,
            playing: videoplayer.playing,
            speed: videoplayer.speed
        }
    }

    componentDidMount() {

        this.owo = debounce(function (uwu) {
            this.setVideoState(window.plyr)
            videoControl(window.videoState)
            console.log('owo ', window.videoState)
            //console.log(uwu)
        }, 100)

        this.options = {
            listeners: {//listen to user controls and emit 
                play: (e) => {
                    this.owo()
                },
                pause: (e) => {
                    this.owo()

                },
                seek: (e) => {
                    this.owo()
                },
                restart: (e) => {
                    this.owo()
                },
                rewind: (e) => {
                    this.owo()
                },
                fastForward: (e) => {
                    this.owo()
                },
                speed: (e) => {
                    this.owo()
                },
                fullscreen: (e) => {
                    //slider bar input
                    e.preventDefault()
                    console.log('seek ', e)

                },
            },
            keyboard: { focused: false, global: false },
            controls: [
                'play-large', // The large play button in the center
                'restart', // Restart playback
                'rewind', // Rewind by the seek time (default 10 seconds)
                'play', // Play/pause playback
                'fast-forward', // Fast forward by the seek time (default 10 seconds)
                'progress', // The progress bar and scrubber for playback and buffering
                'current-time', // The current time of playback
                'duration', // The full duration of the media
                'volume', // Volume control
                'settings', // Settings menu
                'fullscreen', // Toggle fullscreen
            ],
            seekTime: 5,
            autoplay: true
        }

        this.player = new PlyrJs(this.playerRef.current, this.options);
        console.log(this.owo, this.playerRef.current)

        this.player.on('ready', e => {
            console.log('ready')
            window.plyr = this.player

        })


    }

    render() {
        console.log(this.state.source)
        if (this.state.mediaprovider === 'youtube') {
            return (
                <div ref={this.playerRef} className="plyr__video-embed" id="player">
                    <iframe
                        title='youtube player'
                        src="https://www.youtube.com/embed/bTqVqk7FSmY?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                        allowfullscreen
                        allowtransparency
                        allow="autoplay"
                    ></iframe>
                </div>

            )
        } else if (this.state.mediaprovider === 'vimeo') {
            return (
                <div ref={this.playerRef} id="player">
                    hello
                </div>
            )
        } else if (this.state.mediaprovider === 'html5') {
            return (
                <div ref={this.playerRef} id="player">
                    hello
                </div>
            )
        } else {
            return (
                <div ref={this.playerRef} id="player">
                    hello
                </div>
            )
        }

    }

}

