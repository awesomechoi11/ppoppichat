import React from 'react';
import { useHistory } from "react-router-dom";
//import fire from './fire'

import './login.scss';

import { FirebaseContext } from '../firebasecontext'

import anime from 'animejs/lib/anime.es.js';

import { Formik, Field, Form } from 'formik';

import anonpng from './anon.png';
import fbpng from './facebook.png';
import gpng from './google.png';

import { motion, AnimatePresence } from "framer-motion";



const loginButtonSvg = (
    <svg id='loginButtonSvg' width="120" height="120" viewBox="0 0 120 120" >
        <rect x="0.5" y="0.5" width="119" height="119" rx="29.5" stroke="black" />
        <path d="M93.7678 61.7678C94.7441 60.7915 94.7441 59.2085 93.7678 58.2322L77.8579 42.3223C76.8816 41.346 75.2986 41.346 74.3223 42.3223C73.346 43.2986 73.346 44.8816 74.3223 45.8579L88.4645 60L74.3223 74.1421C73.346 75.1184 73.346 76.7014 74.3223 77.6777C75.2986 78.654 76.8816 78.654 77.8579 77.6777L93.7678 61.7678ZM27 62.5H92V57.5H27V62.5Z" fill="black" />
    </svg>

)


function EnterButton(props) {
    //const isLoggedIn = props.isLoggedIn;
    let history = useHistory();

    if (props.loginType === 'email') {
        return (

            <button id='loginbutton' type="submit" form='login-form'>
                {loginButtonSvg}
            </button>
        )
    } else if (props.loginType === 'google') {
        return (

            <button id='loginbutton' onClick={() => { history.push('/ppoppi') }}>
                {loginButtonSvg}
            </button>
        )
    } else if (props.loginType === 'facebook') {
        return (

            null
        )
    } else if (props.loginType === 'anon') {
        return (

            null
        )
    } else {
        return (

            <div>
                uwu
            </div>
        )
    }


}

export class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = { loggedIn: false, loginType: 'email' }
        this.handleChange = this.handleChange.bind(this);
        this.googlesignin = this.googlesignin.bind(this)
        this.signout = this.signout.bind(this)
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

    }


    googlesignin() {
        this.provider = new this.fire.auth.GoogleAuthProvider();
        this.fire.auth().onAuthStateChanged(function (user) {
            if (user) {
                //console.log(user)
                // User is signed in.   
                this.setState({ loggedIn: true, username: user.displayName, loginType: 'google' })
            } else {
                // No user is signed in.
                //this.onclick = this.openpopup
                this.setState({ loggedIn: false })
                this.fire.auth().signInWithPopup(this.provider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    //var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    this.setState({ loggedIn: true, username: user.displayName, loginType: 'google' })
                    // ...
                    //console.log(fire)
                }).catch(function (error) {
                    // Handle Errors here.
                    //var errorCode = error.code;
                    //var errorMessage = error.message;
                    console.log(error)
                    // The email of the user's account used.
                    //var email = error.email;
                    // The this.fire.auth.AuthCredential type that was used.
                    //var credential = error.credential;
                    // ...
                });
            }
        }.bind(this));

    }
    signout() {

        //reset login message
        this.fire.auth().signOut().then(function () {
            this.setState({ loggedIn: false })
        }).catch(function (error) {
            // An error happened.
        });

    }

    componentDidMount() {
        //console.log(this.context)
        //this.fire replaces firebase 
        this.fire = this.context



        var myObject = {
            value: 0.1,
        }
        anime.timeline({
            update: function () {
                window.paperstuff.speed = myObject.value
            },
            easing: 'cubicBezier(.45,0,.55,1.15)',
        }).add({
            targets: myObject,
            duration: 300,
            value: [0.1, 1],
            easing: 'linear'
        }).add({
            targets: '#myCanvas',
            translateY: '-10vw',
            'rotate': ['-28deg', '-28deg'],
            duration: 1500
        }, 0).add({
            easing: 'linear',
            targets: myObject,
            duration: 400,
            value: [1, 0.1]
        }, 300)

    }

    render() {

        return (
            <div
                className="login app-page" >
                <div id='login-platform'>
                    <AnimatePresence>
                        {!this.state.loggedIn ? (
                            <div className='login-platform-left'>
                                <motion.div
                                    key={this.state.loggedIn ? 'loggedIn' : 'loggedOut'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='signed-in'
                                >
                                    <div className='login-form-title dutch-white'>
                                        sign up
                                    </div>
                                    <Formik
                                        initialValues={{
                                            email: '',
                                            username: '',
                                            password: '',
                                        }}
                                        onSubmit={(values) => {
                                            //need to implement email login
                                            console.log(values)

                                        }}
                                    >
                                        <Form id='login-form' >
                                            <div className="login-form-wrapper">
                                                <label className="login-form-label" htmlFor="email">EMAIL</label>
                                                <Field id="email" name="email" type="email" className="login-form" />
                                            </div>
                                            <div className="login-form-wrapper">
                                                <label className="login-form-label" htmlFor="username">USERNAME</label>
                                                <Field id="username" name="username" className="login-form" />

                                                <label className="login-form-label" htmlFor="password">PASSWORD</label>
                                                <Field id="password" name="password" type="password" className="login-form" />
                                            </div>
                                            {/* <button id='loginbutton' type="submit">Submit</button> */}
                                        </Form>
                                    </Formik>
                                    <div className='alternate-login'>
                                        <div className='alternate-login-label'>
                                            <span className='dutch-white'>OR</span> SIGN IN WITH:
                                        </div>
                                        <img className='alternate-login-png' src={gpng}
                                            onClick={this.googlesignin}
                                        />
                                        <img className='alternate-login-png' src={fbpng} />
                                        <img className='alternate-login-png' src={anonpng} />
                                    </div>
                                    <div>
                                        <span>DONT</span> HAVE AN ACCOUNT? SIGN UP <span className='dutch-white'>HERE</span>
                                    </div>

                                </motion.div>
                            </div>
                        ) : (
                                <div className='login-platform-left'>
                                    <motion.div
                                        key={this.state.loggedIn ? 'loggedIn' : 'loggedOut'}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className='signed-out'
                                    >
                                        <div className='login-form-title dutch-white'>
                                            welcome!
                                        </div>
                                        <div className='login-username-title'>
                                            USERNAME
                                        </div>
                                        <div className='login-username'>
                                            {this.state.username}
                                        </div>
                                        <div className="login-signout" onClick={this.signout}>
                                            <span>NOT</span> YOUR ACCOUNT? SIGN <span className='dutch-white'>OUT</span>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                    </AnimatePresence>
                    <div className='login-platform-right'>
                        <span >
                            <EnterButton loginType={this.state.loginType} />
                        </span>
                    </div>


                </div>

            </div>


        )
    }
}

Login.contextType = FirebaseContext;