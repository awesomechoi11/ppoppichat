import { fire } from './firebasecontext'
import { leaveVideoroomSocket } from './presence';
var db = fire.firestore();


//list of fields that can be editted
// const validUserFields = [
//     'username',
//     'photoURL',
//     'statusColor',
//     'statusMessage',
//     'userStatus',
//     'last-login',
//     'new'
// ]

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

function createVideoroom(userRef) {
    //get user info then create video room with default settings
    const videoroomRef = db.collection('videorooms').doc()
    return userRef.get().then(user => {
        videoroomRef.set({
            owner: userRef,
            roomName: user.get('name') + "'s room",
            new: true
        }).then(() => {
            //add new videoroom to user
            userRef.update({
                videoroomRef: videoroomRef,
                videoroomID: videoroomRef.id
            })
        })
        videoroomRef.collection('videoState').doc('queue').set({ queue: [] })
        videoroomRef.collection('videoState').doc('videoState').set({ videoState: [] })
        videoroomRef.collection('videoState').doc('members').set({ members: [] })
    })
}
// function setDoc(docRef, obj) {
//     if (typeof obj !== 'object') {
//         console.error('setDoc failed, not a object', obj)
//         return
//     }
//     return docRef.set(obj)
// }

export function listenToUserInfo(user) {
    console.log('listening to userinfo updates')
    return this.db.collection("users").doc(user.uid)
        .onSnapshot(function (doc) {
            if (doc) {

                //var source = doc.metadata.hasPendingWrites ? "Local" : "Server";

                //console.log(source, " data: ", doc.data());
                console.log('user info updated setstate')
                // var newstate = doc.data();
                // // delete newstate['created']
                // // delete newstate['last-login']
                // // delete newstate['name']
                // // // delete newstate['currentVideoroom']
                // // // delete newstate['new']
                // // // delete newstate['photoURL']
                // // //delete newstate['statusMessage']
                // // //console.log(newstate)
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

export function createNewUser(data) {
    console.log(data)

    const userRef = db.doc('users/' + data.uid)
    return userRef.set(newUserDefaults({
        username: data.values.username,
        photoURL: data.values.profilePicture,
    })).catch(e => {
        console.log('error creating new user')
        console.log(e)
    }).then(() => {
        return createVideoroom(userRef)
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
