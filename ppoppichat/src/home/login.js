import React from 'react';
import { useHistory } from "react-router-dom";
import firebase from './fire'

import './login.scss';

//import { useAuthState } from 'react-firebase-hooks/auth';


function EnterButton(props) {
    //const isLoggedIn = props.isLoggedIn;
    let history = useHistory();
    if ('signed in, click to sign out' === props.isLoggedIn) {
        return (

            <button
                onClick={function () {
                    history.push("/ppoppi");
                }}
            >
                heloo click to enter!!
            </button>
        )
    }
    return null;
}

export class Login extends React.Component {

    constructor(props) {
        super(props)
        //console.log(this.context)
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
            console.log(firebase)
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
        //reset login message
        firebase.auth().signOut().then(function () {
            this.setState({
                loginStatus: 'not signed in, click to sign in',
                onclick: this.opensigninpopup.bind(this),
                message: 'pls log in >:))'
            })
        }).catch(function (error) {
            // An error happened.
        });

    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //console.log(user)
                // User is signed in.   
                this.setState({
                    loginStatus: 'signed in, click to sign out',
                    onclick: this.signout.bind(this),
                    message: 'Hello owo ' + user.displayName
                })
            } else {
                // No user is signed in.
                //this.onclick = this.openpopup
                this.setState({
                    loginStatus: 'not signed in',
                    onclick: this.opensigninpopup.bind(this),
                    message: 'pls log in >:))'
                })
            }
        }.bind(this));




    }

    render() {

        return (

            <div className="login app-page" >
                <div id='login-platform'>
                    <span>
                        {this.state.message}
                    </span>
                    <br />
                    <span>these are placeholders.</span>
                    <br />
                    <button
                        onClick={this.state.onclick}
                    >{this.state.loginStatus}</button>
                    <EnterButton isLoggedIn={this.state.loginStatus}></EnterButton>

                </div>

            </div>
        )
    }
}

