import React from 'react';
//import ReactPlayer from 'react-player/youtube'
//import { useDocument } from 'react-firebase-hooks/firestore';
import { fire } from '../../../firebasecontext'
// Only loads the YouTube player
import Plyr from 'plyr-react'
import 'plyr-react/dist/sass/plyr.scss'
import './videoplayer.scss'

export class VideoPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.player = React.createRef()
        console.log('video player const')
        this.videoroomID = window.location.pathname.split('/').pop();
        this.state = {//default video
            source: {
                type: 'video',
                sources: [
                    {
                        src: 'https://www.youtube.com/watch?v=Gspl9LFjPZc',
                        provider: 'youtube',
                    },
                ]
            }
        }
        //console.log(this.state.player)
    }


    setCurrentVideo = (source) => {
        this.setState({
            source: source
        })
    }

    componentDidMount() {
        console.log('videoplayer mounted')

        console.log(this.player)
        //console.log(this.player)
        //this.setState({ player: this.player })
        //console.log(this.state.player)

    }
    //                        ref={(player) => (!this.state.player && this.setState({ player: player }))}
    //this.setState(player => ({ player: player ?? plyr }))
    //                    <VideoControls videoroomID={this.videoroomID} plyr={this.player.current.plyr} setCurrentVideo={this.setCurrentVideo} />

    render() {
        console.log(this.state.player)
        if (this.state.source) {
            if (this.state.player) {
                return (
                    <div>
                        <Plyr
                            source={this.state.source}
                        />
                        <VideoControls videoroomID={this.videoroomID} plyr={this.state.player} setCurrentVideo={this.setCurrentVideo} />
                    </div>
                )
            } else {

                return (
                    <div>
                        <Plyr
                            ref={(player) => (this.setState({ player: player }))}
                            source={this.state.source}
                        />
                    </div>
                )
            }
        } else {
            return (
                <div>
                    pls add a video
                </div>
            )
        }

        //console.log(value)
        // if (this.value) {
        //     if (this.value.exists) {
        //         console.log(this.value.data().queue[0])
        //         return (
        //             <div>
        //                 <Plyr
        //                     ref={this.setPlayer}
        //                     source={
        //                         {

        //                             type: 'video',
        //                             sources: [
        //                                 {
        //                                     src: this.value.data().queue[0].id,
        //                                     provider: this.value.data().queue[0].type,
        //                                 },
        //                             ],
        //                             previewThumbnails: {
        //                                 src: this.value.data().queue[0].videoInfo.thumbnail,
        //                             },
        //                         }
        //                     }
        //                 />
        //                 <VideoControls player={this.state.player} setCurrentVideo={this.setCurrentVideo} />
        //             </div>
        //         )
        //     } else {
        //         return (
        //             <div>
        //                 error!!!
        //             </div>
        //         )
        //     }
        // } else {
        //     return (
        //         <div>
        //             pls add a video
        //         </div>
        //     )
        // }
    };




}


class VideoControls extends React.Component {
    constructor(props) {
        super(props)
        this.player = this.props.player
        console.log(this.props)

        //console.log(this.state.player)
    }

    componentDidMount() {
        //console.log(this.props.videoroomID)
        if (this.props.player) {
            console.log(this.props.player)
            this.unsub = fire.firestore().doc('videorooms/' + this.props.videoroomID + '/videoState/videoState')
                .onSnapshot(function (value) {
                    console.log(value.metadata)
                    console.log("Current data: ", value.data());
                    this.value = value
                }.bind(this));

            this.player = this.props.player
            console.log(this.player)
        }
        // console.log(player)
        // player.once('ready', event => {
        //     const instance = event.detail.plyr;
        //     console.log(1232131231323)
        //     player.on('ended', event => {
        //         console.log('video ended')
        //     });
        //     player.on('seeked', event => {

        //         console.log('seek')
        //     });
        //     player.on('pause', event => {

        //         console.log('pause')
        //     });
        //     player.on('play', event => {

        //         console.log('play ', event)
        //     });
        //     player.on('ratechange', event => {

        //         console.log('speed')
        //     });
        // });

    }

    componentWillUnmount() {
        if (this.unsub) {
            this.unsub()
        }
        if (this.player) {

        }
    }

    render() {

        return (
            <div></div>
        )
    }


}