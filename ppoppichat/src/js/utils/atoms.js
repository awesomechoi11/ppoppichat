import {
    atom
} from 'recoil';

/* atoms */
//basically global variables

//login stuff
export const currentModeAtom = atom({
    key: 'currentMode',
    default: 'signin',
});
export const userLoggedInAtom = atom({
    key: 'userLoggedIn',
    default: false,
});

export const userUIDFromFirebaseAtom = atom({
    key: 'userUIDFromFirebase',
    default: null
})

export const userLoginValuesAtom = atom({
    key: 'userLoginValues',
    default: {
        email: '',
        password: ''
    }
})

export const userCreateValuesAtom = atom({
    key: 'userCreateValues',
    default: {
        username: "",
        photoURL: "",
    }
})

//userinformation

export const userData_status = atom({
    key: 'userCreateValues',
    default: {
        message: "",
        color: "#32EA44"
    }
})
export const userData_username = atom({
    key: 'userData_username',
    default: "undefined"
})