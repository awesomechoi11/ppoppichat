import React from 'react';

import firebase from './fire'

import './login.scss';

//import { useAuthState } from 'react-firebase-hooks/auth';



export class Login extends React.Component {

    constructor(props) {
        super(props)

        this.provider = new firebase.auth.GoogleAuthProvider();
        this.state = { loginStatus: 'loading' }
    }



    opensigninpopup() {

        firebase.auth().signInWithPopup(this.provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log(token)
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
    signout() {
        this.setState({
            loginStatus: 'signing out'
        })
        firebase.auth().signOut().then(function () {
            this.setState({
                loginStatus: 'not signed in',
                onclick: this.opensigninpopup.bind(this)
            })
        }).catch(function (error) {
            // An error happened.
        });

    }

    componentDidMount() {
        console.log(this.provider)
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user.email)
                // User is signed in.   
                this.setState({
                    loginStatus: 'signed in, click to sign out',
                    onclick: this.signout.bind(this)
                })
            } else {
                console.log('not signed in')
                // No user is signed in.
                //this.onclick = this.openpopup
                this.setState({
                    loginStatus: 'not signed in',
                    onclick: this.opensigninpopup.bind(this)
                })
            }
        }.bind(this));




    }

    render() {

        return (

            <div className="login app-page" >
                <div
                    onClick={this.state.onclick}
                    id='placeholderbutton'>
                    {this.state.loginStatus}
                </div>
            </div>
        )
    }
}


