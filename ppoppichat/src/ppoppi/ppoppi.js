import React from 'react';

import './ppoppi.scss';

import firebase from '../home/fire'

import { Panel } from './sidebar/panel';
import { Main } from './main/main';
import { Channels } from './sidebar/channels';


import placeholderPicture from './poppi.png'
import { handleSignIn, listenToUserInfo } from './firebaseFunctions'
import { setUserOnline } from './presence';
import { StatusMessage } from './statusmessage';



const FireContext = React.createContext(firebase);

export class Ppoppi extends React.Component {

    //this.unsubUserInfo function to close subscription to user info updates

    constructor() {
        super()
        this.state = {
            loggedIn: false,
            userName: 'loading...',
            userStatus: 'status-offline',
            userPicture: placeholderPicture,
            statusMessage: ''
        }
        this.handleSignIn = handleSignIn.bind(this)
        this.listenToUserInfo = listenToUserInfo.bind(this)


        //connect to presence socket


    }

    componentDidMount() {
        //check if logged in,
        //redirect to login page if not logged in
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.   
                this.db = firebase.firestore();
                this.userRef = this.db.collection('users').doc(user.uid)

                this.handleSignIn(user)
                    .then(() => {
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
                            {this.state.userName}
                        </div>
                    </div>
                    <div id='status-message'>

                        <StatusMessage userRef={this.userRef} >
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
                    <Main loggedin={this.state.loggedIn} ></Main>
                </div>
            </div>
        )
    }
}
