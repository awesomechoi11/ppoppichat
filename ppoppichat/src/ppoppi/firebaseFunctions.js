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
        new: true
    }

}

function createVideoroom(userRef) {
    //get user info then create video room with default settings
    const videoroomRef = db.collection('videorooms').doc()
    const userInfo = userRef.get()
    userInfo.then(user => {
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

export async function handleSignIn(user) {
    let userdoc = this.db.collection("users").doc(user.uid)
    console.log('signing in')
    await userdoc.get().then((doc) => {
        if (!doc.exists) {
            console.log('user does not exist')
            //show new user screen

            //set defaults for firebase and state
            userdoc.set(newUserDefaults(user))
                .then(() => {
                    createVideoroom(userdoc)
                })
            this.setState({
                userName: user.displayName,
                userStatus: 'status-online',
                userPicture: user.photoURL,
                statusMessage: '',
                loggedIn: true,
            })

        } else {
            //set state with user info
            //console.log('user found ', doc.data())
            //set last login
            //set status

            this.setState({
                userName: doc.data().nickname ? doc.data().nickname : doc.data().displayName,
                userStatus: 'status-online',
                userPicture: doc.data().photoURL,
                statusMessage: doc.data().statusMessage,
                'last-login': firebase.firestore.Timestamp.now(),
                loggedIn: true,
            })
        }
    })
    console.log('user signed in')
}

