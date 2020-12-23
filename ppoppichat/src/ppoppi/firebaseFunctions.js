

export async function handleSignIn(user, db) {
    db.collection("users").doc(user.uid).get().then((doc) => {
        if (!doc.exists) {
            this.setState({
                userName: user.displayName,
                userStatus: 'status-online',
                userPicture: user.photoURL
            })
        } else {
            //set state with user info

            this.setState({
                userName: doc.nickname ? doc.nickname : doc.displayName,
                userStatus: 'status-online',
                userPicture: user.photoURL
            })
        }
    })
}

