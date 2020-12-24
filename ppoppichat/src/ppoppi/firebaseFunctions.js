import firebase from '../home/fire'

function newUserDefaults(user) {
    return {
        name: user.displayName,
        nickname: user.displayName,
        photoURL: user.photoURL,
        statusColor: "#32EA44",
        statusMessage: '',
        userStatus: 'status-online',
        created: firebase.firestore.Timestamp.now(),
        'last-login': firebase.firestore.Timestamp.now()
    }

}

export function listenToUserInfo(user) {
    return this.db.collection("users").doc(user.uid)
        .onSnapshot(function (doc) {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source, " data: ", doc.data());
            var newstate = doc.data();
            delete newstate['created']
            delete newstate['last-login']
            delete newstate['name']
            //console.log(newstate)

            this.setState(newstate)

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
    userdoc.get().then((doc) => {
        if (!doc.exists) {
            console.log('user does not exist')
            //show new user screen

            //set defaults for firebase and state
            userdoc.set(newUserDefaults(user))
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
}

