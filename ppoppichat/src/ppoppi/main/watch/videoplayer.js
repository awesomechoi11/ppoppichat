import React from 'react';
//import ReactPlayer from 'react-player/youtube'
//import { useDocument } from 'react-firebase-hooks/firestore';
import { fire } from '../../../firebasecontext'
// Only loads the YouTube player
import PlyrJs from 'plyr'
import 'plyr-react/dist/sass/plyr.scss'
import './videoplayer.scss'

import { joinVideoroomSocket, requestNextVideo } from '../../presence'

import { videoControl } from '../../presence'


import isEqual from 'lodash.isequal'

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


const defaultVideoUrl = 'https://youtu.be/Er7PfXBZg6o'

export class VideoPlayer extends React.Component {
    constructor(props) {
        super(props)
        //this.player = React.createRef()
        console.log('video player called')
        this.videoroomID = window.location.pathname.split('/').pop();
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
            }
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

    buildSource(data) {
        var source = {}
        const defaultVideo = {
            type: 'video',
            sources: [
                {
                    src: defaultVideoUrl,
                    provider: 'youtube',
                },
            ]
        }
        if (!data) {
            return defaultVideo;
        }
        if (data.length < 1) {
            return defaultVideo;
        }
        if (data.type === 'youtube' ||
            data.type === 'vimeo') {
            source.type = 'video'
            source.title = data.videoInfo.title
            source.poster = data.videoInfo.thumbnail
            source.sources = [
                {
                    provider: 'youtube',
                    src: data.url
                }
            ]
        } else if (data.type === 'html5') {
            source.type = 'video'
        } else {
            return defaultVideo;
        }
        return source
    }

    componentDidMount() {

        this.owo = debounce(function (uwu) {
            this.setVideoState(window.plyr)
            videoControl(window.videoState)
            console.log('sending videostate ', window.videoState)
            //console.log(uwu)
        }, 100)

        this.options = {
            listeners: {//listen to user controls and emit 
                play: (e) => { this.owo() },
                pause: (e) => { this.owo() },
                seek: (e) => { this.owo() },
                restart: (e) => { this.owo() },
                rewind: (e) => { this.owo() },
                fastForward: (e) => { this.owo() },
                speed: (e) => { this.owo() },
                fullscreen: (e) => {
                    //slider bar input
                    e.preventDefault()
                    //console.log('seek ', e)

                },
                ended: (e) => {
                    console.log('video ended, requesting next video')
                    requestNextVideo(this.currentVideo, this.videoroomID)
                }
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
            autoplay: true,
            settings: ['captions', 'quality', 'speed']
        }

        this.player = new PlyrJs('#player', this.options);

        this.youtubeAutoplayState = false;
        this.player.once('ready', e => {
            console.log('video player is ready')
            window.plyr = this.player

            joinVideoroomSocket(this.props.videoroomID)

            this.player.on('ended', e => {
                console.log('video ended, requesting next video')
                requestNextVideo(this.currentVideo, this.props.videoroomID)
            })

            this.player.on('loadeddata', e => {
                console.log('loaded132231123')
            })
            console.log(e)
            this.player.on('statechange', e => {
                console.log('youtube ', e)
                if (e.detail.code === -1) {

                }
            })

            this.unsub = fire.firestore().doc('/videorooms/' + this.props.videoroomID + '/videoState/queue')
                .onSnapshot(function (value) {
                    if (value.exists) {
                        //if item 0 is not equal to current video
                        if (!isEqual(this.buildSource(value.data().queue[0]), this.state.source)) {
                            this.currentVideo = value.data().queue[0]
                            window.currentVideo = this.currentVideo
                            console.log('new source ', this.buildSource(this.currentVideo))
                            this.setState({
                                source: this.buildSource(this.currentVideo)
                            })
                        }
                    }
                }.bind(this));
        })



    }

    componentDidUpdate() {
        console.log('did update')
        if (window.plyr) {

            if (window.plyr.source !== this.state.source) {
                //console.log('this')
                window.plyr.source = this.state.source
            }
        }
    }

    render() {
        //this.source = this.state.source
        //console.log(this.source)
        console.log('render video player ', this.state)
        if (this.state.source) {
            if (this.state.source.type === 'video') {
                if (this.state.source.sources[0].provider === 'youtube' ||
                    this.state.source.sources[0].provider === 'vimeo') {
                    console.log(this.state.source.sources[0].src)
                    return (
                        <div class="plyr__video-embed" id="player">
                            <iframe
                                title='video player'
                                src={this.state.source.sources[0].src}
                                allowfullscreen
                                allowtransparency
                                allow="autoplay"
                            ></iframe>
                        </div>
                    )
                } else {
                    <video id="player" playsinline controls >
                        <source src={this.state.source.sources[0].src} type="video/mp4" />
                    </video>
                }
            } else if (this.state.source.type === 'audio') {

            } else {
                return (
                    <div ref={this.playerRef} id="player">
                        source object error
                    </div>
                )
            }
        } else {
            return (
                <div ref={this.playerRef} id="player">
                    please add a video
                </div>
            )
        }


    }

}

