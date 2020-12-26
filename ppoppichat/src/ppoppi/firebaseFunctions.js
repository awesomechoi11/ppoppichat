import firebase from '../home/fire'
var db = firebase.firestore();

//list of fields that can be editted
const validUserFields = [
    'nickname',
    'photoURL',
    'statusColor',
    'statusMessage',
    'userStatus',
    'last-login',
    'new'
]

function newUserDefaults(user) {
    return {
        name: user.displayName,
        nickname: user.displayName,
        photoURL: user.photoURL,
        statusColor: "#32EA44",
        statusMessage: '',
        userStatus: 'status-online',
        created: firebase.firestore.Timestamp.now(),
        'last-login': firebase.firestore.Timestamp.now(),
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
            state: 'paused',
            time: 0,
            new: true,
            members: [],
            queue: []
        }).then(() => {
            //add new videoroom to user
            userRef.update({
                videoroomRef: videoroomRef,
                videoroomID: videoroomRef.id
            })
        })
    })
}
function setDoc(docRef, obj) {
    if (typeof obj !== 'object') {
        console.error('setDoc failed, not a object', obj)
        return
    }
    return docRef.set(obj)
}

export function listenToUserInfo(user) {
    console.log('listening to userinfo updates')
    return this.db.collection("users").doc(user.uid)
        .onSnapshot(function (doc) {
            if (doc) {

                var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                console.log(source, " data: ", doc.data());
                var newstate = doc.data();
                delete newstate['created']
                delete newstate['last-login']
                delete newstate['name']
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
    //firebase.firestore().doc(userRef.path)
}

export function handleSignIn(user) {
    let userdoc = this.db.collection("users").doc(user.uid)
    console.log('signing in')
    //attempt to get doc with uid
    return userdoc.get().then((doc) => {

        //if user does not exist then it is a new account
        if (!doc.exists) {


            //show new user screen
            this.setState({
                userName: user.displayName,
                userStatus: 'status-online',
                userPicture: user.photoURL,
                statusMessage: '',
                loggedIn: true,
            })
            //set defaults for firebase and state

            console.log('creating new user: ', user.uid)
            return userdoc.set(newUserDefaults(user))
                .then(() => {
                    console.log('user signed in')
                    createVideoroom(userdoc)
                })


        } else {


            //not a new account/
            this.setState({
                userName: doc.data().nickname ? doc.data().nickname : doc.data().displayName,
                userStatus: 'status-online',
                userPicture: doc.data().photoURL,
                statusMessage: doc.data().statusMessage,
                'last-login': firebase.firestore.Timestamp.now(),
                loggedIn: true,
            })
            return new Promise((resolve, reject) => {
                console.log('user signed in')
                resolve()
            })

        }

    })
}



export function joinVideoroom(userRef, videoroomID) {
    //if user not already in room, join
    userRef.get().then(userdata => {
        if (userdata.get('currentVideoroom') === videoroomID) {
            console.log('user is already in room')
        } else {
            userRef.update({
                currentVideoroom: videoroomID
            }).then(() => {
                db.collection('videorooms').doc(videoroomID).update({
                    members: firebase.firestore.FieldValue.arrayUnion(userRef)
                }).then(() => {
                    console.log('user successfully joined room')
                }).catch(err => {
                    console.log('err joining videoroom: ', err)
                })
            })
        }
    })

}
export function leaveVideoroom(userRef) {
    //get currentRoom
    userRef.get()
        .then(userdata => {
            const videoroomID = userdata.get('currentVideoroom')
            if (videoroomID === 'none') {
                console.log('user is not in a room!')
                return
            }
            db.collection('videorooms').doc(videoroomID).update({
                members: firebase.firestore.FieldValue.arrayRemove(userRef)
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
        })
}
