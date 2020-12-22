import React from 'react';

import './ppoppi.scss';

import firebase from '../home/fire'

import { Panel } from './sidebar/panel';
import { Main } from './main/main';

import placeholderPicture from './poppi.png'


export class Ppoppi extends React.Component {

    constructor() {
        super()
        this.state = {
            userName: 'loading...',
            userStatus: 'status-offline',
            userPicture: placeholderPicture
        }

    }

    componentDidMount() {
        //check if logged in,
        //redirect to login page if not logged in
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {

                console.log(user)
                //console.log(user)
                // User is signed in.   
                this.setState({
                    userName: user.displayName,
                    userStatus: 'status-online',
                    userPicture: user.photoURL
                })

            } else {
                //redirect to login page if not logged in
                let loc = new URL(window.location);
                loc = loc.origin
                window.location = loc + '/login'
            }
        }.bind(this));
    }

    redirecthome() {

    }

    render() {
        return (

            <div id='ppoppi-wrapper' className="" >
                <div id='sidebar'>
                    <div id='main-user-wrapper'>
                        <div id='user-status' className={this.state.userStatus}></div>

                        <img
                            id='user-picture'
                            src={this.state.userPicture}
                        >

                        </img>

                        <div id='user-name'>
                            {this.state.userName}
                        </div>
                    </div>
                    <div id='channels-wrapper'>
                        <div id='channels-panel-wrapper'>
                            <Panel />
                        </div>
                        <hr className='divider'></hr>
                        <div id='channels'>
                            dsa
                        </div>
                    </div>
                </div>
                <div id='main-wrapper'>
                    <div id='topbar'>

                    </div>
                    <Main></Main>
                </div>
            </div>
        )
    }
}
