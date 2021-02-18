import {
    atom
} from 'recoil';

/* atoms */
//basically global variables


export const currentMode = atom({
    key: 'currentMode',
    default: 'signin',
});

export const userDataFromFirebase = atom({
    key: 'userDataFromFirebase',
    default: null
})

export const userRefFromFirebase = atom({
    key: 'userRefFromFirebase',
    default: null
})

export const userUIDFromFirebase = atom({
    key: 'userUIDFromFirebase',
    default: null
})

export const userLoginValues = atom({
    key: 'userLoginValues',
    default: {

    }
})

export const userCreateValues = atom({
    key: 'userCreateValues',
    default: {
        username: "",
        photoURL: "",
    }
})