import firebase, { firestore } from './firebasecontext'
import { leaveVideoroomSocket } from './presence';

const fire = firebase

const db = fire.firestore();


function newUserDefaults(user) {
    return {
        username: user.username,
        photoURL: user.photoURL,
        statusColor: "#32EA44",
        statusMessage: '',
        userStatus: 'status-online',
        created: fire.firestore.Timestamp.now(),
        'last-login': fire.firestore.Timestamp.now(),
        new: true,
        online: true
    }

}



export function listenToUserInfo(user) {
    console.log('listening to userinfo updates')
    return this.db.collection("users").doc(user.uid)
        .onSnapshot(function (doc) {
            if (doc) {


                console.log('user info updated setstate')

                if (this.state.online !== doc.data().online)
                    this.setState({ online: doc.data().online })

            }

        }.bind(this));
}


export async function getUserfromRef(userRef) {
    let user = await userRef.get()
    if (user.exists) {
        return user.data()
        //console.log(user.data())
    } else {
        console.error('user does not exist!!!')
    }
    //fire.firestore().doc(userRef.path)
}

export function getUserfromUid(uid) {
    return db.doc('users/' + uid).get()
}

function gotoLogin() {
    //redirect to login page if not logged in
    let loc = new URL(window.location);
    loc = loc.origin
    window.location = loc + '/login'
}



export function handleSignIn(user) {
    let userdoc = this.db.collection("users").doc(user.uid)
    console.log('signing in')
    //attempt to get doc with uid
    return userdoc.get().then((doc) => {
        return new Promise((resolve, reject) => {

            //if user does not exist then it is a new account
            if (!doc.exists) {
                //all account creation is now handled at login
                gotoLogin()
                console.log('no account found with uid: ', user.uid)
                reject('no acc')

            } else {

                //not a new account
                console.log('user signed in')
                resolve(doc.data())

            }
        })
        //always retruns user data

    })
}

function createVideoroom(userRef, uid, username) {
    //get user info then create video room with default settings
    console.log('attempting to create Videoroom: ', uid)
    const videoroomRef = db.collection('videorooms').doc()

    videoroomRef.set({
        owner: userRef,
        roomName: username + "'s room",
        new: true
    }).then(() => {
        //add new videoroom to user
        console.log('room created!')
        userRef.update({
            videoroomRef: videoroomRef,
            videoroomID: videoroomRef.id
        })
    })
    videoroomRef.collection('videoState').doc('queue').set({ queue: [] })
    videoroomRef.collection('videoState').doc('videoState').set({ videoState: [] })
    videoroomRef.collection('videoState').doc('members').set({ members: [] })

}

export function createNewUser({ uid, profilePicture, username }) {
    const userRef = db.collection('users').doc(uid)
    console.log('creating user with: ', uid, profilePicture, username)

    return userRef.set(newUserDefaults({
        username: username,
        photoURL: profilePicture,
    })).catch(e => {
        console.log('error creating new user')
        console.log(e)
    }).then(() => {
        return createVideoroom(userRef, uid, username)
    })
}

export function joinVideoroom(userRef, videoroomID) {
    //if user not already in room, join
    //console.log(userData.currentVideoroom, ' ', videoroomID)
    console.log('hello i am join videoroom ', videoroomID)
    userRef.get().then(data => {
        if (data.get('currentVideoroom') === videoroomID) {
            console.log('user is already in room ')
        } else {


            userRef.update({
                currentVideoroom: videoroomID
            }).then(() => {
                db.doc('/videorooms/' + videoroomID + '/videoState/members').update({
                    members: fire.firestore.FieldValue.arrayUnion(userRef)
                }).then(() => {

                    console.log('user successfully joined room')
                }).catch(err => {
                    console.log('err joining videoroom: ', err)
                })
            }).catch(err => {
                console.log('err updating user currentvideoroom ', err)
            })

        }
    })
    return null

}

export function leaveVideoroom(userRef) {
    //get currentRoom
    userRef.get().then(data => {

        if (
            data.get('currentVideoroom') === 'none' ||
            data.get('currentVideoroom') === undefined
        ) {
            console.log('user is not in room')
        } else {
            console.log('leave video room ', data.get('currentVideoroom'))
            leaveVideoroomSocket(data.get('currentVideoroom'))

            db.doc('/videorooms/' + data.get('currentVideoroom') + '/videoState/members').update({
                members: fire.firestore.FieldValue.arrayRemove(userRef)
            }).then(() => {
                userRef.update({
                    currentVideoroom: 'none'
                }).then(() => {



                    console.log('user successfully left room')
                }).catch(err => {
                    console.log('err updating current videoroom: ', err)
                })
            }).catch(err => {
                console.log('err leaving videoroom: ', err)
            })
        }
    })








}


export function subscribeToUserDataChange() {

}