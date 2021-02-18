import '../../sass/ppoppi.scss';

import React from 'react';

import { Panel } from './sidebar/panel';
import { Main } from './main/main';
import { StatusMessage } from './statusmessage';

//utils
import { handleSignIn, listenToUserInfo } from '../utils/firebaseFunctions'
import { FirebaseContext } from '../utils/firebasecontext'
import { setUserOnline, initSocket } from '../utils/presence';

import placeholderPicture from '../../assets/ppoppi.png'



const settingsvg = (
    <svg id='ppoppi-settings-svg' width="28" height="28">
        <path d="M11.2493 14.0001C11.2493 12.4557 12.4804 11.2009 13.998 11.2009C15.5157 11.2009 16.7468 12.4557 16.7468 14.0001C16.7468 15.5444 15.5157 16.7994 13.998 16.7994C12.4804 16.7994 11.2493 15.5444 11.2493 14.0001Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.3943 0H17.6005L17.9057 1.5618L17.9068 1.56713L18.4088 4.05993C19.1247 4.38174 19.7887 4.78018 20.4028 5.23116L22.9124 4.37588L24.3999 3.90615L25.1767 5.26363L27.2061 8.72486L28 10.1125L26.8177 11.163L24.9354 12.7951C24.9945 13.1614 25.0493 13.5749 25.0493 13.9999C25.0493 14.425 24.9945 14.8386 24.9354 15.2049L26.8261 16.8443L28 17.8875L27.2011 19.2836L25.1769 22.736L24.3999 24.0973L22.8932 23.6178L20.4028 22.7688C19.7887 23.2198 19.1247 23.6182 18.4088 23.94L17.9068 26.4327L17.9057 26.4381L17.6005 28H10.3943L10.0919 26.4347L9.58802 23.9401C8.87197 23.6183 8.2079 23.2199 7.5937 22.7688L5.08587 23.6235L3.59523 24.0977L2.82096 22.7353L0.789556 19.2735L0 17.8875L1.17881 16.837L3.06179 15.2044C3.0029 14.839 2.94723 14.4239 2.94723 13.9999C2.94723 13.576 3.00289 13.1609 3.06178 12.7956L1.16938 11.1548L3.97586e-05 10.1125L0.795576 8.71592L2.82122 5.26429L3.59524 3.90571L5.10334 4.3822L7.5937 5.23116C8.20787 4.78011 8.87194 4.38162 9.58802 4.05979L10.0919 1.56515L10.3943 0ZM13.998 9.33307C11.4695 9.33307 9.41673 11.423 9.41673 14.0001C9.41673 16.5771 11.4694 18.6672 13.998 18.6672C16.5266 18.6672 18.5793 16.5771 18.5793 14.0001C18.5793 11.423 16.5266 9.33307 13.998 9.33307Z" />
    </svg>
)

export class Ppoppi extends React.Component {

    //this.unsubUserInfo function to close subscription to user info updates

    constructor() {
        super()
        console.log('ppoppi called')
        this.state = {
            loggedIn: false,
            username: 'loading...',
            userStatus: 'status-offline',
            userPicture: placeholderPicture,
            statusMessage: ''
        }
        this.handleSignIn = handleSignIn.bind(this)
        this.listenToUserInfo = listenToUserInfo.bind(this)



    }

    gotoLogin() {
        //redirect to login page if not logged in
        let loc = new URL(window.location);
        loc = loc.origin
        window.location = loc + '/login'
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

                this.handleSignIn(user)
                    .then((data) => {
                        console.log(data)
                        console.log('setstate called loggedin true and userREf')
                        this.setState({
                            loggedIn: true,
                            userRef: this.db.collection('users').doc(user.uid),
                            online: data.online,
                            videoroomID: data.videoroomID,
                            statusMessage: data.statusMessage,
                            username: data.username
                        })
                        this.unsubUserInfo = this.listenToUserInfo(user)
                        initSocket()
                    }).then(() => {
                        setUserOnline(user.uid)
                    })

            } else {
                //redirect to login page if not logged in
                this.gotoLogin();
            }
        }.bind(this));

    }

    componentWillUnmount() {
        this.unsubUserInfo()
    }


    render() {
        return (

            <div id='ppoppi-wrapper' className="" >


                <div id='topbar'>
                    <div className='topbar-logo'>
                        <svg width="46" height="28" viewBox="0 0 46 28" style={{ marginRight: '15px' }} >
                            <path d="M32.2641 17.8422C32.2641 12.6801 26.836 12.6801 22.685 12.6801C18.5341 12.6801 12.6802 12.6801 12.6802 17.8422C12.6802 23.0043 18.268 27.4213 22.685 27.4213C27.1021 27.4213 32.2641 23.0043 32.2641 17.8422Z" fill="black" stroke="black" />
                            <ellipse cx="6.59895" cy="6.38608" rx="6.59895" ry="6.38608" fill="black" />
                            <ellipse cx="38.7968" cy="6.38608" rx="6.59895" ry="6.38608" fill="black" />
                        </svg>

                            PPoPPi
                        </div>
                    <div id='status-message'>
                        <StatusMessage userRef={this.state.userRef} statusMessage={this.state.statusMessage} />
                    </div>
                </div>
                <div id='sidebar'>

                    <div id='channels-panel-wrapper'>
                        <Panel videoroomID={this.state.videoroomID} />
                    </div>
                    <div id='channels-wrapper'>
                        {/* <Channels channels={this.state.channels} /> */}
                    </div>
                    {settingsvg}

                </div>
                <div id='main-wrapper'>
                    {/* need to fix */}
                    {/* <UserContext.Provider value={this.state}>
                        {this.state.online && <Main />}
                    </UserContext.Provider> */}
                </div>

            </div>
        )
    }
}

Ppoppi.contextType = FirebaseContext
