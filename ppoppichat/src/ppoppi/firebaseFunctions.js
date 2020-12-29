import { fire } from '../firebasecontext'
import { leaveVideoroomSocket, joinVideoroomSocket } from './presence';
var db = fire.firestore();


//list of fields that can be editted
// const validUserFields = [
//     'nickname',
//     'photoURL',
//     'statusColor',
//     'statusMessage',
//     'userStatus',
//     'last-login',
//     'new'
// ]

function newUserDefaults(user) {
    return {
        name: user.displayName,
        nickname: user.displayName,
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
                var newstate = doc.data();
                delete newstate['created']
                delete newstate['last-login']
                delete newstate['name']
                //delete newstate['statusMessage']
                //console.log(newstate)

                this.setState(newstate)

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

export function handleSignIn(user) {
    let userdoc = this.db.collection("users").doc(user.uid)
    console.log('signing in')
    //attempt to get doc with uid
    return userdoc.get().then((doc) => {

        //if user does not exist then it is a new account
        if (!doc.exists) {

            //set defaults for firebase and state

            console.log('creating new user: ', user.uid)
            return userdoc.set(newUserDefaults(user))
                .then(() => {
                    console.log('user signed in')
                    createVideoroom(userdoc)
                })


        } else {

            //not a new account
            return new Promise((resolve, reject) => {
                console.log('user signed in')
                resolve()
            })

        }

    })
}



export function joinVideoroom(userData, videoroomID) {
    //if user not already in room, join

    console.log(userData.currentVideoroom, ' ', videoroomID)
    if (userData.currentVideoroom === videoroomID) {
        console.log('user is already in room')
    } else {

        joinVideoroomSocket(videoroomID)

        userData.userRef.update({
            currentVideoroom: videoroomID
        }).then(() => {
            db.doc('/videorooms/' + videoroomID + '/videoState/members').update({
                members: fire.firestore.FieldValue.arrayUnion(userData.userRef)
            }).then(() => {



                console.log('user successfully joined room')
            }).catch(err => {
                console.log('err joining videoroom: ', err)
            })
        }).catch(err => {
            console.log('err updating user currentvideoroom ', err)
        })

    }




}
export function leaveVideoroom(userData) {
    //get currentRoom
    if (userData.currentVideoroom === undefined) {
        return
    }
    if (userData.currentVideoroom === 'none') {
        console.log('user is not in a room!')
    } else {
        console.log('leave video room')
        console.log(userData.currentVideoroom)

        leaveVideoroomSocket(userData.currentVideoroom)

        db.doc('/videorooms/' + userData.currentVideoroom + '/videoState/members').update({
            members: fire.firestore.FieldValue.arrayRemove(userData.userRef)
        }).then(() => {
            userData.userRef.update({
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




}
