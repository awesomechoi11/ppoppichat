import React from 'react';
import { useHistory } from "react-router-dom";
//import fire from './fire'

import '../sass/login.scss';

import { FirebaseContext } from './utils/firebasecontext'
import { getUserfromUid, createNewUser } from './utils/firebaseFunctions'

import anime from 'animejs/lib/anime.es.js';

import { Formik, Field, Form } from 'formik';

import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import isEqual from 'lodash.isequal'

import anonpng from '../assets/login/anon.png';
import fbpng from '../assets/login/facebook.png';
import gitpng from '../assets/login/github.png';
import gpng from '../assets/login/google.png';

import img1 from '../assets/login/starterimage/angry.png'
import img2 from '../assets/login/starterimage/index.png'
import img3 from '../assets/login/starterimage/pirate.jpg'
import img4 from '../assets/login/starterimage/ppoppi.png'
import img5 from '../assets/login/starterimage/ppoppihead.png'
import img6 from '../assets/login/starterimage/ppoppinose.png'



const loginButtonSvg = (
    <svg id='loginButtonSvg' width="120" height="120" viewBox="0 0 120 120" >
        <rect x="0.5" y="0.5" width="119" height="119" rx="29.5" stroke="black" />
        <path d="M93.7678 61.7678C94.7441 60.7915 94.7441 59.2085 93.7678 58.2322L77.8579 42.3223C76.8816 41.346 75.2986 41.346 74.3223 42.3223C73.346 43.2986 73.346 44.8816 74.3223 45.8579L88.4645 60L74.3223 74.1421C73.346 75.1184 73.346 76.7014 74.3223 77.6777C75.2986 78.654 76.8816 78.654 77.8579 77.6777L93.7678 61.7678ZM27 62.5H92V57.5H27V62.5Z" fill="black" />
    </svg>

)



function EnterButton(props) {
    //const isLoggedIn = props.isLoggedIn;
    let history = useHistory();

    var handleClick = (e) => {
        console.log('hello, handleclick is not set for enter button!!!')
    }

    if (props.mode === 'signin') {
        handleClick = (e) => {
            props.esignin()
        }
    } else if (props.mode === 'signup') {
        handleClick = (e) => {
            props.esignup()
        }
    } else if (props.mode === 'loggedin') {

        if (props.userCreation) {
            handleClick = (e) => {
                createNewUser(props.userData)
                    .then(() => {
                        history.push('/ppoppi')
                    })
            }
        } else {
            handleClick = (e) => {
                history.push('/ppoppi')
            }
        }
    } else {
        console.log('err how did u get here?? ', props)
    }
    return (
        <button id='loginbutton'
            onClick={handleClick}
        >
            {loginButtonSvg}
        </button>
    )

}

