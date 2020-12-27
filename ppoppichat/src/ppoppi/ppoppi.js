import React from 'react';

import './ppoppi.scss';

//import firebase from '../home/fire'

import { Panel } from './sidebar/panel';
import { Main } from './main/main';
import { Channels } from './sidebar/channels';


import placeholderPicture from './poppi.png'
import { handleSignIn, listenToUserInfo } from './firebaseFunctions'
import { setUserOnline } from './presence';
import { StatusMessage } from './statusmessage';


import { FirebaseContext, UserContext } from '../firebasecontext'


export class Ppoppi extends React.Component {

    //this.unsubUserInfo function to close subscription to user info updates

    constructor() {
        super()
        console.log('ppoppi called')
        this.state = {
            loggedIn: false,
            nickname: 'loading...',
            userStatus: 'status-offline',
            userPicture: placeholderPicture,
            statusMessage: ''
        }
        this.handleSignIn = handleSignIn.bind(this)
        this.listenToUserInfo = listenToUserInfo.bind(this)



    }

    componentDidMount() {

        //check if logged in,
        //redirect to login page if not logged in
        this.fire = this.context

        //check user login state
        this.fire.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.   
                this.db = this.fire.firestore();

                //this.userRef = this.db.collection('users').doc(user.uid)
                // console.log('setstate userref set')
                // this.setState({
                //     userRef: this.db.collection('users').doc(user.uid)
                // })


                this.handleSignIn(user)
                    .then(() => {
                        console.log('setstate called loggedin true and userREf')
                        this.setState({
                            loggedIn: true,
                            userRef: this.db.collection('users').doc(user.uid)
                        })
                        this.unsubUserInfo = this.listenToUserInfo(user)
                    }).then(() => {
                        setUserOnline(user.uid)
                    })

            } else {
                //redirect to login page if not logged in
                let loc = new URL(window.location);
                loc = loc.origin
                window.location = loc + '/login'
            }
        }.bind(this));

    }

    componentWillUnmount() {
        this.unsubUserInfo()
    }

    render() {
        return (

            <div id='ppoppi-wrapper' className="" >
                <div id='sidebar'>
                    <div id='main-user-wrapper'>
                        <div id='user-status' className={this.state.userStatus}></div>

                        <img
                            id='user-picture'
                            alt='User profile'
                            src={this.state.userPicture}
                        >

                        </img>

                        <div id='user-name'>
                            {this.state.nickname}
                        </div>
                    </div>
                    <div id='status-message'>

                        <StatusMessage userRef={this.state.userRef} >
                            {this.state.statusMessage}
                        </StatusMessage>



                    </div>
                    <div id='channels-wrapper'>
                        <div id='channels-panel-wrapper'>
                            <Panel
                                videoroomID={this.state.videoroomID}
                            />
                        </div>
                        <hr className='divider'></hr>
                        <div id='channels-wrapper'>

                            <Channels channels={this.state.channels} />


                        </div>
                    </div>
                </div>
                <div id='main-wrapper'>
                    <div id='topbar'>

                    </div>
                    {this.state.online && <Main userData={this.state} />}
                </div>
            </div>
        )
    }
}

Ppoppi.contextType = FirebaseContext