export class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = { loggedIn: false, loginType: 'email', mode: 'signin' }
        this.handleChange = this.handleChange.bind(this);
        this.googlesignin = this.googlesignin.bind(this)
        this.signout = this.signout.bind(this)
        this.githubsignin = this.githubsignin.bind(this)
        this.anonsignin = this.anonsignin.bind(this)
        this.emailsignin = this.emailsignin.bind(this)
        this.emailsignup = this.emailsignup.bind(this)
        this.handleSuccess = this.handleSuccess.bind(this)
        this.handleError = this.handleError.bind(this);

        this.values = {
            email: '',
            password: ''
        }
        this.newAccountValues = {
            username: '',

        }

    }

    toastErr(msg) {
        toast.error(msg, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    handleChange(values, create = false) {
        console.log(values, create)
        if (create) {
            this.newAccountValues = values
            if (!isEqual(this.newAccountValues, this.state.newAccountValues))
                this.setState({
                    newAccountValues: values
                })
        } else {
            this.values = values;
        }

    }

    handleSuccess(result) {
        console.log(result)
        //get once user profile from uid
        const uid = result.user.uid
        var type;
        if (result.credential) {
            type = result.credential.signInMethod
        } else {
            //anon login
            type = 'anon'
        }
        //change mode to logged in
        this.setState({
            type: type,
            uid: uid,
            mode: 'loggedin',
            userInfoLoading: true
        })

        //fetch user info with uid from login
        getUserfromUid(uid)
            .then(data => {
                console.log(data)
                if (data.exists) {
                    this.setState({
                        userInfoLoading: false,
                        newUser: false,
                        username: data.get('username')
                    })
                    console.log(data)
                } else {
                    this.setState({
                        userInfoLoading: false,
                        newUser: true
                    })
                }
            })

    }
    handleError(err) {
        this.toastErr(err.msg)
    }
    anonsignin() {
        this.fire.auth().signInAnonymously()
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    emailsignin() {
        this.fire.auth().signInWithEmailAndPassword(this.values.email, this.values.password)
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    emailsignup() {
        console.log('sign up time', this.values)
        this.fire.auth().createUserWithEmailAndPassword(this.values.email, this.values.password)
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    githubsignin() {
        this.provider = new this.fire.auth.GithubAuthProvider();
        this.fire.auth().signInWithPopup(this.provider)
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    googlesignin() {
        this.provider = new this.fire.auth.GoogleAuthProvider();
        this.fire.auth().signInWithPopup(this.provider)
            .then(this.handleSuccess)
            .catch(this.handleError);

    }

    signout() {
        //reset login message
        this.fire.auth().signOut().then(() => {
            this.setState({
                mode: 'signin',
                userInfoLoading: true
            })
        })
            .catch(this.handleError);
    }

    componentDidMount() {

        //this.fire replaces firebase 
        this.fire = this.context

        var myObject = {
            value: 0.1,
        }
        //move wave animation
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

        const altsignin = (
            <div className='alternate-login'>
                <div className='alternate-login-label'>
                    <span className='dutch-white'>OR</span> SIGN UP WITH:
                        </div>
                <img className='alternate-login-png' src={gpng}
                    alt='google login logo'
                    onClick={this.googlesignin}
                />
                <img className='alternate-login-png' src={gitpng}
                    alt='github logo'
                    onClick={this.githubsignin}
                />
                <img className='alternate-login-png' src={anonpng}
                    onClick={this.anonsignin}
                    alt='anon mask' />
            </div>
        )


        var loginPlatformLeft;

        if (this.state.mode === 'signin') {
            loginPlatformLeft = (
                <motion.div
                    key={'loggedOut'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='signed-in'
                >
                    <div className='login-form-title dutch-white'>
                        sign in
                </div>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}>
                        {props => (
                            <>
                                {this.handleChange(props.values)}
                                <Form id='login-form' >
                                    <div className="login-form-wrapper">
                                        <label className="login-form-label" htmlFor="email">EMAIL</label>
                                        <Field id="email" name="email" type="email" className="login-form" />
                                    </div>
                                    <div className="login-form-wrapper">
                                        <label className="login-form-label" htmlFor="password">PASSWORD</label>
                                        <Field id="password" name="password" type="password" className="login-form" />
                                    </div>
                                    {/* <button id='loginbutton' type="submit">Submit</button> */}
                                </Form>
                            </>
                        )}
                    </Formik>
                    {altsignin}
                    <div className='here-button'
                        onClick={e => {
                            this.setState({ mode: 'signup' })
                        }}
                    >
                        <span>DONT</span> HAVE AN ACCOUNT? SIGN UP <span className='dutch-white'>HERE</span>
                    </div>

                </motion.div>
            )
        } else if (this.state.mode === 'signup') {
            loginPlatformLeft = (
                <motion.div
                    key={'loggedOut'}
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
                            password: '',
                        }}
                    >
                        {props => (
                            <>
                                {this.handleChange(props.values)}
                                <Form id='login-form' >
                                    <div className="login-form-wrapper">
                                        <label className="login-form-label" htmlFor="email">EMAIL</label>
                                        <Field id="email" name="email" type="email" className="login-form" />
                                    </div>
                                    <div className="login-form-wrapper">
                                        <label className="login-form-label" htmlFor="password">PASSWORD</label>
                                        <Field id="password" name="password" type="password" className="login-form" />
                                    </div>
                                    {/* <button id='loginbutton' type="submit">Submit</button> */}
                                </Form>
                            </>
                        )}
                    </Formik>
                    {altsignin}
                    <div className='here-button'
                        onClick={e => {
                            this.setState({ mode: 'signin' })
                        }}
                    >
                        <span>ALREADY</span> HAVE AN ACCOUNT? SIGN IN <span className='dutch-white'>HERE</span>
                    </div>

                </motion.div>
            )
        } else if (this.state.mode === 'loggedin') {
            if (!this.state.userInfoLoading) {
                loginPlatformLeft = (
                    <motion.div
                        key={'loggedIn'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='signed-out'
                    >
                        {!this.state.newUser ? (
                            <>
                                <div className='login-form-title dutch-white'>
                                    welcome!
                                </div>
                                <div className='login-username-title'>
                                    USERNAME
                                </div>
                                <div className='login-username'>
                                    {this.state.username}
                                </div>
                            </>
                        ) : (//new user creation screen
                                <>
                                    <div className='login-form-title dutch-white'>
                                        welcome!
                                </div>
                                    <Formik
                                        initialValues={{
                                            username: '',
                                            profilePicture: img1
                                        }}>
                                        {props => (
                                            <>
                                                {this.handleChange(props.values, true)}
                                                <Form id='user-create' >
                                                    <div className="login-form-wrapper">
                                                        <label className="login-form-label" htmlFor="username">CHOOSE A USERNAME</label>
                                                        <Field id="username" name="username" className="login-form" />
                                                    </div>
                                                    <div className='profile-picture-label'>
                                                        CHOOSE A PROFILE PICTURE
                                                    </div>
                                                    <div className='profile-picture-radio-wrapper'>
                                                        <img
                                                            className='profile-picture-selected'
                                                            src={props.values.profilePicture}
                                                            alt='selected profile'
                                                        ></img>
                                                        <div className='profile-picture-grid'>
                                                            <div>
                                                                <Field type="radio" id='choice1' className='profile-picture-choice' name="profilePicture" value={img1} />
                                                                <label className="profile-picture-item" htmlFor="choice1" style={{ backgroundImage: `url(${img1})` }} ></label>
                                                            </div>
                                                            <div>

                                                                <Field type="radio" id='choice2' className='profile-picture-choice' name="profilePicture" value={img2} />
                                                                <label className="profile-picture-item" htmlFor="choice2" style={{ backgroundImage: `url(${img2})` }} ></label>
                                                            </div>
                                                            <div>

                                                                <Field type="radio" id='choice3' className='profile-picture-choice' name="profilePicture" value={img3} />
                                                                <label className="profile-picture-item" htmlFor="choice3" style={{ backgroundImage: `url(${img3})` }} ></label>
                                                            </div>
                                                            <div>
                                                                <Field type="radio" id='choice4' className='profile-picture-choice' name="profilePicture" value={img4} />
                                                                <label className="profile-picture-item" htmlFor="choice4" style={{ backgroundImage: `url(${img4})` }} ></label>
                                                            </div>
                                                            <div>
                                                                <Field type="radio" id='choice5' className='profile-picture-choice' name="profilePicture" value={img5} />
                                                                <label className="profile-picture-item" htmlFor="choice5" style={{ backgroundImage: `url(${img5})` }} ></label>
                                                            </div>
                                                            <div>
                                                                <Field type="radio" id='choice6' className='profile-picture-choice' name="profilePicture" value={img6} />
                                                                <label className="profile-picture-item" htmlFor="choice6" style={{ backgroundImage: `url(${img6})` }} ></label>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Form>
                                            </>
                                        )}
                                    </Formik>
                                </>
                            )}

                        <div className="here-button login-signout-create" onClick={this.signout}>
                            <span>NOT</span> YOUR ACCOUNT? SIGN <span className='dutch-white'>OUT</span>
                        </div>
                    </motion.div>
                )
            } else {
                loginPlatformLeft = (
                    <motion.div
                        key={'loggedIn'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='signed-out'
                    >
                        <div className='login-form-title dutch-white'>
                            loading...
                        </div>
                    </motion.div>
                )
            }
        }



        return (
            <div
                className="login app-page" >
                <ToastContainer />
                <div id='login-platform'>
                    <AnimatePresence>
                        <div className='login-platform-left'>
                            {loginPlatformLeft}
                        </div>
                    </AnimatePresence>
                    <div className='login-platform-right'>
                        <span >
                            <EnterButton
                                userCreation={this.state.newUser}
                                mode={this.state.mode}
                                userData={{
                                    values: this.state.newAccountValues,
                                    uid: this.state.uid
                                }}
                                esignin={this.emailsignin}
                                esignup={this.emailsignup}
                            />
                        </span>
                    </div>


                </div>

            </div>


        )
    }
}

Login.contextType = FirebaseContext;